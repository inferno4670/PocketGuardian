import { useState, useEffect } from "react";
import { Shield } from "lucide-react";
import { ModeSelector } from "@/components/mode-selector";
import { ItemChecklist } from "@/components/item-checklist";
import { ScanButton } from "@/components/scan-button";
import { AlertModal } from "@/components/alert-modal";
import { saveToHistory } from "@/lib/storage";
import type { ItemStatus } from "@shared/schema";

export default function Home() {
  const [currentMode, setCurrentMode] = useState("Daily");
  const [items, setItems] = useState<ItemStatus[]>([]);
  const [alertState, setAlertState] = useState<{
    isVisible: boolean;
    type: "success" | "warning";
    title: string;
    message: string;
    playAlarm: boolean;
  }>({
    isVisible: false,
    type: "success",
    title: "",
    message: "",
    playAlarm: false
  });
  const [lastScanTime, setLastScanTime] = useState<string>("");

  // Load last scan time from localStorage
  useEffect(() => {
    const savedScanTime = localStorage.getItem("lastScanTime");
    if (savedScanTime) {
      const time = new Date(savedScanTime);
      const now = new Date();
      const diffMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));
      
      if (diffMinutes < 1) {
        setLastScanTime("Just now");
      } else if (diffMinutes === 1) {
        setLastScanTime("1 minute ago");
      } else if (diffMinutes < 60) {
        setLastScanTime(`${diffMinutes} minutes ago`);
      } else {
        const hours = Math.floor(diffMinutes / 60);
        setLastScanTime(hours === 1 ? "1 hour ago" : `${hours} hours ago`);
      }
    }
  }, []);

  const handleScanComplete = (result: { items: ItemStatus[], allDetected: boolean, missingItems: string[] }) => {
    setItems(result.items);
    setLastScanTime("Just now");
    localStorage.setItem("lastScanTime", new Date().toISOString());

    if (result.allDetected) {
      setAlertState({
        isVisible: true,
        type: "success",
        title: "All Items Ready!",
        message: "✅ All your essentials are detected",
        playAlarm: false
      });
    } else {
      const missingItems = result.missingItems.join(", ");
      
      // Save each missing item to localStorage history
      const currentTime = new Date().toISOString();
      result.missingItems.forEach(itemName => {
        saveToHistory({
          item_name: itemName,
          mode: currentMode,
          timestamp: currentTime
        });
      });

      setAlertState({
        isVisible: true,
        type: "warning", 
        title: "Items Missing!",
        message: `⚠️ ${missingItems} missing!`,
        playAlarm: true
      });
    }
  };

  const closeAlert = () => {
    setAlertState(prev => ({ ...prev, isVisible: false, playAlarm: false }));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 max-w-md mx-auto w-full px-4 py-6">
        <div className="space-y-6">
          {/* Hero Section */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-foreground flex items-center justify-center gap-2">
              <Shield className="h-8 w-8 text-primary" />
              Pocket Guardian
            </h1>
            <p className="text-muted-foreground">Never forget your essentials</p>
          </div>

          {/* Mode Selection */}
          <ModeSelector value={currentMode} onValueChange={setCurrentMode} />

          {/* Items Checklist */}
          <ItemChecklist mode={currentMode} items={items} />

          {/* Scan Button */}
          <ScanButton mode={currentMode} onScanComplete={handleScanComplete} />

          {/* Last Scan Info */}
          {lastScanTime && (
            <div className="text-center text-sm text-muted-foreground">
              <p>Last scan: <span data-testid="last-scan-time">{lastScanTime}</span></p>
            </div>
          )}
        </div>
      </main>

      {/* Alert Modal */}
      <AlertModal
        isVisible={alertState.isVisible}
        type={alertState.type}
        title={alertState.title}
        message={alertState.message}
        playAlarm={alertState.playAlarm}
        onClose={closeAlert}
      />
    </div>
  );
}
