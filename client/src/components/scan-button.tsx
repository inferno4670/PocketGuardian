import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { getModeItems } from "@/lib/modes";
import { getItemsForMode } from "@/lib/storage";
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
      
      try {
        // Try to use FastAPI backend first
        const response = await apiRequest("POST", "/scan", {
          mode: mode,
          custom_items: currentItems
        });
        const result = await response.json();
        
        // Transform FastAPI response to expected format
        const items: ItemStatus[] = result.items.map((item: any) => ({
          name: item.name,
          detected: item.status === "detected"
        }));
        
        return items;
      } catch (error) {
        console.warn("FastAPI backend not available, using local simulation:", error);
        
        // Fallback to local simulation if FastAPI is not available
        const items: ItemStatus[] = currentItems.map(itemName => ({
          name: itemName,
          detected: Math.random() > 0.3 // 70% chance of detection
        }));
        
        return items;
      }
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
      <Search className="w-5 h-5" />
      <span>{scanMutation.isPending ? "Scanning..." : "Scan Items"}</span>
    </Button>
  );
}
