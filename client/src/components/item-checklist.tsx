import { CheckCircle, XCircle, ListChecks } from "lucide-react";
import { getModeItems } from "@/lib/modes";
import type { ItemStatus } from "@shared/schema";

interface ItemChecklistProps {
  mode: string;
  items: ItemStatus[];
}

export function ItemChecklist({ mode, items }: ItemChecklistProps) {
  const modeItems = getModeItems(mode);
  
  const getItemStatus = (itemName: string): boolean => {
    const item = items.find(i => i.name === itemName);
    return item?.detected ?? false;
  };

  return (
    <div className="bg-card rounded-lg border border-border p-4 shadow-sm">
      <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
        <ListChecks className="h-5 w-5 text-primary" />
        Item Status
      </h2>
      
      <div className="space-y-3">
        {modeItems.map((item) => {
          const detected = getItemStatus(item.name);
          return (
            <div 
              key={item.name}
              data-testid={`item-${item.name.toLowerCase()}`}
              className="flex items-center justify-between p-3 rounded-md bg-secondary/30 hover:bg-secondary/50 transition-colors duration-200"
            >
              <div className="flex items-center gap-3">
                <i className={`${item.icon} text-muted-foreground`} />
                <span className="font-medium">{item.name}</span>
              </div>
              <div className="status-indicator">
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                  detected 
                    ? "bg-primary/10 text-primary" 
                    : "bg-destructive/10 text-destructive"
                }`}>
                  {detected ? (
                    <>
                      <CheckCircle className="w-3 h-3" />
                      Detected
                    </>
                  ) : (
                    <>
                      <XCircle className="w-3 h-3" />
                      Missing
                    </>
                  )}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
