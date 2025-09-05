import { CheckCircle, XCircle, ListChecks } from "lucide-react";
import { getModeItems } from "@/lib/modes";
import { getItemsForMode } from "@/lib/storage";
import type { ItemStatus } from "@shared/schema";

interface ItemChecklistProps {
  mode: string;
  items: ItemStatus[];
}

export function ItemChecklist({ mode, items }: ItemChecklistProps) {
  const modeConfig = getModeItems(mode);
  const defaultItems = modeConfig.map(item => item.name);
  const currentItems = getItemsForMode(mode, defaultItems);
  
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
        {currentItems.map((itemName) => {
          const detected = getItemStatus(itemName);
          const defaultItem = modeConfig.find(item => item.name === itemName);
          const icon = defaultItem?.icon || "fas fa-cube";
          
          return (
            <div 
              key={itemName}
              data-testid={`item-${itemName.toLowerCase()}`}
              className="flex items-center justify-between p-3 rounded-md bg-secondary/30 hover:bg-secondary/50 transition-colors duration-200"
            >
              <div className="flex items-center gap-3">
                <i className={`${icon} text-muted-foreground`} />
                <span className="font-medium">{itemName}</span>
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
