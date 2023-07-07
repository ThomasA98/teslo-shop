import { CartList, OrdenSummary } from '@/components/cart'
import { ShopLayout } from '@/components/layouts'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'
import NextLink from 'next/link';
import { NextPage } from 'next'
import { useContext, useEffect, useState } from 'react';
import { AuthContext, CartContext } from '@/context';
import { countries } from '@/utils';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';

const SummaryPage: NextPage = () => {

    const router = useRouter();
    const { shippingAddress, numberOfItems, createOrder } = useContext(CartContext);
    const [ isPosting, setIsPosting] = useState(false);
    const [ errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        if (!Cookies.get('addresForm')) {
            router.push('/checkout/address');
        }
    }, [ router ])

    const onCreateOrder = async () => {
        setIsPosting(true);
        const { hasError, message } = await createOrder();

        if (hasError) {
            setIsPosting(false);
            setErrorMessage(message);
            return;
        }

        router.replace(`/orders/${ message }`);
    }

  return (
    <ShopLayout title='Resumen de orden' pageDescription='Resumen de la orden'>
        <Typography variant='h1' component='h1' >Carrito</Typography>
        <Grid container >

            <Grid item xs={ 12 } sm={ 7 } >
                <CartList />
            </Grid>

            <Grid item xs={ 12 } sm={ 5 } >
                <Card className='summary-card'>
                    <CardContent>
                        <Typography variant='h2'>Resumen ({ `${ numberOfItems }` } { numberOfItems === 1 ? 'producto' : 'productos' })</Typography>
                        <Divider sx={{ my: 1 }} />

                        <Box display='flex' justifyContent='space-between'>
                        <Typography variant='subtitle1'>Direccion de entrega</Typography>
                            <NextLink href='/checkout/address' passHref legacyBehavior>
                                <Link underline='always' >Editar</Link>
                            </NextLink>
                        </Box>

                        <Typography>{ shippingAddress?.firstName } { shippingAddress?.lastName }</Typography>
                        <Typography>{ shippingAddress?.address }</Typography>
                        <Typography>{ shippingAddress?.city } { shippingAddress?.zip }</Typography>
                        <Typography>{ countries.find(country => shippingAddress?.country === country.code)?.name }</Typography>
                        <Typography>{ shippingAddress?.phone }</Typography>

                        <Divider sx={{ my: 1 }} />

                        <Box display='flex' justifyContent='end'>
                            <NextLink href='/cart' passHref legacyBehavior>
                                <Link underline='always' >Editar</Link>
                            </NextLink>
                        </Box>

                        <OrdenSummary />

                        <Box sx={{ mt: 3 }} display='flex' flexDirection='column' >
                            <Button
                                color='secondary'
                                className='circular-btn'
                                fullWidth
                                disabled={ isPosting }
                                onClick={ onCreateOrder }
                            >Confirmar Orden</Button>

                            <Chip
                                color='error'
                                label={ errorMessage }
                                sx={{ display: errorMessage ? 'flex' : 'none' }}
                            />
                        </Box>
                    </CardContent>
                </Card>
            </Grid>

        </Grid>
    </ShopLayout>
  )
}

export default SummaryPage