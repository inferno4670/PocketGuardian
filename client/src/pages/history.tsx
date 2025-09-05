import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle, CheckCircle, Clock, Trash2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { FastApiHistoryItem } from "@shared/schema";

export default function History() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: history, isLoading } = useQuery<FastApiHistoryItem[]>({
    queryKey: ["/history"],
  });

  const clearHistoryMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("DELETE", "/history");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/history"] });
      toast({
        title: "History Cleared",
        description: "All scan history has been cleared successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to clear history. Please try again.",
        variant: "destructive",
      });
    },
  });

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMinutes < 60) {
      if (diffMinutes < 1) return "Just now";
      return diffMinutes === 1 ? "1 minute ago" : `${diffMinutes} minutes ago`;
    } else if (diffHours < 24) {
      return diffHours === 1 ? "1 hour ago" : `${diffHours} hours ago`;
    } else if (diffDays === 1) {
      return "Yesterday at " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString() + " at " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-1 max-w-md mx-auto w-full px-4 py-6">
          <div className="space-y-6">
            {/* Header */}
            <div className="text-center space-y-2">
              <h1 className="text-2xl font-bold text-foreground flex items-center justify-center gap-2">
                <Clock className="h-6 w-6 text-primary" />
                Scan History
              </h1>
              <p className="text-muted-foreground">Track your past missing items</p>
            </div>

            {/* Loading skeletons */}
            <div className="bg-card rounded-lg border border-border p-4 shadow-sm">
              <h2 className="text-lg font-semibold text-foreground mb-4">Recent Events</h2>
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-md">
                    <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 max-w-md mx-auto w-full px-4 py-6">
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold text-foreground flex items-center justify-center gap-2">
              <Clock className="h-6 w-6 text-primary" />
              Scan History
            </h1>
            <p className="text-muted-foreground">Track your past missing items</p>
          </div>

          {/* History List */}
          <div className="bg-card rounded-lg border border-border p-4 shadow-sm">
            <h2 className="text-lg font-semibold text-foreground mb-4">Recent Events</h2>
            
            {!history || history.length === 0 ? (
              <div className="text-center py-8" data-testid="empty-history">
                <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No scan history yet</p>
                <p className="text-sm text-muted-foreground mt-1">Your scan events will appear here</p>
              </div>
            ) : (
              <div className="space-y-3">
                {history.map((event) => (
                  <div
                    key={event.id}
                    data-testid={`history-item-${event.id}`}
                    className="flex items-start gap-3 p-3 rounded-md slide-up bg-destructive/5 border-l-4 border-destructive"
                  >
                    <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-0.5 bg-destructive/10">
                      <AlertTriangle className="w-4 h-4 text-destructive" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">
                        {event.item_name} missing in {event.mode}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatTimestamp(event.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Clear History Button */}
          {history && history.length > 0 && (
            <Button
              data-testid="button-clear-history"
              onClick={() => clearHistoryMutation.mutate()}
              disabled={clearHistoryMutation.isPending}
              variant="secondary"
              className="w-full py-3 px-6 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              {clearHistoryMutation.isPending ? "Clearing..." : "Clear History"}
            </Button>
          )}
        </div>
      </main>
    </div>
  );
}
