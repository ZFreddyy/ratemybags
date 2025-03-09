import { NextResponse } from 'next/server';
import { createCanvas, loadImage } from 'canvas';
import path from 'path';

export async function GET(): Promise<NextResponse> {
  try {
    const width = 1200;
    const height = 630;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    
    // Fill background
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, width, height);
    
    // Add title
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 60px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('RateMyBags', width / 2, 200);
    
    // Add tagline
    ctx.fillStyle = '#64748b';
    ctx.font = '32px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Rate your crypto portfolio and share it with the community', width / 2, 260);
    
    // Load and draw logo
    try {
      const logoImg = await loadImage(path.join(process.cwd(), 'public', 'images', 'logo.svg'));
      ctx.drawImage(logoImg, (width - 200) / 2, 300, 200, 200);
    } catch (e) {
      console.error('Error loading logo:', e);
    }
    
    // Footer
    ctx.fillStyle = '#64748b';
    ctx.font = '24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('A Farcaster Frame app for portfolio rating', width / 2, height - 80);
    
    // Convert canvas to PNG buffer
    const buffer = canvas.toBuffer('image/png');
    
    // Return the image
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'max-age=60',
      },
    });
  } catch (error) {
    console.error('Error generating OG image:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}