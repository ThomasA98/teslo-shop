import Head from "next/head"
import { NavBar, SideMenu } from "../ui"

interface ShopLayoutProps {
    title: string
    pageDescription: string
    imageFullUrl?: string
    children: React.ReactNode
}

export const ShopLayout: React.FC<ShopLayoutProps> = ({ imageFullUrl, pageDescription, title, children }) => {
  return (
    <>
        <Head>
            <meta name="description" content={ pageDescription } />
            <meta name="og:title" content={ title } />
            <meta name="og:description" content={ pageDescription } />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            { imageFullUrl && <meta name="og:image" content={ imageFullUrl } /> }
            <title>{ title }</title>
        </Head>

        <NavBar />

        <SideMenu />

        <main style={{
            margin: '80px auto',
            maxWidth: '1440px',
            padding: '0px 30px'
        }}>
            { children }
        </main>

        <footer></footer>
    </>
  )
}
