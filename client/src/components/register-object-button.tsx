import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Bluetooth, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { bleScanner } from "@/lib/storage";

interface RegisterObjectButtonProps {
  onDeviceRegistered?: () => void;
}

export function RegisterObjectButton({ onDeviceRegistered }: RegisterObjectButtonProps) {
  const [isRegistering, setIsRegistering] = useState(false);
  const { toast } = useToast();

  const handleRegisterDevice = async () => {
    try {
      setIsRegistering(true);
      
      // Prompt user for object name first
      const itemName = prompt("Enter the name of the object you want to register:");
      if (!itemName) {
        return;
      }

      // Check if Web Bluetooth is supported
      if (!navigator.bluetooth) {
        toast({
          title: "Bluetooth Not Supported",
          description: "Web Bluetooth API is not supported in this browser. Please use Chrome, Edge, or another supported browser.",
          variant: "destructive",
        });
        return;
      }

      // Request BLE device pairing
      const device = await bleScanner.requestDevice(itemName);
      
      if (device) {
        toast({
          title: "Device Registered",
          description: `${itemName} has been successfully paired and registered.`,
        });
        
        if (onDeviceRegistered) {
          onDeviceRegistered();
        }
      }
    } catch (error: any) {
      console.error("Device registration failed:", error);
      
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
          description: error.message || "Failed to register BLE device. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <Button
      onClick={handleRegisterDevice}
      disabled={isRegistering}
      data-testid="button-register-object"
      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2"
    >
      {isRegistering ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
          Pairing Device...
        </>
      ) : (
        <>
          <Plus className="w-4 h-4" />
          <Bluetooth className="w-4 h-4" />
          Register Object
        </>
      )}
    </Button>
  );
}