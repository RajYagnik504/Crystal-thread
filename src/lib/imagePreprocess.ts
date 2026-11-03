export interface PreprocessResult {
  dataUrl: string;
  width: number;
  height: number;
  aspectRatio: number;
}

export async function preprocessUserPhoto(file: File): Promise<PreprocessResult> {
  return new Promise((resolve, reject) => {
    // 1. Basic type check
    if (!file.type.startsWith('image/')) {
      return reject(new Error('Please provide an image file (JPEG, PNG, or WebP).'));
    }

    const reader = new FileReader();

    reader.onerror = () => reject(new Error('Unable to read the chosen file.'));

    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error('The image could not be decoded.'));

      img.onload = () => {
        const MAX_DIM = 1536;
        let { width, height } = img;

        if (width > MAX_DIM || height > MAX_DIM) {
          if (width > height) {
            height = Math.round((height * MAX_DIM) / width);
            width = MAX_DIM;
          } else {
            width = Math.round((width * MAX_DIM) / height);
            height = MAX_DIM;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return reject(new Error('Canvas context could not be created.'));
        }

        // Draw image onto canvas
        ctx.drawImage(img, 0, 0, width, height);

        // Quality heuristic: sample pixels to check brightness and contrast
        try {
          const sampleW = Math.min(width, 100);
          const sampleH = Math.min(height, 100);
          const sampleData = ctx.getImageData(0, 0, sampleW, sampleH).data;

          let totalLuma = 0;
          let minLuma = 255;
          let maxLuma = 0;
          const pixelCount = sampleW * sampleH;

          for (let i = 0; i < sampleData.length; i += 4) {
            const r = sampleData[i];
            const g = sampleData[i + 1];
            const b = sampleData[i + 2];
            // Standard perceptual luminance
            const luma = 0.299 * r + 0.587 * g + 0.114 * b;
            totalLuma += luma;
            if (luma < minLuma) minLuma = luma;
            if (luma > maxLuma) maxLuma = luma;
          }

          const avgLuma = totalLuma / pixelCount;
          const contrast = maxLuma - minLuma;

          if (avgLuma < 20) {
            return reject(
              new Error('The photograph appears too dark. Please choose a well-lit photo so the thread can trace your silhouette.')
            );
          }

          if (contrast < 25) {
            return reject(
              new Error('The photo lacks sufficient contrast. A clear pose against a distinct backdrop yields the most natural drape.')
            );
          }
        } catch {
          // If security or sampling fails, proceed gracefully
        }

        const dataUrl = canvas.toDataURL('image/jpeg', 0.92);

        resolve({
          dataUrl,
          width,
          height,
          aspectRatio: width / height,
        });
      };

      img.src = e.target?.result as string;
    };

    reader.readAsDataURL(file);
  });
}
