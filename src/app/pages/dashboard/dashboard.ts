import { Component, signal } from '@angular/core';
import { DndOverlayComponent } from '../../components/dnd-overlay/dnd-overlay';
import { DndFiles, FileItem } from '../../components/dnd-files/dnd-files';
import { ProgressbarComponent } from '../../components/progressbar/progressbar.component';
import { FfmpegService } from '../../services/ffmpeg';

@Component({
  selector: 'app-dashboard',
  imports: [DndOverlayComponent, DndFiles, ProgressbarComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {
  constructor(private ffmpegSvc: FfmpegService) { }

  audioFiles = signal<FileItem[]>([]);
  videoFiles = signal<FileItem[]>([]);
  isMerging = signal(false);
  progress = signal(0);


  onFilesDropped(files: File[]) {
    if (files.length === 0) return;

    const audioFiles: FileItem[] = [];
    const videoFiles: FileItem[] = [];

    files.forEach(file => {
      const fileItem: FileItem = {
        id: crypto.randomUUID(), // Better unique ID than file.name
        name: file.name,
        size: this.formatFileSize(file.size),
        type: file.type,
        icon: this.getFileIcon(file.type),
        file: file
      };

      if (this.isAudioFile(file.type)) {
        audioFiles.push(fileItem);
      } else if (this.isVideoFile(file.type)) {
        videoFiles.push(fileItem);
      }
      // Optionally handle other file types or show warning
    });

    // Update signals with new files
    if (audioFiles.length > 0) {
      this.audioFiles.set([...this.audioFiles(), ...audioFiles]);
    }

    if (videoFiles.length > 0) {
      this.videoFiles.set([...this.videoFiles(), ...videoFiles]);
    }

    console.log('Audio files:', audioFiles);
    console.log('Video files:', videoFiles);
  }

  private isAudioFile(mimeType: string): boolean {
    const audioTypes = [
      'audio/mpeg',        // MP3
      'audio/mp4',         // M4A
      'audio/wav',         // WAV
      'audio/flac',        // FLAC
      'audio/aac',         // AAC
      'audio/ogg',         // OGG
      'audio/webm',        // WebM Audio
      'audio/x-m4a',       // M4A (alternative)
      'audio/mp3',         // MP3 (alternative)
      'audio/x-wav',       // WAV (alternative)
    ];

    return audioTypes.includes(mimeType) || mimeType.startsWith('audio/');
  }

  private isVideoFile(mimeType: string): boolean {
    const videoTypes = [
      'video/mp4',         // MP4
      'video/mpeg',        // MPEG
      'video/quicktime',   // MOV
      'video/x-msvideo',   // AVI
      'video/webm',        // WebM
      'video/ogg',         // OGV
      'video/3gpp',        // 3GP
      'video/x-flv',       // FLV
      'video/x-ms-wmv',    // WMV
    ];

    return videoTypes.includes(mimeType) || mimeType.startsWith('video/');
  }

  private getFileIcon(mimeType: string): string {
    if (this.isAudioFile(mimeType)) {
      return 'AUDIO';
    } else if (this.isVideoFile(mimeType)) {
      return 'VIDEO';
    }
    return 'FILE';
  }

  private formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  async onMerge() {
    this.isMerging.set(true);
    for (let i = 0; i < this.audioFiles().length; i++) {
      const audio = this.audioFiles()[i];
      const video = this.videoFiles()[i];
      await this.ffmpegSvc.merge(audio.file, video.file);
      this.progress.set((i / this.audioFiles().length) * 100);
    }
    this.isMerging.set(false);
  }

  onLoad() {
    this.ffmpegSvc.load();
  }
}
