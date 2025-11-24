// soundfontService.ts
import Soundfont, { InstrumentName, Player } from "soundfont-player";

export default class SoundfontService {
  private ctx: AudioContext;
  private player: Player | null = null;
  private masterGain: GainNode;
  private compressor: DynamicsCompressorNode;
  private static instance: SoundfontService | null = null;

  private loadingPromise: Promise<boolean> | null = null;

  constructor(ctx?: AudioContext) {
    this.ctx = ctx ?? new (window.AudioContext || (window as any).webkitAudioContext)();

    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = 4;

    this.compressor = this.ctx.createDynamicsCompressor();
    this.compressor.threshold.value = -50;
    this.compressor.knee.value = 40;
    this.compressor.ratio.value = 12;
    this.compressor.attack.value = 0;
    this.compressor.release.value = 0.25;

    this.masterGain.connect(this.compressor);
    this.compressor.connect(this.ctx.destination);

  }

  static async getInstance(): Promise<SoundfontService> {

    if (!SoundfontService.instance) {
      SoundfontService.instance = new SoundfontService();
      await SoundfontService.instance.load();
    }
    return SoundfontService.instance;
  }

  public get isLoaded(): boolean {
    return this.player !== null;
  }

  async load(instrument: InstrumentName = "acoustic_grand_piano") {
    this.player = await Soundfont.instrument(this.ctx, instrument);

    if (typeof this.player.connect === "function") {
      this.player.connect(this.masterGain);
    }

    return this.player != null;
  }

  async play(notes: string | string[], duration: number = 0.5, release: number = 0.1): Promise<boolean> {

    await this.resumeIfNeeded();

    if (!this.player) return false;

    if (typeof notes === "string")
      notes = [notes];

    for (const note of notes) {
      this.player.play(note, 0, { duration, release, gain: 1 });
    }

    return new Promise<boolean>((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, (duration + release) * 1000);
    })
  }

  private resumeIfNeeded() {
    if (this.ctx.state === "suspended") return this.ctx.resume();
    return Promise.resolve();
  }

  destroy() {

    this.masterGain.disconnect();

    if (this.ctx && this.ctx.state !== "closed") {
      this.ctx.close().catch(() => { });
    }
    this.player = null;
  }
}
