const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const imgDir = path.join(__dirname, '..', 'public', 'images');
const files = [
  'men-linen-shirt.jpg',
  'men-bomber-jacket.jpg',
  'men-linen-kurta.jpg',
  'kids-cotton-frock.jpg',
  'kids-hoodie.jpg'
];

async function removeBackground(file) {
  const filePath = path.join(imgDir, file);
  const outPath = path.join(imgDir, file.replace('.jpg', '-transparent.png'));
  
  const { data, info } = await sharp(filePath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
    
  const { width, height, channels } = info;
  // Sample background color from top-left, top-right, bottom-left, bottom-right
  const getPixel = (x, y) => {
    const idx = (y * width + x) * channels;
    return [data[idx], data[idx + 1], data[idx + 2]];
  };
  
  const corner1 = getPixel(2, 2);
  const corner2 = getPixel(width - 3, 2);
  const bgR = (corner1[0] + corner2[0]) / 2;
  const bgG = (corner1[1] + corner2[1]) / 2;
  const bgB = (corner1[2] + corner2[2]) / 2;
  
  console.log(`${file}: Detected BG RGB (${bgR.toFixed(1)}, ${bgG.toFixed(1)}, ${bgB.toFixed(1)})`);

  // Flood fill / connected component from boundaries
  const visited = new Uint8Array(width * height);
  const queue = [];
  
  // Push all border pixels to queue if close to background color
  const colorDist = (r, g, b) => {
    return Math.sqrt((r - bgR) ** 2 + (g - bgG) ** 2 + (b - bgB) ** 2);
  };
  
  const threshold = 28; // color distance tolerance
  
  for (let x = 0; x < width; x++) {
    queue.push(x, 0);
    queue.push(x, height - 1);
  }
  for (let y = 0; y < height; y++) {
    queue.push(0, y);
    queue.push(width - 1, y);
  }
  
  let head = 0;
  while (head < queue.length) {
    const x = queue[head++];
    const y = queue[head++];
    const pIdx = y * width + x;
    if (visited[pIdx]) continue;
    visited[pIdx] = 1;
    
    const dIdx = pIdx * channels;
    const r = data[dIdx];
    const g = data[dIdx + 1];
    const b = data[dIdx + 2];
    
    if (colorDist(r, g, b) <= threshold) {
      data[dIdx + 3] = 0; // Transparent!
      
      // Check 4 neighbors
      if (x > 0 && !visited[pIdx - 1]) queue.push(x - 1, y);
      if (x < width - 1 && !visited[pIdx + 1]) queue.push(x + 1, y);
      if (y > 0 && !visited[pIdx - width]) queue.push(x, y - 1);
      if (y < height - 1 && !visited[pIdx + width]) queue.push(x, y + 1);
    }
  }

  // Smooth feathering on edges
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const pIdx = y * width + x;
      const dIdx = pIdx * channels;
      if (data[dIdx + 3] > 0) {
        // check if adjacent to transparent pixel
        const hasTransparentNeighbor = 
          data[(pIdx - 1) * channels + 3] === 0 ||
          data[(pIdx + 1) * channels + 3] === 0 ||
          data[(pIdx - width) * channels + 3] === 0 ||
          data[(pIdx + width) * channels + 3] === 0;
          
        if (hasTransparentNeighbor) {
          const r = data[dIdx];
          const g = data[dIdx + 1];
          const b = data[dIdx + 2];
          const dist = colorDist(r, g, b);
          if (dist <= threshold + 15) {
            data[dIdx + 3] = Math.max(0, Math.min(255, (dist - threshold) / 15 * 255));
          }
        }
      }
    }
  }
  
  await sharp(data, { raw: { width, height, channels } })
    .png()
    .toFile(outPath);
    
  console.log(`Created transparent PNG: ${outPath}`);
}

async function main() {
  for (const f of files) {
    await removeBackground(f);
  }
  console.log('All cutouts generated!');
}

main().catch(console.error);
