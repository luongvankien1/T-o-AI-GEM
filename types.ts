
export interface Character {
  id: string;
  name: string;
  imageData: string; // base64 data URL
}

export type AspectRatio = "16:9" | "9:16";

export type ImageFormat = "png" | "jpeg" | "webp";
