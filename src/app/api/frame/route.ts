import { NextRequest, NextResponse } from 'next/server';
import { FrameState } from '@/types';

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    // Parse the request body to get Frame information
    const data = await req.json();
    
    // Extract the button that was clicked and any state information
    const { buttonIndex, untrustedData } = data;
    
    // Get state from previous frame or initialize new state
    let state: FrameState = { step: 'initial' };
    
    if (data.state) {
      try {
        state = JSON.parse(decodeURIComponent(data.state));
      } catch (e) {
        console.error('Error parsing state:', e);
      }
    }
    
    // Generate the appropriate next frame based on current state and button clicked
    switch (state.step) {
      case 'initial':
        // User clicked "Connect Wallet" button from initial screen
        if (buttonIndex === 1) {
          return connectWalletFrame();
        }
        break;
        
      case 'connectWallet':
        // Simulate wallet connection - in a real app, we'd integrate with an actual wallet provider
        if (buttonIndex === 1) {
          // Mock connected wallet address - in production this would come from a real connection
          state.walletAddress = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'; // vitalik.eth for demo
          state.step = 'portfolioDisplay';
          return portfolioDisplayFrame(state);
        }
        break;
        
      case 'portfolioDisplay':
        // Handle privacy toggle or proceed to rating
        if (buttonIndex === 1) {
          state.showUsdValues = false;
          return portfolioDisplayFrame(state);
        } else if (buttonIndex === 2) {
          state.showUsdValues = true;
          return portfolioDisplayFrame(state);
        } else if (buttonIndex === 3) {
          state.step = 'communityRating';
          return communityRatingFrame(state);
        }
        break;
        
      case 'communityRating':
        // Handle rating buttons (1-10)
        if (buttonIndex >= 1 && buttonIndex <= 10) {
          if (!state.ratings) state.ratings = [];
          state.ratings.push(buttonIndex);
          state.step = 'emojiReactions';
          return emojiReactionsFrame(state);
        }
        break;
        
      case 'emojiReactions':
        // Handle emoji selection
        if (buttonIndex >= 1 && buttonIndex <= 4) {
          if (!state.emojiReactions) {
            state.emojiReactions = { fire: 0, diamond: 0, rocket: 0, thumbsUp: 0 };
          }
          
          if (buttonIndex === 1) state.emojiReactions.fire++;
          if (buttonIndex === 2) state.emojiReactions.diamond++;
          if (buttonIndex === 3) state.emojiReactions.rocket++;
          if (buttonIndex === 4) state.emojiReactions.thumbsUp++;
          
          state.step = 'resultsDisplay';
          return resultsDisplayFrame(state);
        }
        break;
        
      case 'resultsDisplay':
        // Handle mint or share
        if (buttonIndex === 1) {
          state.step = 'nftMinting';
          return nftMintingFrame(state);
        } else if (buttonIndex === 2) {
          state.step = 'shareResults';
          return shareResultsFrame(state);
        }
        break;
        
      case 'nftMinting':
        // Handle mint confirmation
        if (buttonIndex === 1) {
          state.step = 'shareResults';
          return shareResultsFrame(state);
        }
        break;
        
      case 'shareResults':
        // Handle restart or finish
        if (buttonIndex === 1) {
          // Reset state and start over
          state = { step: 'initial' };
          return initialFrame();
        }
        break;
        
      default:
        // If we don't recognize the state, go back to initial
        return initialFrame();
    }
    
    // Default to initial frame if no matching conditions
    return initialFrame();
    
  } catch (error) {
    console.error('Error in Frame route:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// Helper functions to generate frame responses

function initialFrame(): NextResponse {
  return NextResponse.json({
    frameHtml: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta property="fc:frame" content="vNext" />
          <meta property="fc:frame:image" content="${process.env.NEXT_PUBLIC_HOST}/api/og" />
          <meta property="fc:frame:button:1" content="Connect Wallet" />
          <meta property="fc:frame:post_url" content="${process.env.NEXT_PUBLIC_HOST}/api/frame" />
          <meta property="og:title" content="RateMyBags - Crypto Portfolio Rating" />
          <meta property="og:description" content="Rate your crypto portfolio and share it with the community" />
        </head>
      </html>
    `,
    state: encodeURIComponent(JSON.stringify({ step: 'initial' }))
  });
}

function connectWalletFrame(): NextResponse {
  return NextResponse.json({
    frameHtml: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta property="fc:frame" content="vNext" />
          <meta property="fc:frame:image" content="${process.env.NEXT_PUBLIC_HOST}/images/connect-wallet.png" />
          <meta property="fc:frame:button:1" content="Connect Ethereum Wallet" />
          <meta property="fc:frame:post_url" content="${process.env.NEXT_PUBLIC_HOST}/api/frame" />
        </head>
      </html>
    `,
    state: encodeURIComponent(JSON.stringify({ step: 'connectWallet' }))
  });
}

function portfolioDisplayFrame(state: FrameState): NextResponse {
  // In a real app, we would fetch actual portfolio data from Zapper API here
  return NextResponse.json({
    frameHtml: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta property="fc:frame" content="vNext" />
          <meta property="fc:frame:image" content="${process.env.NEXT_PUBLIC_HOST}/api/portfolio?address=${state.walletAddress}&showUsd=${state.showUsdValues}" />
          <meta property="fc:frame:button:1" content="Hide USD" />
          <meta property="fc:frame:button:2" content="Show USD" />
          <meta property="fc:frame:button:3" content="Continue to Rating" />
          <meta property="fc:frame:post_url" content="${process.env.NEXT_PUBLIC_HOST}/api/frame" />
        </head>
      </html>
    `,
    state: encodeURIComponent(JSON.stringify(state))
  });
}

function communityRatingFrame(state: FrameState): NextResponse {
  return NextResponse.json({
    frameHtml: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta property="fc:frame" content="vNext" />
          <meta property="fc:frame:image" content="${process.env.NEXT_PUBLIC_HOST}/images/rating.png" />
          <meta property="fc:frame:button:1" content="1" />
          <meta property="fc:frame:button:2" content="2" />
          <meta property="fc:frame:button:3" content="3" />
          <meta property="fc:frame:button:4" content="4" />
          <meta property="fc:frame:button:5" content="5" />
          <meta property="fc:frame:button:6" content="6" />
          <meta property="fc:frame:button:7" content="7" />
          <meta property="fc:frame:button:8" content="8" />
          <meta property="fc:frame:button:9" content="9" />
          <meta property="fc:frame:button:10" content="10" />
          <meta property="fc:frame:post_url" content="${process.env.NEXT_PUBLIC_HOST}/api/frame" />
        </head>
      </html>
    `,
    state: encodeURIComponent(JSON.stringify(state))
  });
}

function emojiReactionsFrame(state: FrameState): NextResponse {
  return NextResponse.json({
    frameHtml: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta property="fc:frame" content="vNext" />
          <meta property="fc:frame:image" content="${process.env.NEXT_PUBLIC_HOST}/images/emoji-reactions.png" />
          <meta property="fc:frame:button:1" content="🔥" />
          <meta property="fc:frame:button:2" content="💎" />
          <meta property="fc:frame:button:3" content="🚀" />
          <meta property="fc:frame:button:4" content="👍" />
          <meta property="fc:frame:post_url" content="${process.env.NEXT_PUBLIC_HOST}/api/frame" />
        </head>
      </html>
    `,
    state: encodeURIComponent(JSON.stringify(state))
  });
}

function resultsDisplayFrame(state: FrameState): NextResponse {
  return NextResponse.json({
    frameHtml: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta property="fc:frame" content="vNext" />
          <meta property="fc:frame:image" content="${process.env.NEXT_PUBLIC_HOST}/api/results?state=${encodeURIComponent(JSON.stringify(state))}" />
          <meta property="fc:frame:button:1" content="Mint as NFT (0.001 ETH)" />
          <meta property="fc:frame:button:2" content="Share Results" />
          <meta property="fc:frame:post_url" content="${process.env.NEXT_PUBLIC_HOST}/api/frame" />
        </head>
      </html>
    `,
    state: encodeURIComponent(JSON.stringify(state))
  });
}

function nftMintingFrame(state: FrameState): NextResponse {
  return NextResponse.json({
    frameHtml: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta property="fc:frame" content="vNext" />
          <meta property="fc:frame:image" content="${process.env.NEXT_PUBLIC_HOST}/images/nft-minting.png" />
          <meta property="fc:frame:button:1" content="Confirm Mint & Share" />
          <meta property="fc:frame:post_url" content="${process.env.NEXT_PUBLIC_HOST}/api/frame" />
        </head>
      </html>
    `,
    state: encodeURIComponent(JSON.stringify(state))
  });
}

function shareResultsFrame(state: FrameState): NextResponse {
  return NextResponse.json({
    frameHtml: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta property="fc:frame" content="vNext" />
          <meta property="fc:frame:image" content="${process.env.NEXT_PUBLIC_HOST}/api/share?state=${encodeURIComponent(JSON.stringify(state))}" />
          <meta property="fc:frame:button:1" content="Rate Another Portfolio" />
          <meta property="fc:frame:post_url" content="${process.env.NEXT_PUBLIC_HOST}/api/frame" />
        </head>
      </html>
    `,
    state: encodeURIComponent(JSON.stringify(state))
  });
}