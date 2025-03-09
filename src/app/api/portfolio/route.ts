import { NextRequest, NextResponse } from 'next/server';
import { createCanvas, loadImage } from 'canvas';
import path from 'path';
import { getMockPortfolio, getPortfolio } from '@/lib/zapper';

// Generate an image with the portfolio data
export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const searchParams = req.nextUrl.searchParams;
    const address = searchParams.get('address') || '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'; // Default to vitalik.eth
    const showUsd = searchParams.get('showUsd') === 'true';
    
    // Fetch portfolio data
    const portfolioData = await getPortfolio(address);
    
    // Use real data if available, otherwise use mock data
    const tokens = portfolioData?.tokens || getMockPortfolio().tokens;
    
    // Create a canvas for the portfolio display
    const width = 1200;
    const height = 630;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    
    // Fill background
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, width, height);
    
    // Add title and header
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 40px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Your Crypto Portfolio', width / 2, 80);
    
    // Add wallet address
    ctx.font = '20px Arial';
    ctx.fillText(`Wallet: ${address.slice(0, 6)}...${address.slice(-4)}`, width / 2, 120);
    
    // Load and draw logo
    try {
      const logoImg = await loadImage(path.join(process.cwd(), 'public', 'images', 'logo.svg'));
      ctx.drawImage(logoImg, 50, 50, 80, 80);
    } catch (e) {
      console.error('Error loading logo:', e);
    }
    
    // Draw portfolio table
    ctx.textAlign = 'left';
    const tableTop = 180;
    const rowHeight = 70;
    
    // Table headers
    ctx.fillStyle = '#475569';
    ctx.font = 'bold 24px Arial';
    ctx.fillText('Token', 100, tableTop);
    ctx.fillText('Balance', 500, tableTop);
    if (showUsd) {
      ctx.fillText('USD Value', 800, tableTop);
    }
    
    // Draw line under headers
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(100, tableTop + 10);
    ctx.lineTo(width - 100, tableTop + 10);
    ctx.stroke();
    
    // Draw token rows
    let y = tableTop + 50;
    const maxRows = 5;
    for (let i = 0; i < Math.min(tokens.length, maxRows); i++) {
      const token = tokens[i];
      
      // Try to load token logo
      try {
        const tokenLogo = await loadImage(token.logo);
        ctx.drawImage(tokenLogo, 100, y - 25, 30, 30);
      } catch (e) {
        console.error(`Error loading token logo for ${token.symbol}:`, e);
        // Draw circle as placeholder
        ctx.fillStyle = '#3b82f6';
        ctx.beginPath();
        ctx.arc(115, y - 10, 15, 0, Math.PI * 2);
        ctx.fill();
      }
      
      // Token symbol and name
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 22px Arial';
      ctx.fillText(token.symbol, 150, y);
      ctx.font = '18px Arial';
      ctx.fillStyle = '#64748b';
      ctx.fillText(token.name, 150, y + 25);
      
      // Token balance
      ctx.fillStyle = '#0f172a';
      ctx.font = '22px Arial';
      ctx.fillText(token.balance.toLocaleString(), 500, y);
      
      // USD value if showing
      if (showUsd) {
        ctx.fillStyle = '#059669';
        ctx.fillText(`$${token.balanceUsd.toLocaleString()}`, 800, y);
      }
      
      // Line between rows
      if (i < Math.min(tokens.length, maxRows) - 1) {
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(100, y + 35);
        ctx.lineTo(width - 100, y + 35);
        ctx.stroke();
      }
      
      y += rowHeight;
    }
    
    // Footer
    ctx.fillStyle = '#64748b';
    ctx.font = '18px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('RateMyBags - Crypto Portfolio Rating on Farcaster', width / 2, height - 40);
    
    // Convert canvas to PNG buffer
    const buffer = canvas.toBuffer('image/png');
    
    // Return the image
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'max-age=10',
      },
    });
  } catch (error) {
    console.error('Error generating portfolio image:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}