import { Injectable, signal } from '@angular/core';
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, } from "@ffmpeg/util";

@Injectable({
  providedIn: 'root'
})
export class FfmpegService {

  ffmpeg = signal(new FFmpeg());
  loaded = signal(false);

  async load() {
    try {
      //const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.10/dist/esm";
      //const baseURL = "https://unpkg.com/@ffmpeg/core-mt@0.12.10/dist/esm";
      const baseURL = "";

      const ffmpeg = this.ffmpeg();
      ffmpeg.on("log", ({ message }: { message: any }) => {
        console.log(message);
      });
      await ffmpeg.load({
        coreURL: `${baseURL}/ffmpeg-core.js`,
        wasmURL:
          `${baseURL}/ffmpeg-core.wasm`,
        /*
        workerURL: await toBlobURL(
          `${baseURL}/ffmpeg-core.worker.js`,
          "text/javascript",
        ),
        */
      });
      console.log("FFmpeg loaded");
      this.loaded.set(true);
    } catch (error) {
      console.error(error);
    }
  };


  async merge(audio: File, video: File) {
    if (!video || !audio) {
      alert("Please select both video and audio files.");
      return;
    }

    // Write input files to ffmpeg's virtual FS
    this.ffmpeg().writeFile("video.mp4", await fetchFile(video));
    this.ffmpeg().writeFile("audio.aac", await fetchFile(audio));

    // Merge video and audio
    await this.ffmpeg().exec([
      "-i", "video.mp4",
      "-i", "audio.aac",
      "-c", "copy",
      "output.mp4",
    ]);

    // Read output file
    const data = await this.ffmpeg().readFile("output.mp4");
    const videoBlob = new Blob([data], { type: "video/mp4" });

    // Create a download link
    const downloadUrl = URL.createObjectURL(videoBlob);
    const a = document.createElement("a");
    a.href = downloadUrl;

    // Keep original filename but force .mp4
    const originalName = video.name.replace(/\.[^/.]+$/, "");
    a.download = `${originalName}.mp4`;

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    // Revoke object URL to free memory
    URL.revokeObjectURL(downloadUrl);
  }

}
