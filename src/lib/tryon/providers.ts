import { TryOnProvider, TryOnRequest, TryOnResponse } from './types';

/**
 * Mock Provider for local development, tests, and demonstration.
 * Emulates the 4s processing pipeline with zero cost.
 */
export class MockTryOnProvider implements TryOnProvider {
  name = 'mock' as const;

  async process(req: TryOnRequest): Promise<TryOnResponse> {
    const startTime = Date.now();

    // Emulate realistic AI processing delay (3.8s)
    await new Promise((resolve) => setTimeout(resolve, 3800));

    // Return the result (in mock mode, we use the user's uploaded image or clean garment representation)
    // The client also has a canvas-based compositor for instant realistic side-by-side demonstration
    return {
      success: true,
      resultImage: req.personImage, // Handled with specialized stitch overlay on client
      provider: 'mock',
      processingTimeMs: Date.now() - startTime,
      details: `Simulated realistic try-on drape for "${req.garmentName}" (${req.category})`,
    };
  }
}

/**
 * Google Vertex AI Virtual Try-On Provider
 * Uses Google Cloud Vertex AI Model Garden (Virtual Try-On / VTON).
 */
export class VertexTryOnProvider implements TryOnProvider {
  name = 'vertex' as const;

  async process(req: TryOnRequest): Promise<TryOnResponse> {
    const startTime = Date.now();
    const projectId = process.env.GOOGLE_VERTEX_PROJECT_ID;
    const location = process.env.GOOGLE_VERTEX_LOCATION || 'us-central1';
    const accessToken = process.env.GOOGLE_VERTEX_ACCESS_TOKEN;

    if (!projectId || !accessToken) {
      throw new Error('Google Vertex AI credentials missing (GOOGLE_VERTEX_PROJECT_ID or GOOGLE_VERTEX_ACCESS_TOKEN).');
    }

    const endpoint = `https://${location}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}/publishers/google/models/image-generation:predict`;

    // Strip base64 headers
    const personBase64 = req.personImage.replace(/^data:image\/\w+;base64,/, '');

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        instances: [
          {
            prompt: `Virtual try on: dress person in ${req.garmentName}, elegant drape, pure off-white theme, seamless natural fitting, preserve face and background completely`,
            image: { bytesBase64Encoded: personBase64 },
          },
        ],
        parameters: {
          sampleCount: 1,
          mode: 'virtual-try-on',
        },
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Vertex AI Try-On request failed (${response.status}): ${errText}`);
    }

    const data = await response.json();
    const resultBase64 = data.predictions?.[0]?.bytesBase64Encoded;

    if (!resultBase64) {
      throw new Error('Vertex AI returned empty prediction.');
    }

    return {
      success: true,
      resultImage: `data:image/jpeg;base64,${resultBase64}`,
      provider: 'vertex',
      processingTimeMs: Date.now() - startTime,
    };
  }
}

/**
 * Gemini Image Model Provider
 * Uses Gemini API with strict garment replacement prompt.
 */
export class GeminiImageTryOnProvider implements TryOnProvider {
  name = 'gemini' as const;

  async process(req: TryOnRequest): Promise<TryOnResponse> {
    const startTime = Date.now();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not set in environment.');
    }

    const personBase64 = req.personImage.replace(/^data:image\/\w+;base64,/, '');
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=${apiKey}`;

    const promptText = `Virtual Try-On Fashion Task for luxury brand Crystal Thread:
Keep the person's face, hair, body shape, posture, hands, and scene background strictly unchanged.
Replace ONLY the upper/main clothing worn by the person with the following garment:
Garment: "${req.garmentName}"
Fabric: Off-white/natural handloom texture, fine stitching, precise collar and shoulder drape.
Ensure the clothing fits naturally to the person's pose and lighting with no distortion.`;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: promptText },
              {
                inlineData: {
                  mimeType: 'image/jpeg',
                  data: personBase64,
                },
              },
            ],
          },
        ],
        generationConfig: {
          responseMimeType: 'image/jpeg',
        },
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Gemini Image Try-On request failed (${response.status}): ${errText}`);
    }

    const data = await response.json();
    const candidatePart = data.candidates?.[0]?.content?.parts?.[0];
    const imageBytes = candidatePart?.inlineData?.data;

    if (!imageBytes) {
      throw new Error('Gemini model did not return image data.');
    }

    return {
      success: true,
      resultImage: `data:image/jpeg;base64,${imageBytes}`,
      provider: 'gemini',
      processingTimeMs: Date.now() - startTime,
    };
  }
}

/**
 * Replicate / IDM-VTON Try-On Provider
 * Open-source high fidelity virtual try-on diffusion model.
 */
export class ReplicateTryOnProvider implements TryOnProvider {
  name = 'replicate' as const;

  async process(req: TryOnRequest): Promise<TryOnResponse> {
    const startTime = Date.now();
    const apiToken = process.env.REPLICATE_API_TOKEN;

    if (!apiToken) {
      throw new Error('REPLICATE_API_TOKEN is not configured.');
    }

    // IDM-VTON on Replicate
    const model = 'cuuupid/idm-vton:c871bb9b046607b680449ecbae55fd8c6d815e9f8174b8822bc3c69f4644ec1f';

    const response = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        version: model.split(':')[1],
        input: {
          human_img: req.personImage,
          garm_img: req.garmentImage.startsWith('http')
            ? req.garmentImage
            : `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}${req.garmentImage}`,
          garment_des: req.garmentName,
          category: req.category === 'men' ? 'upper_body' : 'dresses',
          crop: false,
        },
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Replicate IDM-VTON failed to initiate: ${errText}`);
    }

    const prediction = await response.json();
    let pollUrl = prediction.urls?.get;

    // Poll until completed (or timeout after 45s)
    let resultOutput = null;
    const pollStart = Date.now();
    while (Date.now() - pollStart < 45000) {
      await new Promise((r) => setTimeout(r, 2000));
      const pollRes = await fetch(pollUrl, {
        headers: { 'Authorization': `Bearer ${apiToken}` },
      });
      const pollData = await pollRes.json();
      if (pollData.status === 'succeeded') {
        resultOutput = pollData.output;
        break;
      } else if (pollData.status === 'failed') {
        throw new Error(`Replicate prediction failed: ${pollData.error || 'Unknown error'}`);
      }
    }

    if (!resultOutput) {
      throw new Error('Replicate prediction timed out.');
    }

    const outputUrl = Array.isArray(resultOutput) ? resultOutput[0] : resultOutput;

    return {
      success: true,
      resultImage: outputUrl,
      provider: 'replicate',
      processingTimeMs: Date.now() - startTime,
    };
  }
}

/**
 * Factory to resolve the active provider based on environment and availability
 */
export function getTryOnProvider(): TryOnProvider {
  // Check for explicit mock flag
  if (process.env.USE_MOCK_TRYON === 'true' || !process.env.TRYON_PROVIDER) {
    const chosen = process.env.TRYON_PROVIDER;
    if (chosen === 'vertex' && process.env.GOOGLE_VERTEX_PROJECT_ID) {
      return new VertexTryOnProvider();
    }
    if (chosen === 'gemini' && process.env.GEMINI_API_KEY) {
      return new GeminiImageTryOnProvider();
    }
    if (chosen === 'replicate' && process.env.REPLICATE_API_TOKEN) {
      return new ReplicateTryOnProvider();
    }
    return new MockTryOnProvider();
  }

  const providerType = process.env.TRYON_PROVIDER.toLowerCase();

  switch (providerType) {
    case 'vertex':
      return new VertexTryOnProvider();
    case 'gemini':
      return new GeminiImageTryOnProvider();
    case 'replicate':
      return new ReplicateTryOnProvider();
    case 'mock':
    default:
      return new MockTryOnProvider();
  }
}
