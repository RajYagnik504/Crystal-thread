export interface TryOnRequest {
  personImage: string; // Base64 data URL
  garmentId: string;
  garmentName: string;
  garmentImage: string; // URL or Base64
  category: 'men' | 'kids';
  size?: string;
  color?: string;
  parentConsent?: boolean;
}

export interface TryOnResponse {
  success: boolean;
  resultImage?: string; // Base64 data URL or URL
  provider: 'mock' | 'vertex' | 'gemini' | 'replicate' | 'fal';
  processingTimeMs: number;
  error?: string;
  details?: string;
}

export interface TryOnProvider {
  name: 'mock' | 'vertex' | 'gemini' | 'replicate' | 'fal';
  process(req: TryOnRequest): Promise<TryOnResponse>;
}
