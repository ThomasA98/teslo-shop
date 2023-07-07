import { NextPage, /* GetServerSideProps */ } from 'next';
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { ItemCounter } from '@/components/ui';
import { ShopLayout } from '@/components/layouts';
import { ICartProduct, IProduct, ISize } from '@/interfaces';
import { db, dbProduct } from '@/database';
import { ProductSlideshow, SizeSelector } from '@/components/products';

// const product = initialData.products[0];

interface ProductPageProps {
  product: IProduct
}

const ProductPage: NextPage<ProductPageProps> = ({ product }) => {

  const router = useRouter();
  const { addProductToCart, cart, updateCartQuantity } = useContext(CartContext);

  const [ tempCartProduct, setTempCartProduct ] = useState<ICartProduct>({
    _id: product._id,
    image: product.images[0],
    price: product.price,
    size: undefined,
    slug: product.slug,
    title: product.title,
    gender: product.gender,
    quantity: 1,
  });

  const onSelectedSize = (size: ISize) => setTempCartProduct(prevState => ({ ...prevState, size }));

  const onNewCartQuantityValue = (product: ICartProduct, newQuantity: number) => {

    setTempCartProduct(prevState => ({ ...prevState, quantity: newQuantity }));
    updateCartQuantity({
      ...product,
      quantity: newQuantity
    });

  }

  const onProductAdd = () => {
    addProductToCart(tempCartProduct);

    router.push(`/cart`);
  }

  return (
    <ShopLayout title={ product.title } pageDescription={ product.description }>
      <Grid container spacing={ 3 }>
        <Grid item xs={ 12 } sm={ 7 } >
          <ProductSlideshow images={ product.images } />
        </Grid>

        <Grid item xs={ 12 } sm={ 5 }>
          <Box display='flex' flexDirection='column'>
            {/* titulos */}
            <Typography variant='h1' component='h1'>{ product.title }</Typography>
            <Typography variant='subtitle1' component='h1'>${ product.price }</Typography>

            <Box sx={{ my: 2 }}>
              <Typography variant='subtitle2'>Cantidad</Typography>
              <ItemCounter
                currentValue={ tempCartProduct.quantity }
                maxValue={ product.inStock }
                updateQuantity={ (newQuantity: number) => onNewCartQuantityValue(tempCartProduct, newQuantity) }
              />
              <SizeSelector onSelectedSize={ onSelectedSize } selectedSize={ tempCartProduct.size } sizes={ product.sizes } />
            </Box>

            {/* agregar al carrito */}
            {
              product.inStock > 0
                ? <Button
                    color='secondary'
                    className='circular-btn'
                    onClick={ onProductAdd }
                    disabled={ !tempCartProduct.size }
                  >{
                  tempCartProduct.size
                    ? 'Agregar al carrito'
                    : 'Seleccione una talla'
                }</Button>
                : <Chip label='No hay disponibles' color='error' variant='outlined' />
            }

            {/* descripcion */}
            <Box sx={{ mt: 3 }}>
              <Typography variant='subtitle2'>Descripcion</Typography>
              <Typography variant='body2'>{ product.description }</Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ShopLayout>
  )
}

// export const getServerSideProps: GetServerSideProps = async ({ params }) => {

//   const { slug } = params as { slug: string };

//   const product = await dbProduct.getProductBySlug(slug);

//   if(!product) return {
//     redirect: {
//       destination: '/',
//       permanent: false
//     }
//   }

//   return {
//     props: {
//       product
//     }
//   }
// }

// You should use getStaticPaths if you’re statically pre-rendering pages that use dynamic routes
import { GetStaticPaths } from 'next'

export const getStaticPaths: GetStaticPaths = async (ctx) => {
  const slugs = await dbProduct.getAllProductBySlugs();

  return {
    paths: slugs.map( ({ slug }) => ({
        params: {
          slug
        }
      })
    ),
    fallback: "blocking"
  }
}

// You should use getStaticProps when:
//- The data required to render the page is available at build time ahead of a user’s request.
//- The data comes from a headless CMS.
//- The data can be publicly cached (not user-specific).
//- The page must be pre-rendered (for SEO) and be very fast — getStaticProps generates HTML and JSON files, both of which can be cached by a CDN for performance.
import { GetStaticProps } from 'next'
import { useContext, useState } from 'react';
import { CartContext } from '@/context';
import { useRouter } from 'next/router';

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params as { slug: string };

  await db.connect();
  const product = await dbProduct.getProductBySlug(slug);
  await db.disconnect();

  if (!product) return {
    redirect: {
      destination: '/',
      permanent: false
    }
  }

  return {
    props: {
      product
    },
    revalidate: 86_400
  }
}

export default ProductPage;


// esto no tiene nada que ver con el codigo de arriba
// import * as z from 'zod';
// import React from 'react';

// const schema = z.object({
//   name: z.string(),
//   age: z.number(),
// });

// type Props = z.infer<typeof schema>;

// const MyComponent: React.FC<Props> = ({ name, age }) => {
//   return (
//     <div>
//       <p>Nombre: {name}</p>
//       <p>Edad: {age}</p>
//     </div>
//   );
// };