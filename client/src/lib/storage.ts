// LocalStorage utility functions for PocketGuardian

interface CustomModeItems {
  [mode: string]: string[];
}

interface HistoryEntry {
  id: string;
  item_name: string;
  mode: string;
  timestamp: string;
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

// Global alarm manager instance
export const alarmManager = new AlarmManager();