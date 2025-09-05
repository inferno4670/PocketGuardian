import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { ScanRequest, ScanResponse } from "@shared/schema";

interface ScanButtonProps {
  mode: string;
  onScanComplete: (result: ScanResponse) => void;
}

export function ScanButton({ mode, onScanComplete }: ScanButtonProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const scanMutation = useMutation({
    mutationFn: async (scanData: ScanRequest): Promise<ScanResponse> => {
      const response = await apiRequest("POST", "/api/scan", scanData);
      return response.json();
    },
    onSuccess: (result) => {
      onScanComplete(result);
      queryClient.invalidateQueries({ queryKey: ["/api/history"] });
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
    scanMutation.mutate({ mode });
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
