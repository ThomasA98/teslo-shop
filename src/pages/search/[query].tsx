import { ShopLayout } from "@/components/layouts";
import { ProductList } from "@/components/products";
import { dbProduct } from "@/database";
import { IProduct } from "@/interfaces";
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

interface SearchPageProps {
    products: IProduct[]
    foundProducts: boolean
    query: string
}

const SearchPage: NextPage<SearchPageProps> = ({ products, foundProducts, query }) => {
    return (
        <ShopLayout title={'Teslo-Shop - Search'} pageDescription={'Encientra los mejores productos de Teslo aqui'}>
            <Typography variant='h1' component='h1'>Buscar productos</Typography>

            {
                foundProducts
                    ? <Typography variant='h2' sx={{ mb: 1 }} textTransform='capitalize'>Término: { query.toString() }</Typography>
                    : <Box display='flex'>
                        <Typography variant='h2' sx={{ mb: 1 }}>No se encontraron productos relacionados</Typography>
                        <Typography variant='h2' sx={{ ml: 1 }} color='secondary' textTransform='capitalize'>{ query }</Typography>
                    </Box>
            }
            <ProductList products={products} />
        </ShopLayout>
    )
}

import { GetServerSideProps, NextPage } from 'next'

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
    const { query } = params as { query: string };

    if(query.length === 0) return {
        redirect: {
            destination: '/',
            permanent: false
        }
    }

    const productsByTerm = await dbProduct.getProductByTerm(query);
    const foundProducts = productsByTerm.length > 1;

    const products = foundProducts
                    ? productsByTerm
                    : await dbProduct.getAllProducts({ limit: 10 });

    return {
        props: {
            products,
            foundProducts,
            query
        }
    }
}

export default SearchPage