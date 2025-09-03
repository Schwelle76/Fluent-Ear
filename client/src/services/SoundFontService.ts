// soundfontService.ts
import Soundfont, { InstrumentName, Player } from "soundfont-player";

export default class SoundfontService {
  private ctx: AudioContext;
  private player: Player | null = null;
  constructor(ctx?: AudioContext) {
    this.ctx = ctx ?? new (window.AudioContext || (window as any).webkitAudioContext)();

  }

  async load(instrument: InstrumentName = "acoustic_grand_piano") {
    this.player = await Soundfont.instrument(this.ctx, instrument);
    return this.player != null;
  }

  async play(note: string) {
    await this.resumeIfNeeded();
    if (!this.player) return;

    const duration = .5;
    const release = 0;

    this.player.play(note, 0, { duration, release });

    return new Promise((resolve) => {
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
    if (this.ctx && this.ctx.state !== "closed") {
      this.ctx.close().catch(() => { });
    }
    this.player = null;
  }
}
