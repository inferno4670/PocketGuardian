import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { scanRequestSchema, insertScanHistorySchema, type ScanResponse, type ItemStatus } from "@shared/schema";

// Mock item detection logic - simulates hardware scanning
function simulateItemScan(mode: string): ItemStatus[] {
  const modeItems: Record<string, string[]> = {
    "Daily Essentials": ["Wallet", "Keys"],
    "College Mode": ["Wallet", "ID", "Earbuds"], 
    "Gym Mode": ["Wallet", "Bottle", "Towel"],
    "Trip Mode": ["Wallet", "Charger", "Powerbank"]
  };

  const items = modeItems[mode] || [];
  
  // Simulate random detection - in real app this would interface with hardware
  return items.map(item => ({
    name: item,
    detected: Math.random() > 0.3 // 70% chance of detection
  }));
}

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Scan items endpoint
  app.post("/api/scan", async (req, res) => {
    try {
      const { mode } = scanRequestSchema.parse(req.body);
      
      // Simulate scanning
      const items = simulateItemScan(mode);
      const missingItems = items.filter(item => !item.detected).map(item => item.name);
      const allDetected = missingItems.length === 0;
      
      // Store scan result in history
      const scanHistoryData = insertScanHistorySchema.parse({
        mode,
        missingItems,
        allItemsDetected: allDetected
      });
      
      await storage.createScanHistory(scanHistoryData);
      
      const response: ScanResponse = {
        items,
        allDetected,
        missingItems
      };
      
      res.json(response);
    } catch (error) {
      res.status(400).json({ message: "Invalid scan request" });
    }
  });

  // Get scan history
  app.get("/api/history", async (req, res) => {
    try {
      const history = await storage.getScanHistory();
      res.json(history);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch history" });
    }
  });

  // Clear scan history
  app.delete("/api/history", async (req, res) => {
    try {
      await storage.clearScanHistory();
      res.json({ message: "History cleared successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to clear history" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
