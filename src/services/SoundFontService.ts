// soundfontService.ts
import Soundfont, { InstrumentName, Player } from "soundfont-player";

export default class SoundfontService {
  private ctx: AudioContext;
  private player: Player | null = null;
  private masterGain: GainNode;

  constructor(ctx?: AudioContext) {
    this.ctx = ctx ?? new (window.AudioContext || (window as any).webkitAudioContext)();

    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = 25;
    this.masterGain.connect(this.ctx.destination);

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
