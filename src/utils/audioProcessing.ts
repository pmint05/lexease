export async function fetchAndComputeMetering(url: string, numberOfBars = 60): Promise<number[]> {
  try {
    const resp = await fetch(url);
    const arrayBuffer = await resp.arrayBuffer();

    const AudioCtx = (globalThis as any).AudioContext || (globalThis as any).webkitAudioContext;
    if (!AudioCtx) return [];

    const ctx = new AudioCtx();
    const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
    const channelData = audioBuffer.numberOfChannels > 0 ? audioBuffer.getChannelData(0) : audioBuffer.getChannelData(0);

    const len = channelData.length;
    const samplesPerBar = Math.max(1, Math.floor(len / numberOfBars));
    const bars: number[] = [];

    for (let i = 0; i < numberOfBars; i++) {
      const start = i * samplesPerBar;
      const end = Math.min(len, start + samplesPerBar);
      let sum = 0;
      for (let j = start; j < end; j++) {
        const s = channelData[j];
        sum += s * s;
      }
      const mean = sum / Math.max(1, end - start);
      const rms = Math.sqrt(mean);
      const db = rms > 0 ? 20 * Math.log10(rms) : -160;
      bars.push(db);
    }

    // close audio context if possible
    try {
      ctx.close && ctx.close();
    } catch {}

    return bars;
  } catch {
    return [];
  }
}
