import { NextRequest, NextResponse } from 'next/server';
import { getTryOnProvider } from '@/lib/tryon/providers';
import { TryOnRequest } from '@/lib/tryon/types';

export const maxDuration = 60; // Allow sufficient time for AI diffusion inference
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as TryOnRequest;

    // 1. Validation
    if (!body.personImage || typeof body.personImage !== 'string') {
      return NextResponse.json(
        { success: false, error: 'A valid photograph is required to preview the drape.' },
        { status: 400 }
      );
    }

    if (!body.garmentId || !body.garmentName) {
      return NextResponse.json(
        { success: false, error: 'Please select a garment from the collection.' },
        { status: 400 }
      );
    }

    // Safety & Consent for kids garments
    if (body.category === 'kids' && !body.parentConsent) {
      return NextResponse.json(
        {
          success: false,
          error: 'Parental or guardian consent is required when previewing children’s pieces.',
        },
        { status: 403 }
      );
    }

    // Ensure payload isn't overwhelmingly large
    if (body.personImage.length > 12 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: 'Image exceeds maximum upload limit of 10MB.' },
        { status: 413 }
      );
    }

    // 2. Resolve provider and process in-memory
    const provider = getTryOnProvider();
    const result = await provider.process(body);

    // 3. Return clean response with no persistent server trace
    return NextResponse.json(result, {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Pragma': 'no-cache',
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'An unexpected error occurred during fitting.';
    console.error('TryOn API Error:', message);

    return NextResponse.json(
      {
        success: false,
        error: message,
        details: 'The drape could not be stitched at this time. Please try another angle or lighting.',
      },
      { status: 500 }
    );
  }
}
