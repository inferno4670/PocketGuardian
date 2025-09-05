import { type ScanHistory, type InsertScanHistory } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  createScanHistory(scanHistory: InsertScanHistory): Promise<ScanHistory>;
  getScanHistory(): Promise<ScanHistory[]>;
  clearScanHistory(): Promise<void>;
}

export class MemStorage implements IStorage {
  private scanHistory: Map<string, ScanHistory>;

  constructor() {
    this.scanHistory = new Map();
  }

  async createScanHistory(insertScanHistory: InsertScanHistory): Promise<ScanHistory> {
    const id = randomUUID();
    const scanHistory: ScanHistory = { 
      ...insertScanHistory, 
      id,
      timestamp: new Date()
    };
    this.scanHistory.set(id, scanHistory);
    return scanHistory;
  }

  async getScanHistory(): Promise<ScanHistory[]> {
    return Array.from(this.scanHistory.values())
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  async clearScanHistory(): Promise<void> {
    this.scanHistory.clear();
  }
}

export const storage = new MemStorage();
