import { ShopLayout } from '@/components/layouts'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

export default function Custom404() {
  return (
    <ShopLayout title='Page not found' pageDescription='No hay nada que mostrar aquí' >
        <Box
            display='flex'
            justifyContent='center'
            alignItems='center'
            height='calc(100vh - 200px)'
            sx={{ flexDirection: { xs: 'column', sm: 'row' } }}
        >
            <Typography variant='h1' component='h1' fontSize={80} fontWeight={200} >404 |</Typography>
            <Typography>No se encontro ningun contenido en esta página</Typography>
        </Box>
    </ShopLayout>
  )
}
