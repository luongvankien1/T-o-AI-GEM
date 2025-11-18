
import { ImageFormat } from '../types';

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

export const downloadImage = (dataUrl: string, filename: string, format: ImageFormat) => {
  const image = new Image();
  image.src = dataUrl;
  image.onload = () => {
    const canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(image, 0, 0);
      const mimeType = `image/${format}`;
      const url = canvas.toDataURL(mimeType, format === 'jpeg' ? 0.9 : undefined);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${filename}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };
};
