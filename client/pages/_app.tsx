import '../styles/globals.scss';
import type { AppProps } from 'next/app';

import { Auth0Provider, useAuth0 } from '@auth0/auth0-react';

function MyApp({ Component, pageProps }: AppProps) {
  if (!process.env['NEXT_PUBLIC_AUTH0_DOMAIN']) return;
  if (!process.env['NEXT_PUBLIC_AUTH0_CLIENT_ID']) return;
  if (!process.env['NEXT_PUBLIC_AUTH0_REDIRECT_URL']) return;

  return (
    <Auth0Provider
      domain={process.env['NEXT_PUBLIC_AUTH0_DOMAIN']}
      clientId={process.env['NEXT_PUBLIC_AUTH0_CLIENT_ID']}
      audience={`https://${process.env['NEXT_PUBLIC_AUTH0_DOMAIN']}/api/v2/`}
      redirectUri={process.env['NEXT_PUBLIC_AUTH0_REDIRECT_URL']}
    >
      <Component {...pageProps} />
    </Auth0Provider>
  );
}
export default MyApp;
