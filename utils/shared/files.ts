export const mimeTypes = {
  csv: 'text/csv',

  image: [
    'image/png',
    'images/jpg',
    'image/jpeg',
    'image/gif',
    'image/webp',
    'images/avif',
  ],
};

export const isImageMimeType = (type: string) => {
  return mimeTypes.image.includes(type);
};

export const toBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
  });
