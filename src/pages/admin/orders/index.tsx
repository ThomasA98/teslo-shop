import { AdminLayout } from '@/components/layouts'
import { IOrder, IUser } from '@/interfaces'
import { currency } from '@/utils'
import { ConfirmationNumberOutlined } from '@mui/icons-material'
import { Chip, CircularProgress, Grid } from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { NextPage } from 'next'
import useSWR from 'swr'

const columns: GridColDef[] = [
    { field: 'id', headerName: 'Order ID', width: 250 },
    { field: 'email', headerName: 'Correo', width: 250 },
    { field: 'name', headerName: 'Nombre completo', width: 300 },
    { field: 'total', headerName: 'Monto total', width: 250 },
    {
        field: 'isPaid',
        headerName: 'Pagana',
        renderCell: ({ row }) =>
            row.isPaid
                ? <Chip variant='outlined' label='Pagada' color='success' />
                : <Chip variant='outlined' label='Pendiente' color='error' />
    },
    { field: 'numberOfProducts', headerName: 'Numero Productos', align: 'center' },
    {
        field: 'check',
        headerName: 'Ver orden',
        renderCell: ({ row }) => <a href={ `/admin/orders/${ row.id }` } target='_blank'>Ver orden</a>
    },
    { field: 'createdAt', headerName: 'Creada en', width: 300 },
];

const OrdersPage: NextPage = () => {

    const { data, error } = useSWR<IOrder[]>('/api/admin/orders');

    if (!data && !error) return <CircularProgress />

    const rows = data!.map(({ _id, user, total, isPaid, numberOfItems, createdAt }) => ({
        id: _id,
        numberOfProducts: numberOfItems,
        email: (user as IUser).email,
        name: (user as IUser).name,
        total: currency.format(total),
        isPaid,
        createdAt
    }))

  return (
    <AdminLayout
        title='Ordenes'
        subTitle='Mantenimiento de ordenes'
        icon={ <ConfirmationNumberOutlined /> }
    >
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
    </AdminLayout>
  )
}

export default OrdersPage