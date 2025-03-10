
export interface BufferingState {
  isBuffering: boolean;
  progress: number;
  currentChunk: number;
  isPreBuffering: boolean;
  preBufferedChunk: number | null;
}

export class BufferingManager {
  private readonly preBufferThreshold = 0.8; // Start pre-buffering at 80% of current chunk
  private readonly minTimeThreshold = 5; // Or when 5 seconds remain

  shouldStartPreBuffering(
    currentTime: number,
    duration: number,
    hasPreBuffered: boolean
  ): boolean {
    if (hasPreBuffered || !duration) return false;
    
    const timeThreshold = Math.min(
      duration * this.preBufferThreshold,
      duration - this.minTimeThreshold
    );
    
    return currentTime >= timeThreshold;
  }

  calculateBufferProgress(buffered: TimeRanges, duration: number): number {
    if (!duration || !buffered.length) return 0;
    
    const lastRange = buffered.length - 1;
    const bufferedEnd = buffered.end(lastRange);
    return Math.round((bufferedEnd / duration) * 100);
  }
}

export const bufferingManager = new BufferingManager();
