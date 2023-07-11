import NextLink from 'next/link';
import { Box, Button, CardActionArea, CardMedia, Grid, Link, Typography } from '@mui/material';
import { ItemCounter } from '../ui';
import { useContext } from 'react';
import { CartContext } from '@/context';
import { ICartProduct, IOrderItem } from '@/interfaces';

interface CartListProps {
  editable?: boolean
  products?: IOrderItem[]
}

export const CartList: React.FC<CartListProps> = ({ editable = false, products }) => {

  const { cart, updateCartQuantity, removeCartProduct } = useContext(CartContext);

  const onNewCartQuantityValue = (product: ICartProduct, newQuantity: number) => {

    updateCartQuantity({
      ...product,
      quantity: newQuantity
    });

  }

  const productsToShow = products ? products : cart;

  const onRemove = (product: ICartProduct) => {
    removeCartProduct(product);
  }

  return (
    <>{
        productsToShow.map( product => (
            <Grid container spacing={ 2 } key={ product.slug + product.size } sx={{ mb: 1 }} >
              <Grid item xs={ 3 }>
                {/* llevar a la paguina del producto */}
                <NextLink href={ `/product/${ product.slug }` } passHref legacyBehavior>
                  <Link>
                    <CardActionArea>
                      <CardMedia
                        image={ product.image }
                        component='img'
                        sx={{ borderRadius: '5px' }}
                      />
                    </CardActionArea>
                  </Link>
                </NextLink>
              </Grid>
              <Grid item xs={ 7 }>
                <Box display='flex' flexDirection='column'>
                  <Typography variant='body1'>{ product.title }</Typography>
                  <Typography variant='body1'>Talla: <strong>{ product.size }</strong></Typography>

                  {
                    editable
                    ? <ItemCounter
                        currentValue={ product.quantity }
                        maxValue={ 10 }
                        updateQuantity={ (newQuantity: number) => onNewCartQuantityValue(product as ICartProduct, newQuantity) }
                      />
                    : <Typography variant='h4' >
                        { product.quantity } producto{ product.quantity > 1 ? 's' : '' }
                    </Typography>
                  }
                </Box>
              </Grid>
              <Grid item xs={ 2 } display='flex' alignItems='center' flexDirection='column' >
                <Typography variant='subtitle1'>${ product.price }</Typography>

                {
                  editable && <Button onClick={ () => onRemove(product as ICartProduct) } variant='text' color='secondary'>Remover</Button>
                }
              </Grid>
            </Grid>
        ))
    }</>
  )
}
