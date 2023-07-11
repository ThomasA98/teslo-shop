import { AdminLayout } from '@/components/layouts/'
import { IProduct } from '@/interfaces'
import { currency } from '@/utils'
import { AddOutlined, CategoryOutlined } from '@mui/icons-material'
import { Box, Button, CardMedia, CircularProgress, Grid, Link } from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { NextPage } from 'next'
import useSWR from 'swr'
import NextLink from 'next/link'

const columns: GridColDef[] = [
    {
        field: 'img',
        headerName: 'Foto',
        renderCell: ({ row }) => {
            return <a href={ `/product/${ row.slug }` } target='_blank'>
                <CardMedia
                    component='img'
                    className='fadeIn'
                    alt={ row.title }
                    image={ `/products/${ row.image }` }
                />
            </a>
        }
    },
    {
      field: 'title',
      headerName: 'Title',
      width: 250,
      renderCell: ({ row }) => {
        return <NextLink href={ `/admin/products/${ row.slug }` } passHref legacyBehavior >
          <Link underline='always'>
            { row.title }
          </Link>
        </NextLink>
      }
    },
    { field: 'gender', headerName: 'Genero' },
    { field: 'type', headerName: 'Tipo' },
    { field: 'inStock', headerName: 'Inventario' },
    { field: 'price', headerName: 'Precio' },
    { field: 'sizes', headerName: 'Tallas', width: 250 },
];

const ProductsPage: NextPage = () => {

    const { data, error } = useSWR<IProduct[]>('/api/admin/products');

    if (!data && !error) return <CircularProgress />

    const rows = data!.map(({ _id, images, title, gender, type, inStock, price, sizes, slug }) => ({
        id: _id,
        img: images[0],
        price: currency.format(price),
        sizes: sizes.join(', '),
        title,
        gender,
        type,
        inStock,
        slug,
    }))

  return (
    <AdminLayout
        title={ `Products (${ data?.length })` }
        subTitle='Mantenimiento de productos'
        icon={ <CategoryOutlined /> }
    >
      <Box display='flex' justifyContent='end' sx={{ mb: 2 }}>
        <Button
          startIcon={ <AddOutlined /> }
          color='secondary'
          href='/admin/products/new'
        >
          Crear Producto
        </Button>
      </Box>

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

export default ProductsPage