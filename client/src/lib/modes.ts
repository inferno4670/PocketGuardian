export interface ModeConfig {
  name: string;
  items: Array<{
    name: string;
    icon: string;
  }>;
}

export const modes: Record<string, ModeConfig> = {
  "Daily Essentials": {
    name: "Daily Essentials",
    items: [
      { name: "Wallet", icon: "fas fa-wallet" },
      { name: "Keys", icon: "fas fa-key" }
    ]
  },
  "College Mode": {
    name: "College Mode", 
    items: [
      { name: "Wallet", icon: "fas fa-wallet" },
      { name: "ID", icon: "fas fa-id-card" },
      { name: "Earbuds", icon: "fas fa-headphones" }
    ]
  },
  "Gym Mode": {
    name: "Gym Mode",
    items: [
      { name: "Wallet", icon: "fas fa-wallet" },
      { name: "Bottle", icon: "fas fa-bottle-water" },
      { name: "Towel", icon: "fas fa-bath" }
    ]
  },
  "Trip Mode": {
    name: "Trip Mode",
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
