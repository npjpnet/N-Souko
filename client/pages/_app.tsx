import '../styles/globals.scss';
import type { AppProps } from 'next/app';

import { Auth0Provider } from '@auth0/auth0-react';

function SafeHydrate({ children }: { children: JSX.Element }) {
  return (
    <div suppressHydrationWarning>
      {typeof window === 'undefined' ? null : children}
    </div>
  );
}

function MyApp({ Component, pageProps }: AppProps) {
  if (!process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID) return;
  if (!process.env.NEXT_PUBLIC_AUTH0_DOMAIN) return;

  return (
    <SafeHydrate>
      <Auth0Provider
        clientId={process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID}
        domain={process.env.NEXT_PUBLIC_AUTH0_DOMAIN}
        audience={`https://${process.env.NEXT_PUBLIC_AUTH0_DOMAIN}/api/v2/`}
        redirectUri={process.env.NEXT_PUBLIC_AUTH0_REDIRECT_URL}
      >
        <Component {...pageProps} />
      </Auth0Provider>
    </SafeHydrate>
  );
}
export default MyApp;
