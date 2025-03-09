import { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'RateMyBags - Crypto Portfolio Rating',
  description: 'Rate your crypto portfolio and share it with the Farcaster community',
  openGraph: {
    title: 'RateMyBags - Crypto Portfolio Rating',
    description: 'Rate your crypto portfolio and share it with the Farcaster community',
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_HOST}/api/og`,
        width: 1200,
        height: 630,
      },
    ],
  },
  // Frame metadata for Farcaster
  other: {
    'fc:frame': 'vNext',
    'fc:frame:image': `${process.env.NEXT_PUBLIC_HOST}/api/og`,
    'fc:frame:button:1': 'Connect Wallet',
    'fc:frame:post_url': `${process.env.NEXT_PUBLIC_HOST}/api/frame`,
  },
};

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gray-50">
      <div className="flex flex-col items-center justify-center space-y-4 max-w-md mx-auto text-center">
        <div className="w-32 h-32 relative mb-4">
          <Image 
            src="/images/logo.svg" 
            alt="RateMyBags Logo" 
            width={128}
            height={128}
            priority
          />
        </div>
        
        <h1 className="text-3xl font-bold text-blue-600">RateMyBags</h1>
        <p className="text-gray-700 mb-4">
          Share your crypto portfolio and get it rated by the community
        </p>
        
        <div className="mt-6 w-full">
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors">
            Connect Wallet
          </button>
        </div>
        
        <p className="text-sm text-gray-500 mt-6">
          This is a Farcaster Frame. Open in Warpcast to interact!
        </p>
      </div>
    </main>
  );
}
