import { Raf } from '@sakitam-gis/vis-engine';
import Track from './Track';

class TrackManger {
  public raf: Raf;

  public tracks: Set<Track>;

  constructor() {
    this.tracks = new Set();
    this.run = this.run.bind(this);
    this.raf = new Raf(this.run);
  }

  add(track) {
    if (!this.tracks.has(track)) {
      this.tracks.add(track);
      this.raf.start();
    }
  }

  run(time) {
    this.tracks.forEach((t) => {
      t.tick(time);
    });
  }

  remove(track) {
    if (this.tracks.has(track)) {
      this.tracks.delete(track);
    }

    if (this.tracks.size === 0) {
      this.raf.stop();
    }
  }
}

let tm: WithNull<TrackManger> = null;

export default function () {
  if (!tm) {
    tm = new TrackManger();
  }

  return tm;
}
