/**
 * Farcaster Frame Utilities
 * 
 * This module provides helper functions for creating and validating Farcaster Frames.
 */

/**
 * Generate HTML for a Farcaster Frame
 * 
 * @param imageUrl URL of the image to display in the frame
 * @param buttons Array of button text (max 4)
 * @param postUrl URL to post to when a button is clicked
 * @param state State to pass to the next frame
 * @returns HTML string for the frame
 */
export function generateFrameHTML(
    imageUrl: string,
    buttons: string[],
    postUrl: string,
    state?: string
  ): string {
    // Ensure we don't exceed 4 buttons (Farcaster limit)
    if (buttons.length > 4) {
      buttons = buttons.slice(0, 4);
    }
    
    // Start building the HTML
    let html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta property="fc:frame" content="vNext" />
          <meta property="fc:frame:image" content="${imageUrl}" />
    `;
    
    // Add button meta tags
    buttons.forEach((button, index) => {
      html += `        <meta property="fc:frame:button:${index + 1}" content="${button}" />\n`;
    });
    
    // Add post URL
    html += `        <meta property="fc:frame:post_url" content="${postUrl}" />`;
    
    // Add state if provided
    if (state) {
      html += `\n        <meta property="fc:frame:state" content="${state}" />`;
    }
    
    // Close the HTML
    html += `
        </head>
      </html>
    `;
    
    return html;
  }
  
  /**
   * Verify if a message is from a legitimate Farcaster client
   * This is a simplified implementation; actual verification should validate
   * message signatures
   * 
   * @param message The message to verify
   * @returns True if the message appears to be from a legitimate Farcaster client
   */
  export function verifyFrameMessage(message: any): boolean {
    // Basic validation - check if the message has expected Farcaster fields
    if (!message || !message.untrustedData || !message.untrustedData.fid) {
      return false;
    }
    
    // In a real implementation, we would:
    // 1. Validate message signature
    // 2. Check timestamp for freshness
    // 3. Verify the signer's FID
    
    return true;
  }
  
  /**
   * Extract user information from a Farcaster Frame message
   * 
   * @param message The Farcaster Frame message
   * @returns User information
   */
  export function extractUserFromMessage(message: any): {
    fid: number;
    username?: string;
    displayName?: string;
    pfp?: string;
  } {
    if (!message || !message.untrustedData) {
      return { fid: 0 };
    }
    
    return {
      fid: message.untrustedData.fid || 0,
      username: message.untrustedData.username,
      displayName: message.untrustedData.displayName,
      pfp: message.untrustedData.pfp
    };
  }