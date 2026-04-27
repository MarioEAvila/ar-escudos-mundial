import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";

let ffmpegInstance = null;
let isLoaded = false;

async function getFFmpeg(onProgress) {
  if (!ffmpegInstance) {
    ffmpegInstance = new FFmpeg();

    ffmpegInstance.on("progress", ({ progress }) => {
      if (onProgress) {
        const percent = Math.min(100, Math.max(0, Math.round(progress * 100)));
        onProgress(percent);
      }
    });
  }

  if (!isLoaded) {
    await ffmpegInstance.load();
    isLoaded = true;
  }

  return ffmpegInstance;
}

function getExtension(fileName) {
  return fileName.split(".").pop()?.toLowerCase() || "mp4";
}

function getVideoFilters({
  adjustments,
  rotation = 0,
  flipX = false,
  flipY = false,
  vignette = false,
}) {
  const filters = [];

  const brightness = ((adjustments.brightness - 100) / 100).toFixed(2);
  const contrast = (adjustments.contrast / 100).toFixed(2);
  const saturation = (adjustments.saturate / 100).toFixed(2);

  filters.push(
    `eq=brightness=${brightness}:contrast=${contrast}:saturation=${saturation}`
  );

  if (adjustments.grayscale > 0) {
    filters.push("hue=s=0");
  }

  if (adjustments.hue !== 0) {
    filters.push(`hue=h=${adjustments.hue}`);
  }

  if (adjustments.blur > 0) {
    filters.push(`boxblur=${adjustments.blur}:1`);
  }

  if (flipX) {
    filters.push("hflip");
  }

  if (flipY) {
    filters.push("vflip");
  }

  const normalizedRotation = ((rotation % 360) + 360) % 360;

  if (normalizedRotation === 90) {
    filters.push("transpose=1");
  }

  if (normalizedRotation === 180) {
    filters.push("hflip,vflip");
  }

  if (normalizedRotation === 270) {
    filters.push("transpose=2");
  }

  if (vignette) {
    filters.push("vignette");
  }

  filters.push("scale='min(1280,iw)':-2");

  return filters.join(",");
}

async function exportVideoToMp4({
  file,
  adjustments,
  rotation = 0,
  flipX = false,
  flipY = false,
  vignette = false,
  baseFileName = "mundial-fc-video",
  onProgress,
}) {
  const ffmpeg = await getFFmpeg(onProgress);

  const inputExtension = getExtension(file.name);
  const inputName = `input.${inputExtension}`;
  const outputName = `${baseFileName}-editado.mp4`;

  await ffmpeg.writeFile(inputName, await fetchFile(file));

  const videoFilter = getVideoFilters({
    adjustments,
    rotation,
    flipX,
    flipY,
    vignette,
  });

  const args = [
    "-i",
    inputName,

    "-vf",
    videoFilter,

    "-c:v",
    "libx264",

    "-preset",
    "ultrafast",

    "-crf",
    "28",

    "-pix_fmt",
    "yuv420p",

    "-c:a",
    "aac",

    "-b:a",
    "128k",

    "-movflags",
    "faststart",

    outputName,
  ];

  await ffmpeg.exec(args);

  const data = await ffmpeg.readFile(outputName);

  await ffmpeg.deleteFile(inputName);
  await ffmpeg.deleteFile(outputName);

  return new Blob([data.buffer], { type: "video/mp4" });
}

const ffmpegService = {
  exportVideoToMp4,
};

export default ffmpegService;