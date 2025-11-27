import { NextRequest, NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';

export async function GET() {
  try {
    const swaggerSpec = readFileSync(
      join(process.cwd(), 'public', 'swagger.json'),
      'utf8'
    );
    
    return new NextResponse(swaggerSpec, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  } catch (error) {
    console.error('Error serving swagger.json:', error);
    return NextResponse.json(
      { error: 'Swagger specification not found' },
      { status: 404 }
    );
  }
}