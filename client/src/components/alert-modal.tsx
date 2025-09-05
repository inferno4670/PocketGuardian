import { CheckCircle, AlertTriangle, X, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { alarmManager } from "@/lib/storage";
import { useEffect } from "react";

interface AlertModalProps {
  isVisible: boolean;
  type: "success" | "warning";
  title: string;
  message: string;
  onClose: () => void;
  playAlarm?: boolean;
}

export function AlertModal({ isVisible, type, title, message, onClose, playAlarm = false }: AlertModalProps) {
  useEffect(() => {
    if (isVisible && type === "warning" && playAlarm) {
      alarmManager.startAlarm();
    }
    
    return () => {
      if (alarmManager.isAlarmPlaying()) {
        alarmManager.stopAlarm();
      }
    };
  }, [isVisible, type, playAlarm]);

  const handleClose = () => {
    if (alarmManager.isAlarmPlaying()) {
      alarmManager.stopAlarm();
    }
    onClose();
  };

  if (!isVisible) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 modal-backdrop flex items-center justify-center p-4 z-50"
      onClick={(e) => e.target === e.currentTarget && handleClose()}
      data-testid="modal-alert"
    >
      <div className="bg-card rounded-lg border border-border p-6 max-w-sm w-full mx-4 shadow-xl slide-up">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center">
            {type === "success" ? (
              <CheckCircle className="w-8 h-8 text-primary" />
            ) : (
              <AlertTriangle className="w-8 h-8 text-destructive" />
            )}
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-foreground" data-testid="alert-title">
              {title}
            </h3>
            <p className="text-muted-foreground" data-testid="alert-message">
              {message}
            </p>
            {alarmManager.isAlarmPlaying() && (
              <div className="flex items-center justify-center gap-2 text-destructive text-sm">
                <VolumeX className="w-4 h-4" />
                <span>Alarm is playing</span>
              </div>
            )}
          </div>
          
          <Button
            data-testid="button-alert-close"
            onClick={handleClose}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-2 px-4 rounded-md font-medium transition-colors duration-200"
          >
            {alarmManager.isAlarmPlaying() ? "Dismiss Alarm" : "OK"}
          </Button>
        </div>
      </div>
    </div>
  );
}
