import { ShopLayout } from '@/components/layouts'
import Chip from '@mui/material/Chip'
import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'
import { NextPage } from 'next'
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import NextLink from 'next/link'

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 100 },
  { field: 'fullname', headerName: 'Nombre completo', width: 300 },
  {
    field: 'paid',
    headerName: 'Pagada',
    description: 'Muestra si esta pagada la orden o no',
    width: 200,
    renderCell: ( params: GridRenderCellParams ) => params.row.paid
      ? <Chip color='success' label='Pagada' variant='outlined' />
      : <Chip color='error' label='No Pagada' variant='outlined' />
  },
  {
    field: 'url',
    headerName: 'Ir a',
    width: 200,
    renderCell: ( params: GridRenderCellParams ) => (
      <NextLink href={ `/orders/${ params.row.orderId }` } passHref legacyBehavior>
        <Link>Ir a la compra</Link>
      </NextLink>
    )
  }
]

interface HistoryPageProps {
  orders: IOrder[]
}

const HistoryPage: NextPage<HistoryPageProps> = ({ orders }) => {

  const rows = orders.map((order, index) => ({
    id: index + 1,
    paid: order.isPaid,
    fullname: `${ order.shippingAddress.firstName } ${ order.shippingAddress.lastName } `,
    orderId: order._id
  }));

  return (
    <ShopLayout title='Historial de ordenes' pageDescription='Historial de ordenes del cliente'>
        <Typography variant='h1' component='h1' >Historial de ordenes</Typography>

        <Grid container >
            <Grid item xs={ 12 } sx={{ height: 650, width: '100%' }}>
              <DataGrid
                rows={ rows }
                columns={ columns }
                initialState={{
                  pagination: {
                    paginationModel: { pageSize: 10 }
                  }
                }}
                pageSizeOptions={ [10] }
              />
            </Grid>
        </Grid>
    </ShopLayout>
  )
}

import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/react'
import { dbOrders } from '@/database'
import { IOrder } from '@/interfaces'

export const getServerSideProps: GetServerSideProps = async ({ req }) => {

  const session: any = await getSession({ req });

  if(!session) return {
    redirect: {
      destination: '/auth/login?p=/orders/history',
      permanent: false
    }
  }

  console.log(session.user)

  const orders = await dbOrders.getOrdersByUser(session.user._id);

  console.log(orders);

  return {
    props: {
      id: session.user._id,
      orders
    }
  }
}

export default HistoryPage