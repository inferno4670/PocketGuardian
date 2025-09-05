import { Button } from "@/components/ui/button";
import { Search, Bluetooth } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { getModeItems } from "@/lib/modes";
import { getItemsForMode, getBLEDevices, bleScanner } from "@/lib/storage";
import type { FastApiScanResponse, FastApiItemStatus, ItemStatus } from "@shared/schema";

interface ScanButtonProps {
  mode: string;
  onScanComplete: (result: { items: ItemStatus[], allDetected: boolean, missingItems: string[] }) => void;
}

export function ScanButton({ mode, onScanComplete }: ScanButtonProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const scanMutation = useMutation({
    mutationFn: async (): Promise<ItemStatus[]> => {
      // Get current items for this mode (including custom items)
      const modeConfig = getModeItems(mode);
      const defaultItems = modeConfig.map(item => item.name);
      const currentItems = getItemsForMode(mode, defaultItems);
      
      // Get registered BLE devices
      const bleDevices = getBLEDevices();
      const bleResults: { [itemName: string]: boolean } = {};
      
      // Scan for BLE devices first if any are registered
      if (Object.keys(bleDevices).length > 0) {
        try {
          // Check if Web Bluetooth is available
          if (navigator.bluetooth) {
            const devices = await navigator.bluetooth.getDevices();
            
            // Check each registered BLE device
            for (const [itemName, bleDevice] of Object.entries(bleDevices)) {
              if (bleDevice.deviceId) {
                try {
                  // Find the device in the known devices list
                  const device = devices.find((d: any) => d.id === bleDevice.deviceId);
                  
                  if (device) {
                    // Attempt to connect to check if device is present
                    if (device.gatt && !device.gatt.connected) {
                      try {
                        await device.gatt.connect();
                        bleResults[itemName] = true;
                        // Disconnect immediately to avoid keeping connections open
                        device.gatt.disconnect();
                      } catch (connectError) {
                        console.warn(`Failed to connect to ${itemName}:`, connectError);
                        bleResults[itemName] = false;
                      }
                    } else {
                      bleResults[itemName] = device.gatt?.connected || false;
                    }
                  } else {
                    bleResults[itemName] = false;
                  }
                } catch (error) {
                  console.warn(`BLE scan failed for ${itemName}:`, error);
                  bleResults[itemName] = false;
                }
              }
            }
          } else {
            console.warn("Web Bluetooth API not available");
          }
        } catch (error) {
          console.warn("BLE scanning failed:", error);
        }
      }
      
      // Create items list combining BLE results and simulated results
      const items: ItemStatus[] = currentItems.map(itemName => {
        // If item has BLE device registered, use BLE scan result
        if (bleDevices[itemName]) {
          return {
            name: itemName,
            detected: bleResults[itemName] || false
          };
        }
        
        // Otherwise simulate detection (for non-BLE items)
        return {
          name: itemName,
          detected: Math.random() > 0.3 // 70% chance of detection
        };
      });
      
      return items;
    },
    onSuccess: (items) => {
      const missingItems = items.filter(item => !item.detected).map(item => item.name);
      const allDetected = missingItems.length === 0;
      
      onScanComplete({
        items,
        allDetected,
        missingItems
      });
      
      queryClient.invalidateQueries({ queryKey: ["/history"] });
    },
    onError: (error) => {
      toast({
        title: "Scan Failed",
        description: "Unable to scan items. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleScan = () => {
    scanMutation.mutate();
  };

  return (
    <Button
      data-testid="button-scan"
      onClick={handleScan}
      disabled={scanMutation.isPending}
      className={`w-full bg-primary hover:bg-primary/90 text-primary-foreground py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg ${
        scanMutation.isPending ? "scan-pulse" : ""
      }`}
    >
      {scanMutation.isPending ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
          <span>Scanning...</span>
        </>
      ) : (
        <>
          <Search className="w-4 h-4" />
          <Bluetooth className="w-4 h-4" />
          <span>Scan Items</span>
        </>
      )}
    </Button>
  );
}
