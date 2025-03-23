import { NextResponse } from 'next/server';

const GOOGLE_CIVIC_API_KEY = process.env.GOOGLE_API_KEY;
const CIVIC_API_URL = 'https://www.googleapis.com/civicinfo/v2/representatives';

interface AddressData {
  street: string;
  city: string;
  state: string;
  zipCode: string;
}

interface GoogleApiError {
  error: {
    message: string;
    status?: string;
    code?: number;
  };
}

interface GoogleApiResponse {
  offices: Array<{
    name: string;
    divisionId: string;
    officialIndices: number[];
  }>;
  officials: Array<{
    name: string;
    party?: string;
    phones?: string[];
    urls?: string[];
    emails?: string[];
  }>;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { street, city, state, zipCode } = body as AddressData;
    
    // Format the address for the API
    const address = `${street}, ${city}, ${state} ${zipCode}`;
    console.log('Formatted address:', address);
    console.log('API Key available:', !!GOOGLE_CIVIC_API_KEY);
    
    // Construct URL with query parameters
    const url = new URL(CIVIC_API_URL);
    url.searchParams.append('key', GOOGLE_CIVIC_API_KEY || '');
    url.searchParams.append('address', address);
    url.searchParams.append('levels', 'country');
    url.searchParams.append('levels', 'administrativeArea1');
    url.searchParams.append('levels', 'administrativeArea2');
    url.searchParams.append('levels', 'locality');
    
    console.log('Making request to:', url.toString());
    
    // Make request to Google Civic Information API
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json() as GoogleApiError;
      console.error('API Error:', errorData);
      throw new Error(errorData.error?.message || 'Failed to fetch representatives');
    }

    const data = await response.json() as GoogleApiResponse;
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching representatives:', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch representatives' },
      { status: 500 }
    );
  }
}
