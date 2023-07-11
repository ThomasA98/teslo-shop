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
import { AdminLayout, ShopLayout } from '@/components/layouts'
import { CartList, OrdenSummary } from '@/components/cart'
import { GetServerSideProps } from 'next'
import { dbOrders } from '@/database'
import { IOrder } from '@/interfaces'
import { CircularProgress } from '@mui/material'


interface OrderPageProps {
    order: IOrder
}

const OrderPage: NextPage<OrderPageProps> = ({ order }) => {

    const { shippingAddress } = order;

  return (
    <AdminLayout title='Resumen de la orden 123456789' subTitle={`Resumen de la orden: ${ order._id }`} >

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
                            >
                                <CircularProgress />
                            </Box>

                            <Box display='flex' flexDirection='column' >
                            {
                                order.isPaid
                                ? <Chip
                                    sx={{ my: 2, flex: 1 }}
                                    label='Orden ya fue pagada'
                                    variant='outlined'
                                    color='success'
                                    icon={ <CreditScoreOutlined /> }
                                />
                                : <Chip
                                    sx={{ my: 2, flex: 1 }}
                                    label='Orden no pagada'
                                    variant='outlined'
                                    color='error'
                                    icon={ <CreditScoreOutlined /> }
                                />
                            }
                            </Box>

                        </Box>
                    </CardContent>
                </Card>
            </Grid>

        </Grid>
    </AdminLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {

    const { id = '' } = query;

    const order = await dbOrders.getOrderById(id.toString());

    if (!order) return {
        redirect: {
            destination: '/404',
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