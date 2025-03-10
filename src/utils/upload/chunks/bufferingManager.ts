
export interface BufferingState {
  isBuffering: boolean;
  progress: number;
  currentTime: number;
  duration: number;
}

export class BufferingManager {
  private readonly bufferThreshold = 0.1; // Consider buffering when buffer is less than 10% ahead of current time
  private readonly minBufferTime = 5; // At least 5 seconds of buffer is ideal

  isBufferingNeeded(currentTime: number, buffered: TimeRanges, duration: number): boolean {
    if (!duration || !buffered.length) return true;
    
    // Find the buffer range that contains the current playback position
    for (let i = 0; i < buffered.length; i++) {
      const start = buffered.start(i);
      const end = buffered.end(i);
      
      // If current time is within this buffer range
      if (currentTime >= start && currentTime <= end) {
        // Check if we have enough buffer ahead
        const bufferAhead = end - currentTime;
        const minRequired = Math.min(this.minBufferTime, duration * this.bufferThreshold);
        
        return bufferAhead < minRequired;
      }
    }
    
    // If we're not in any buffer range, we need to buffer
    return true;
  }

  calculateBufferProgress(buffered: TimeRanges, duration: number): number {
    if (!duration || !buffered.length) return 0;
    
    // Find the total buffered time
    let totalBuffered = 0;
    for (let i = 0; i < buffered.length; i++) {
      totalBuffered += buffered.end(i) - buffered.start(i);
    }
    
    // Calculate progress as percentage of total duration
    return Math.round((totalBuffered / duration) * 100);
  }
  
  getBufferedAheadTime(currentTime: number, buffered: TimeRanges): number {
    if (!buffered.length) return 0;
    
    // Find the buffer range that contains the current playback position
    for (let i = 0; i < buffered.length; i++) {
      const start = buffered.start(i);
      const end = buffered.end(i);
      
      // If current time is within this buffer range
      if (currentTime >= start && currentTime <= end) {
        return end - currentTime;
      }
    }
    
    return 0;
  }
}

export const bufferingManager = new BufferingManager();
