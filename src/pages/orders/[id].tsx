import { NextPage } from 'next'
import NextLink from 'next/link'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'
import CreditCardOffOutlined from '@mui/icons-material/CreditCardOffOutlined'
import CreditScoreOutlined from '@mui/icons-material/CreditScoreOutlined'
import { ShopLayout } from '@/components/layouts'
import { CartList, OrdenSummary } from '@/components/cart'
import { PayPalButtons } from "@paypal/react-paypal-js";

type OrderResponseBody = {
    id: string
    status:
        | "CREATED"
        | "SAVED"
        | "APPROVED"
        | "VOIDED"
        | "COMPLETED"
        | "PAYER_ACTION_REQUIRED"
}

interface OrderPageProps {
    order: IOrder
}

const OrderPage: NextPage<OrderPageProps> = ({ order }) => {

    const { shippingAddress } = order;
    const router = useRouter();
    const [ isPaying, setIsPaying ] = useState(false);

    const onOrderCompleted = async (details: OrderResponseBody) => {

        if (details.status !== 'COMPLETED') return alert('No hay pago en paypal');

        setIsPaying(true);

        try {
            const { data } = await tesloApi.post(`/orders/pay`, {
                transactionId: details.id,
                orderId: order._id
            });

            router.reload();

        } catch (error) {
            setIsPaying(false);
            console.log(error);
            alert('Error');
        }

    }

  return (
    <ShopLayout title='Resumen de la orden 123456789' pageDescription='Resumen de la orden'>
        <Typography variant='h1' component='h1' >Orden: { order._id }</Typography>

        {
            order.isPaid
            ? <Chip
                sx={{ my: 2 }}
                label='Orden ya fue pagada'
                variant='outlined'
                color='success'
                icon={ <CreditScoreOutlined /> }
            />
            : <Chip
                sx={{ my: 2 }}
                label='Pendiente de pago'
                variant='outlined'
                color='error'
                icon={ <CreditCardOffOutlined /> }
            />
        }

        <Grid container >

            <Grid item xs={ 12 } sm={ 7 } >
                <CartList products={ order.orderItems } />
            </Grid>

            <Grid item xs={ 12 } sm={ 5 } >
                <Card className='summary-card'>
                    <CardContent>
                        <Typography variant='h2'>Resumen ({ order.numberOfItems } { order.numberOfItems === 1 ? 'producto' : 'productos' })</Typography>
                        <Divider sx={{ my: 1 }} />

                        <Box display='flex' justifyContent='space-between'>
                            <Typography variant='subtitle1'>Direccion de entrega</Typography>
                        </Box>

                        <Typography>{ shippingAddress.firstName } { shippingAddress.lastName }</Typography>
                        <Typography>{ shippingAddress.address }</Typography>
                        <Typography>{ shippingAddress.city } { shippingAddress.zip }</Typography>
                        <Typography>{ shippingAddress.country }</Typography>
                        <Typography>{ shippingAddress.phone }</Typography>


                        <Divider sx={{ my: 1 }} />

                        <Box display='flex' justifyContent='end'>
                            <NextLink href='/cart' passHref legacyBehavior>
                                <Link underline='always' >Editar</Link>
                            </NextLink>
                        </Box>

                        <OrdenSummary orderValues={{
                            numberOfItems: order.numberOfItems,
                            subTotal: order.subTotal,
                            tax: order.tax,
                            total: order.total,
                        }} />

                        <Box sx={{ mt: 3 }} display='flex' flexDirection='column' >
                            <Box
                            display='flex'
                            justifyContent='center'
                            className='fadeIn'
                            sx={{ display: isPaying ? 'flex' : 'none' }}
                            >
                                <CircularProgress />
                            </Box>

                            <Box display='flex' sx={{ display: isPaying ? 'none' : 'flex', flex: 1 }} flexDirection='column' >
                            {
                                order.isPaid
                                ? <Chip
                                    sx={{ my: 2 }}
                                    label='Orden ya fue pagada'
                                    variant='outlined'
                                    color='success'
                                    icon={ <CreditScoreOutlined /> }
                                />
                                : <PayPalButtons
                                    createOrder={(data, actions) => {
                                        return actions.order.create({
                                            purchase_units: [
                                                {
                                                    amount: {
                                                        value: order.total.toString(),
                                                    },
                                                },
                                            ],
                                        });
                                    }}
                                    onApprove={(data, actions) => {
                                        return actions.order!.capture().then((details) => onOrderCompleted(details));
                                    }}
                                />
                            }
                            </Box>

                        </Box>
                    </CardContent>
                </Card>
            </Grid>

        </Grid>
    </ShopLayout>
  )
}

import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/react'
import { dbOrders } from '@/database'
import { IOrder } from '@/interfaces'
import { tesloApi } from '@/api'
import { useRouter } from 'next/router'
import { CircularProgress } from '@mui/material'
import { useState } from 'react'

export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {

    const { id = '' } = query;

    const session: any = await getSession({ req });

    if (!session) return {
        redirect: {
            destination: `/auth/login?p=/orders/${ id }`,
            permanent: false
        }
    }

    const order = await dbOrders.getOrderById(id.toString());

    if (!order) return {
        redirect: {
            destination: '/orders/history',
            permanent: false
        }
    }

    if (order.user !== session.user?._id) return {
        redirect: {
            destination: '/orders/history',
            permanent: false
        }
    }

    return {
        props: {
            order
        }
    }
}

export default OrderPage