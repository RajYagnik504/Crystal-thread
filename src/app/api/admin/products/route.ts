import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'src', 'data', 'products.json');

function getProductsData() {
  const fileContents = fs.readFileSync(dataFilePath, 'utf8');
  return JSON.parse(fileContents);
}

function saveProductsData(data: unknown) {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf8');
}

export async function GET() {
  try {
    const data = getProductsData();
    return NextResponse.json({
      success: true,
      data,
      stats: {
        total: (data.men?.length || 0) + (data.kids?.length || 0),
        menCount: data.men?.length || 0,
        kidsCount: data.kids?.length || 0,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to read products database' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      category = 'Dresses',
      ageGroup = '2-4',
      price,
      description,
      fabric,
      care,
      sizes = ['2Y', '3Y', '4Y'],
      color = 'Ivory',
      imageUrl,
      targetSection = 'kids',
    } = body;

    if (!name || !price) {
      return NextResponse.json(
        { success: false, error: 'Product name and price are required' },
        { status: 400 }
      );
    }

    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const id = `${targetSection}-${slug}-${Date.now().toString().slice(-4)}`;
    const finalImage = imageUrl || '/images/kids-cotton-frock.jpg';

    const newProduct = {
      id,
      slug,
      name: name.trim(),
      category: category.trim(),
      ...(targetSection === 'kids' ? { ageGroup } : {}),
      price: Number(price),
      currency: 'INR',
      description: description?.trim() || `${fabric || 'Pure natural fabric'} tailored for breathable everyday wear.`,
      fabric: fabric?.trim() || '100% GOTS Organic Cotton, 160 gsm',
      care: care?.trim() || 'Machine wash gentle. Air dry in shade.',
      sizes: Array.isArray(sizes) && sizes.length > 0 ? sizes : ['2Y', '3Y', '4Y'],
      color: color.trim(),
      images: [finalImage],
      heroImage: finalImage,
    };

    const currentData = getProductsData();

    if (targetSection === 'kids') {
      currentData.kids = [newProduct, ...(currentData.kids || [])];
    } else {
      currentData.men = [newProduct, ...(currentData.men || [])];
    }

    saveProductsData(currentData);

    return NextResponse.json({
      success: true,
      message: `Successfully added ${name} to ${targetSection} collection`,
      product: newProduct,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to add product' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const section = searchParams.get('section') || 'kids';

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Product id is required' },
        { status: 400 }
      );
    }

    const currentData = getProductsData();

    if (section === 'kids') {
      currentData.kids = (currentData.kids || []).filter((p: { id: string }) => p.id !== id);
    } else {
      currentData.men = (currentData.men || []).filter((p: { id: string }) => p.id !== id);
    }

    saveProductsData(currentData);

    return NextResponse.json({
      success: true,
      message: `Product ${id} deleted successfully`,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}
