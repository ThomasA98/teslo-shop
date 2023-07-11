import { useContext } from 'react'
import NextLink from 'next/link'
import { UiContext } from '@/context'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Link from '@mui/material/Link'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'

export const AdminNavbar = () => {
    const { toggleSideMenu } = useContext(UiContext);

    return (
        <AppBar>
            <Toolbar>
                <NextLink href='/'>
                    <Link display='flex' alignItems='center' component={'span'} >
                        <Typography variant='h6'>Teslo |</Typography>
                        <Typography sx={{ ml: 0 }}>Shop</Typography>
                    </Link>
                </NextLink>

                <Box flex={1} />

                <Button onClick={ () => toggleSideMenu() } >Menu</Button>

            </Toolbar>
        </AppBar>
    )
}