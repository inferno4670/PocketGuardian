import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { modes } from "@/lib/modes";

interface ModeSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
}

export function ModeSelector({ value, onValueChange }: ModeSelectorProps) {
  return (
    <div className="bg-card rounded-lg border border-border p-4 shadow-sm">
      <Label htmlFor="mode-selector" className="block text-sm font-medium text-foreground mb-2">
        Select Mode
      </Label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger data-testid="mode-selector" className="w-full">
          <SelectValue placeholder="Select a mode" />
        </SelectTrigger>
        <SelectContent>
          {Object.keys(modes).map((modeName) => (
            <SelectItem key={modeName} value={modeName} data-testid={`mode-${modeName.toLowerCase().replace(/\s+/g, '-')}`}>
              {modeName}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
