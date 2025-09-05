export interface ModeConfig {
  name: string;
  items: Array<{
    name: string;
    icon: string;
  }>;
}

export const modes: Record<string, ModeConfig> = {
  "Daily": {
    name: "Daily",
    items: [
      { name: "Wallet", icon: "fas fa-wallet" },
      { name: "Keys", icon: "fas fa-key" }
    ]
  },
  "College": {
    name: "College",
    items: [
      { name: "Wallet", icon: "fas fa-wallet" },
      { name: "ID", icon: "fas fa-id-card" },
      { name: "Earbuds", icon: "fas fa-headphones" }
    ]
  },
  "Gym": {
    name: "Gym",
    items: [
      { name: "Wallet", icon: "fas fa-wallet" },
      { name: "Bottle", icon: "fas fa-bottle-water" },
      { name: "Towel", icon: "fas fa-bath" }
    ]
  },
  "Trip": {
    name: "Trip",
    items: [
      { name: "Wallet", icon: "fas fa-wallet" },
      { name: "Charger", icon: "fas fa-charging-station" },
      { name: "Powerbank", icon: "fas fa-battery-full" }
    ]
  }
};

export const getModeItems = (modeName: string) => {
  return modes[modeName]?.items || [];
};
