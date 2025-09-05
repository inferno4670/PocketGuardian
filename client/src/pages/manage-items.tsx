import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, Plus, Trash2, Save, RefreshCw, Bluetooth, Link, Unlink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { modes as defaultModes } from "@/lib/modes";
import { getBLEDevices, registerBLEDevice, unregisterBLEDevice } from "@/lib/storage";

interface CustomModeItems {
  [mode: string]: string[];
}

export default function ManageItems() {
  const { toast } = useToast();
  const [selectedMode, setSelectedMode] = useState("Daily");
  const [customItems, setCustomItems] = useState<CustomModeItems>({});
  const [newItemName, setNewItemName] = useState("");
  const [currentItems, setCurrentItems] = useState<string[]>([]);
  const [bleDevices, setBleDevices] = useState<any>({});
  const [isLinkingBLE, setIsLinkingBLE] = useState<string | null>(null);

  // Load custom items and BLE devices from localStorage on component mount
  useEffect(() => {
    const savedCustomItems = localStorage.getItem("pocketguardian_custom_items");
    if (savedCustomItems) {
      try {
        const parsed = JSON.parse(savedCustomItems);
        setCustomItems(parsed);
      } catch (error) {
        console.error("Failed to parse custom items from localStorage:", error);
      }
    }
    
    // Load BLE devices
    setBleDevices(getBLEDevices());
  }, []);

  // Update current items when mode or custom items change
  useEffect(() => {
    const items = customItems[selectedMode] || getDefaultItemsForMode(selectedMode);
    setCurrentItems(items);
  }, [selectedMode, customItems]);

  const getDefaultItemsForMode = (mode: string): string[] => {
    const modeConfig = defaultModes[mode];
    return modeConfig ? modeConfig.items.map(item => item.name) : [];
  };

  const saveToLocalStorage = (updatedCustomItems: CustomModeItems) => {
    localStorage.setItem("pocketguardian_custom_items", JSON.stringify(updatedCustomItems));
    setCustomItems(updatedCustomItems);
  };

  const addNewItem = () => {
    if (!newItemName.trim()) {
      toast({
        title: "Invalid Item",
        description: "Please enter a valid item name.",
        variant: "destructive",
      });
      return;
    }

    if (currentItems.includes(newItemName.trim())) {
      toast({
        title: "Duplicate Item",
        description: "This item already exists in the current mode.",
        variant: "destructive",
      });
      return;
    }

    const updatedItems = [...currentItems, newItemName.trim()];
    const updatedCustomItems = {
      ...customItems,
      [selectedMode]: updatedItems
    };

    saveToLocalStorage(updatedCustomItems);
    setNewItemName("");
    
    toast({
      title: "Item Added",
      description: `"${newItemName.trim()}" has been added to ${selectedMode} mode.`,
    });
  };

  const removeItem = (itemToRemove: string) => {
    const updatedItems = currentItems.filter(item => item !== itemToRemove);
    const updatedCustomItems = {
      ...customItems,
      [selectedMode]: updatedItems
    };

    saveToLocalStorage(updatedCustomItems);
    
    toast({
      title: "Item Removed",
      description: `"${itemToRemove}" has been removed from ${selectedMode} mode.`,
    });
  };

  const resetToDefault = () => {
    const updatedCustomItems = { ...customItems };
    delete updatedCustomItems[selectedMode];
    saveToLocalStorage(updatedCustomItems);
    
    toast({
      title: "Reset Complete",
      description: `${selectedMode} mode has been reset to default items.`,
    });
  };

  const linkBLEDevice = async (itemName: string) => {
    try {
      setIsLinkingBLE(itemName);
      
      if (!navigator.bluetooth) {
        toast({
          title: "Bluetooth Not Supported",
          description: "Web Bluetooth API is not supported in this browser. Please use Chrome, Edge, or another supported browser.",
          variant: "destructive",
        });
        return;
      }

      // Request BLE device using Web Bluetooth API
      const device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: ['generic_access', 'generic_attribute', 'device_information']
      });
      
      if (device && device.id) {
        // Save to localStorage
        const bleDevice = {
          id: device.id,
          name: itemName,
          deviceId: device.id
        };
        
        registerBLEDevice(itemName, bleDevice);
        setBleDevices(getBLEDevices()); // Refresh BLE devices
        
        toast({
          title: "BLE Tag Registered",
          description: `${itemName} has been linked to BLE device: ${device.name || device.id}`,
        });
      }
    } catch (error: any) {
      console.error("BLE linking failed:", error);
      
      if (error.name === 'NotFoundError') {
        toast({
          title: "No Device Selected",
          description: "No Bluetooth device was selected for pairing.",
          variant: "destructive",
        });
      } else if (error.name === 'NotAllowedError') {
        toast({
          title: "Permission Denied",
          description: "Bluetooth access was denied. Please allow Bluetooth permissions and try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Registration Failed",
          description: "Failed to register BLE tag. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsLinkingBLE(null);
    }
  };

  const unlinkBLEDevice = (itemName: string) => {
    unregisterBLEDevice(itemName);
    setBleDevices(getBLEDevices()); // Refresh BLE devices
    toast({
      title: "BLE Tag Removed",
      description: `${itemName} has been unlinked from its BLE tag.`,
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 max-w-md mx-auto w-full px-4 py-6">
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold text-foreground flex items-center justify-center gap-2">
              <Settings className="h-6 w-6 text-primary" />
              Manage Items
            </h1>
            <p className="text-muted-foreground">Customize items for each scanning mode</p>
          </div>

          {/* Mode Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Select Mode</CardTitle>
              <CardDescription>Choose which mode to customize</CardDescription>
            </CardHeader>
            <CardContent>
              <Select value={selectedMode} onValueChange={setSelectedMode}>
                <SelectTrigger data-testid="mode-selector-manage">
                  <SelectValue placeholder="Select a mode" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(defaultModes).map((modeName) => (
                    <SelectItem key={modeName} value={modeName} data-testid={`mode-${modeName.toLowerCase()}`}>
                      {modeName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Current Items */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Current Items for {selectedMode}</CardTitle>
              <CardDescription>{currentItems.length} items configured</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {currentItems.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">
                    No items configured for this mode
                  </p>
                ) : (
                  currentItems.map((item, index) => {
                    const isLinkedToBLE = bleDevices[item];
                    return (
                      <div
                        key={index}
                        data-testid={`item-${item.toLowerCase().replace(/\s+/g, '-')}`}
                        className="flex items-center justify-between p-3 bg-secondary/30 rounded-md"
                      >
                        <div className="flex items-center gap-2 flex-1">
                          <span className="font-medium">{item}</span>
                          {isLinkedToBLE && (
                            <div className="flex items-center gap-1 text-xs text-blue-600">
                              <Bluetooth className="w-3 h-3" />
                              <span>BLE</span>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {isLinkedToBLE ? (
                            <Button
                              data-testid={`remove-ble-${item.toLowerCase().replace(/\s+/g, '-')}`}
                              onClick={() => unlinkBLEDevice(item)}
                              variant="outline"
                              size="sm"
                              className="h-8 px-3 text-xs"
                              title="Remove BLE Tag"
                            >
                              <Unlink className="w-3 h-3 mr-1" />
                              Remove BLE
                            </Button>
                          ) : (
                            <Button
                              data-testid={`register-ble-${item.toLowerCase().replace(/\s+/g, '-')}`}
                              onClick={() => linkBLEDevice(item)}
                              disabled={isLinkingBLE === item}
                              variant="outline"
                              size="sm"
                              className="h-8 px-3 text-xs"
                              title="Register BLE Tag"
                            >
                              {isLinkingBLE === item ? (
                                <>
                                  <div className="animate-spin rounded-full h-3 w-3 border border-current border-t-transparent mr-1"></div>
                                  Pairing...
                                </>
                              ) : (
                                <>
                                  <Bluetooth className="w-3 h-3 mr-1" />
                                  Register BLE
                                </>
                              )}
                            </Button>
                          )}
                          <Button
                            data-testid={`remove-${item.toLowerCase().replace(/\s+/g, '-')}`}
                            onClick={() => removeItem(item)}
                            variant="destructive"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>

          {/* Add New Item */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Add New Item</CardTitle>
              <CardDescription>Enter a new item to add to {selectedMode} mode</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="new-item">Item Name</Label>
                  <Input
                    id="new-item"
                    data-testid="input-new-item"
                    type="text"
                    placeholder="e.g., Water Bottle, Laptop, etc."
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addNewItem()}
                  />
                </div>
                <Button
                  data-testid="button-add-item"
                  onClick={addNewItem}
                  className="w-full"
                  disabled={!newItemName.trim()}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Item
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="space-y-3">
            <Button
              data-testid="button-reset-mode"
              onClick={resetToDefault}
              variant="outline"
              className="w-full"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Reset {selectedMode} to Default
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}