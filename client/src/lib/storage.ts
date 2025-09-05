// LocalStorage utility functions for PocketGuardian

// Web Bluetooth API type declarations
declare global {
  interface Navigator {
    bluetooth?: {
      requestDevice(options: any): Promise<any>;
      getDevices(): Promise<any[]>;
    };
  }
}

interface CustomModeItems {
  [mode: string]: string[];
}

interface HistoryEntry {
  id: string;
  item_name: string;
  mode: string;
  timestamp: string;
}

interface BLEDevice {
  id: string;
  name: string;
  deviceId?: string;
}

interface BLEDeviceMap {
  [itemName: string]: BLEDevice;
}

// Custom Items Management
export const getCustomItems = (): CustomModeItems => {
  try {
    const saved = localStorage.getItem("pocketguardian_custom_items");
    return saved ? JSON.parse(saved) : {};
  } catch (error) {
    console.error("Failed to parse custom items from localStorage:", error);
    return {};
  }
};

export const saveCustomItems = (customItems: CustomModeItems): void => {
  localStorage.setItem("pocketguardian_custom_items", JSON.stringify(customItems));
};

export const getItemsForMode = (mode: string, defaultItems: string[]): string[] => {
  const customItems = getCustomItems();
  return customItems[mode] || defaultItems;
};

// History Management
export const getStoredHistory = (): HistoryEntry[] => {
  try {
    const saved = localStorage.getItem("pocketguardian_history");
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error("Failed to parse history from localStorage:", error);
    return [];
  }
};

export const saveToHistory = (entry: Omit<HistoryEntry, "id">): void => {
  const history = getStoredHistory();
  const newEntry: HistoryEntry = {
    ...entry,
    id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  };
  
  const updatedHistory = [newEntry, ...history];
  localStorage.setItem("pocketguardian_history", JSON.stringify(updatedHistory));
};

export const clearStoredHistory = (): void => {
  localStorage.removeItem("pocketguardian_history");
};

// Alarm Sound Management
export class AlarmManager {
  private audio: HTMLAudioElement | null = null;
  private isPlaying = false;

  constructor() {
    // Create audio element with a simple beep sound using Web Audio API
    this.createAlarmSound();
  }

  private createAlarmSound(): void {
    // Create a simple alarm using data URL with base64 encoded beep sound
    const beepSound = "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYeBkGU2fPEcSEFLIHO8tiJOAkZaLvt559NEAxPqOPwtmMcBjiS1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYeBkGU2fPEcSEFLIHO8tiJOAkZaLvt559NEAxPqOPwtmMcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYeBkGU2fPEcSAGLIHO8tiIOAkZaLvt559NEAxPqOPwtmMcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYeBkGU2fPEcSAGLIHO8tiJOAkZaLvt559NEAxPqOPwtmMcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYeBkGU2fPEcSEGLIHO8tiJOAkZaLvt559NEAxQp+PwtmMcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYeBkGU2fPEcSEFLIHO8tiJOAkZaLvt559NEAxQp+PwtmMcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYeBkGU2fPEcSEFLIHO8tiJOAkZaLvt559NEAxQp+PwtmMcBjiR1/LMeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYeBkGU2fPEcSEFLIHO8tiJOAkZaLvt55xNEAxQp+PwtmMcBjiR1/LMeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYeBkGU2fPEcSEFLIHO8tiJOAkZaLvt55xNEAxQp+PwtmMcBjiR1/LMeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYeBkGU2fPEcSAGLIHO8tiJOAkZaLvt55xNEAxQp+PwtmMcBjiR1/LMeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYeBkGU2fPEcSAGLIHO8tiJOAkZaLvt55xNEAxQp+PwtmMcBjiR1/LMeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYeBkGU2fPEcSAGL4HO8tiJOAkZaLvt55xNEAxQp+PwtmMcBjiR1/LMeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYeBkGU2fPEcSAGL4HO8tiJOAkZaLvt55xNEAxQp+PwtmMcBjiR1/LMeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYeBkGU2fPEcSAGL4HO8tiJOAkZaLvt55xNEAxQp+PwtmMcBjiR1/LMeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYeBkGU2fPEcSAGL4HO8tiJOAkZaLvt55xNEAxQp+PwtmMcBjiR1/LMeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYeBkGU2fPEcSAGL4HO8tiJOAkZaLvt55xNEAxQp+PwtmMcBjiR1/LMeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYeBkGU2fPEcSAGL4HO8tiJOAkZaLvt55xNEAxQp+PwtmMcBjiR1/LMeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYeBkGU2fPEcSAG"
    
    try {
      this.audio = new Audio();
      this.audio.preload = "auto";
      this.audio.volume = 0.5;
      this.audio.loop = true;
      
      // Generate a simple beep using Web Audio API as fallback
      this.generateBeepSound();
    } catch (error) {
      console.error("Failed to create alarm audio:", error);
    }
  }

  private generateBeepSound(): void {
    if (!this.audio) return;
    
    try {
      // Create a simple 800Hz beep sound
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Create a data URL for the beep
      const buffer = audioContext.createBuffer(1, audioContext.sampleRate * 0.5, audioContext.sampleRate);
      const data = buffer.getChannelData(0);
      
      for (let i = 0; i < data.length; i++) {
        data[i] = Math.sin(2 * Math.PI * 800 * i / audioContext.sampleRate) * 0.1;
      }
      
      // Convert to blob and create URL
      const blob = this.bufferToWave(buffer, buffer.length);
      const url = URL.createObjectURL(blob);
      this.audio.src = url;
      
    } catch (error) {
      // Fallback: use a simple frequency-based beep
      this.audio.src = "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYeBkGU2fPEcSEFLIHO8tiJOAkZaLvt559NEAxPqOPwtmMcBjiS1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYeBkGU2fPEcSEFLIHO8tiJOAkZaLvt559NEAxPqOPwtmMcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYeBkGU2fPEcSAGLIHO8tiIOAkZaLvt559NEAxPqOPwtmMcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYeBkGU2fPEcSAGLIHO8tiJOAkZaLvt559NEAxPqOPwtmMcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYeBkGU2fPEcSEGLIHO8tiJOAkZaLvt559NEAxQp+PwtmMcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYeBkGU2fPEcSEFLIHO8tiJOAkZaLvt559NEAxQp+PwtmMcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYeBkGU2fPEcSEFLIHO8tiJOAkZaLvt55xNEAxQp+PwtmMcBjiR1/LMeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYeBkGU2fPEcSEFLIHO8tiJOAkZaLvt55xNEAxQp+PwtmMcBjiR1/LMeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYeBkGU2fPEcSAGLIHO8tiJOAkZaLvt55xNEAxQp+PwtmMcBjiR1/LMeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYeBkGU2fPEcSAGLIHO8tiJOAkZaLvt55xNEAxQp+PwtmMcBjiR1/LMeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYeBkGU2fPEcSAGL4HO8tiJOAkZaLvt55xNEAxQp+PwtmMcBjiR1/LMeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYeBkGU2fPEcSAGL4HO8tiJOAkZaLvt55xNEAxQp+PwtmMcBjiR1/LMeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYeBkGU2fPEcSAGL4HO8tiJOAkZaLvt55xNEAxQp+PwtmMcBjiR1/LMeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYeBkGU2fPEcSAGL4HO8tiJOAkZaLvt55xNEAxQp+PwtmMcBjiR1/LMeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYeBkGU2fPEcSAGL4HO8tiJOAkZaLvt55xNEAxQp+PwtmMcBjiR1/LMeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYeBkGU2fPEcSAG";
    }
  }

  private bufferToWave(abuffer: AudioBuffer, len: number): Blob {
    const numOfChan = abuffer.numberOfChannels;
    const length = len * numOfChan * 2 + 44;
    const buffer = new ArrayBuffer(length);
    const view = new DataView(buffer);
    const channels = [];
    let i, sample, offset = 0, pos = 0;

    // Write WAVE header
    const setUint16 = (data: number) => {
      view.setUint16(pos, data, true);
      pos += 2;
    };

    const setUint32 = (data: number) => {
      view.setUint32(pos, data, true);
      pos += 4;
    };

    setUint32(0x46464952); // "RIFF"
    setUint32(length - 8); // file length - 8
    setUint32(0x45564157); // "WAVE"
    setUint32(0x20746d66); // "fmt " chunk
    setUint32(16); // length = 16
    setUint16(1); // PCM (uncompressed)
    setUint16(numOfChan);
    setUint32(abuffer.sampleRate);
    setUint32(abuffer.sampleRate * 2 * numOfChan); // avg. bytes/sec
    setUint16(numOfChan * 2); // block-align
    setUint16(16); // 16-bit
    setUint32(0x61746164); // "data" - chunk
    setUint32(length - pos - 4); // chunk length

    // Write interleaved data
    for (i = 0; i < abuffer.numberOfChannels; i++) {
      channels.push(abuffer.getChannelData(i));
    }

    while (pos < length) {
      for (i = 0; i < numOfChan; i++) {
        sample = Math.max(-1, Math.min(1, channels[i][offset]));
        view.setInt16(pos, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
        pos += 2;
      }
      offset++;
    }

    return new Blob([buffer], { type: "audio/wav" });
  }

  public startAlarm(): void {
    if (this.audio && !this.isPlaying) {
      this.isPlaying = true;
      this.audio.currentTime = 0;
      this.audio.play().catch(error => {
        console.error("Failed to play alarm:", error);
        this.isPlaying = false;
      });
    }
  }

  public stopAlarm(): void {
    if (this.audio && this.isPlaying) {
      this.audio.pause();
      this.audio.currentTime = 0;
      this.isPlaying = false;
    }
  }

  public isAlarmPlaying(): boolean {
    return this.isPlaying;
  }
}

// BLE Device Management
export const getBLEDevices = (): BLEDeviceMap => {
  try {
    const saved = localStorage.getItem("pocketguardian_ble_devices");
    return saved ? JSON.parse(saved) : {};
  } catch (error) {
    console.error("Failed to parse BLE devices from localStorage:", error);
    return {};
  }
};

export const saveBLEDevices = (bleDevices: BLEDeviceMap): void => {
  localStorage.setItem("pocketguardian_ble_devices", JSON.stringify(bleDevices));
};

export const registerBLEDevice = (itemName: string, device: BLEDevice): void => {
  const bleDevices = getBLEDevices();
  bleDevices[itemName] = device;
  saveBLEDevices(bleDevices);
};

export const unregisterBLEDevice = (itemName: string): void => {
  const bleDevices = getBLEDevices();
  delete bleDevices[itemName];
  saveBLEDevices(bleDevices);
};

// BLE Scanner Class
export class BLEScanner {
  private static instance: BLEScanner;
  private isScanning = false;

  static getInstance(): BLEScanner {
    if (!BLEScanner.instance) {
      BLEScanner.instance = new BLEScanner();
    }
    return BLEScanner.instance;
  }

  async requestDevice(itemName: string): Promise<BLEDevice | null> {
    try {
      if (!navigator.bluetooth) {
        throw new Error("Web Bluetooth API is not supported in this browser.");
      }

      const device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: ['generic_access', 'generic_attribute']
      });

      if (device.id) {
        const bleDevice: BLEDevice = {
          id: device.id,
          name: itemName,
          deviceId: device.id
        };
        
        registerBLEDevice(itemName, bleDevice);
        return bleDevice;
      }
      
      return null;
    } catch (error) {
      console.error("Error requesting BLE device:", error);
      throw error;
    }
  }

  async scanForDevices(registeredDevices: BLEDeviceMap): Promise<{ [itemName: string]: boolean }> {
    try {
      if (!navigator.bluetooth) {
        console.warn("Web Bluetooth API is not supported");
        return {};
      }

      this.isScanning = true;
      const results: { [itemName: string]: boolean } = {};

      // Get all known devices that were previously connected
      const devices = await navigator.bluetooth.getDevices();
      const connectedDeviceIds = new Set(devices.map((d: any) => d.id));

      // Check each registered device
      for (const [itemName, bleDevice] of Object.entries(registeredDevices)) {
        if (bleDevice.deviceId) {
          results[itemName] = connectedDeviceIds.has(bleDevice.deviceId);
        } else {
          results[itemName] = false;
        }
      }

      this.isScanning = false;
      return results;
    } catch (error) {
      console.error("Error scanning for BLE devices:", error);
      this.isScanning = false;
      return {};
    }
  }

  isCurrentlyScanning(): boolean {
    return this.isScanning;
  }
}

// Global alarm manager instance
export const alarmManager = new AlarmManager();

// Global BLE scanner instance
export const bleScanner = BLEScanner.getInstance();