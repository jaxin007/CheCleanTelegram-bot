import sharp from 'sharp';

export const compressImage = async (data: Buffer, quality: number = 75): Promise<Buffer> => sharp(data)
  .jpeg({
    quality,
  })
  .toBuffer();
