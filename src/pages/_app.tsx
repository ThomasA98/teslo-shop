import type { AppProps } from 'next/app'
import { SWRConfig } from 'swr'
import { CssBaseline, ThemeProvider } from '@mui/material'
import { SessionProvider } from 'next-auth/react'
import { UiProvider, CartProvider, AuthProvider } from '@/context'
import { PayPalScriptProvider } from '@paypal/react-paypal-js';

import { lightTheme } from '@/themes'
import '@/styles/globals.css'

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={ session } >
      <PayPalScriptProvider options={{ clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT || '' }}>
        <SWRConfig value={{
          fetcher: (resource, init) => fetch(resource, init).then(res => res.json())
        }} >
          <AuthProvider>
            <UiProvider>
              <CartProvider>
                <ThemeProvider theme={ lightTheme } >
                  <CssBaseline />
                  <Component {...pageProps} />
                </ThemeProvider>
              </CartProvider>
            </UiProvider>
          </AuthProvider>
        </SWRConfig>
        </PayPalScriptProvider>
    </SessionProvider>
  )
}
