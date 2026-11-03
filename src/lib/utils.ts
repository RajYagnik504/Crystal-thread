// Product & Model image resolver
export function getProductImage(baseName: string): string {
  const jpgImages = [
    'men-linen-shirt', 'men-linen-kurta', 'men-bomber-jacket', 'men-cotton-tee',
    'men-chino-trousers', 'kids-cotton-frock', 'kids-hoodie', 'kids-shorts-set',
    'kids-kurta-set', 'kids-dungaree',
    'lookbook-men-1', 'lookbook-men-2', 'lookbook-men-3'
  ];
  
  if (jpgImages.includes(baseName)) {
    return `/images/${baseName}.jpg`;
  }
  return `/images/${baseName}.svg`;
}

// Return realistic AI model photo wearing the garment
export function getModelImage(baseName: string): string {
  const modelMap: Record<string, string> = {
    'men-linen-shirt': '/images/model-men-linen-shirt.jpg',
    'men-linen-kurta': '/images/model-men-linen-kurta.jpg',
    'men-bomber-jacket': '/images/model-men-bomber-jacket.jpg',
    'men-cotton-tee': '/images/lookbook-men-1.jpg',
    'men-chino-trousers': '/images/lookbook-men-2.jpg',
    'men-henley': '/images/lookbook-men-3.jpg',
    'men-linen-blazer': '/images/lookbook-men-2.jpg',
    'kids-cotton-frock': '/images/model-kids-frock.jpg',
    'kids-hoodie': '/images/model-kids-hoodie.jpg',
    'kids-shorts-set': '/images/kids-shorts-set.jpg',
    'kids-kurta-set': '/images/kids-kurta-set.jpg',
    'kids-dungaree': '/images/kids-dungaree.jpg',
  };

  return modelMap[baseName] || getProductImage(baseName);
}

export function formatPrice(price: number): string {
  return `₹${price.toLocaleString('en-IN')}`;
}

export function getPricingMeta(price: number) {
  // Generates realistic MRP and discount percentage like The Souled Store
  const markupMultiplier = 1.35 + ((price % 7) * 0.03);
  const mrp = Math.round((price * markupMultiplier) / 100) * 100 - 10;
  const discountPercent = Math.round(((mrp - price) / mrp) * 100);
  return { mrp, discountPercent };
}

export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

