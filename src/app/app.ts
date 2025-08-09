import { Component, computed } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FfmpegService } from './services/ffmpeg';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected title = 'm3rger';

  constructor(private ffmpegSvc: FfmpegService) { }

  ffmepgLoaded = computed(() => this.ffmpegSvc.loaded());
  ffmpegLoading = computed(() => this.ffmpegSvc.loading());

  loadFfmpeg() {
    this.ffmpegSvc.load();
  }
}
