import { GetStaticProps, GetStaticPaths, NextPage } from 'next'
import { Typography } from "@mui/material";
import { ShopLayout } from "@/components/layouts"
import { FullScreenLoading } from "@/components/ui"
import { ProductList } from "@/components/products";
import { SHOP_CONSTANTS } from "@/database";
import { useProducts } from "@/hooks";

interface GenderPageProps {
    gender: 'men' | 'women' | 'kid' | 'unisex'
}

const GenderPage: NextPage<GenderPageProps> = ({ gender }) => {

    const { products, isLoading } = useProducts(`/products?gender=${ gender }`);

  return (
    <ShopLayout title={`${ gender } category`} pageDescription={ `${ gender } page shop` } >

        <Typography variant='h1' component='h1'>Tienda</Typography>

        {
        isLoading
          ? <FullScreenLoading />
          : <ProductList products={ products } />
        }
    </ShopLayout>
  )
}

export const getStaticPaths: GetStaticPaths = (ctx) => {

    return {
        paths: SHOP_CONSTANTS.validGenders.map(gender => ({
            params: {
                gender
            }
        })),
        fallback: 'blocking'
    }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {

    const { gender } = params as { gender: string }

    return {
        props: {
            gender
        },
        revalidate: 3600
    }
}

export default GenderPage