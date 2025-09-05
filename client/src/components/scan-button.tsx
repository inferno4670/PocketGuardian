import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { FastApiScanResponse, FastApiItemStatus, ItemStatus } from "@shared/schema";

interface ScanButtonProps {
  mode: string;
  onScanComplete: (result: { items: ItemStatus[], allDetected: boolean, missingItems: string[] }) => void;
}

export function ScanButton({ mode, onScanComplete }: ScanButtonProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const scanMutation = useMutation({
    mutationFn: async (): Promise<FastApiScanResponse> => {
      const response = await apiRequest("GET", `/scan?mode=${encodeURIComponent(mode)}`);
      return response.json();
    },
    onSuccess: (result) => {
      // Transform FastAPI response to expected format
      const items: ItemStatus[] = result.items.map((item: FastApiItemStatus) => ({
        name: item.name,
        detected: item.status === "detected"
      }));
      
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
