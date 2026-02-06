declare module 'next-pwa' {
  import { NextConfig } from 'next';
  import type { Plugin } from 'webpack';

  interface PWAConfig {
    dest?: string;
    register?: boolean;
    skipWaiting?: boolean;
    disable?: boolean;
    sw?: string;
    scope?: string;
  }

  export default function withPWA(config?: PWAConfig): (nextConfig: NextConfig) => NextConfig & { webpack?: Plugin };
}
