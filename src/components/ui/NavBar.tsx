import { CartContext, UiContext } from '@/context'
import ClearOutlined from '@mui/icons-material/ClearOutlined'
import SearchOutlined from '@mui/icons-material/SearchOutlined'
import ShoppingCartOutlined from '@mui/icons-material/ShoppingCartOutlined'
import AppBar from '@mui/material/AppBar'
import Badge from '@mui/material/Badge'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Input from '@mui/material/Input'
import InputAdornment from '@mui/material/InputAdornment'
import Link from '@mui/material/Link'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { useContext, useMemo, useState } from 'react'

export const NavBar = () => {

    const router = useRouter();
    const { toggleSideMenu } = useContext(UiContext);
    const { numberOfItems } = useContext(CartContext);

    const [ searchTerm, setSearchTerm ] = useState('');
    const [ isSearchVisible, setIsSearchVisible ] = useState(false);

    const onSearchTerm = () => {
        if(searchTerm.trim().length === 0) return;

        router.push(`/search/${ searchTerm }`);
    }

    const genderCategoryByRoute = useMemo(() => router.asPath.split('/')[2], [router.asPath]);

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

                <Box sx={{ display: isSearchVisible ? 'none' : { xs: 'none', sm: 'block' } }} className='fadeIn' >
                    <NextLink href='/category/men' legacyBehavior passHref>
                        <Link>
                            <Button color={ genderCategoryByRoute === 'men' ? 'primary' : 'info' } >Hombres</Button>
                        </Link>
                    </NextLink>

                    <NextLink href='/category/women' legacyBehavior passHref>
                        <Link>
                            <Button color={ genderCategoryByRoute === 'women' ? 'primary' : 'info' } >Mujeres</Button>
                        </Link>
                    </NextLink>

                    <NextLink href='/category/kid' legacyBehavior passHref>
                        <Link>
                            <Button color={ genderCategoryByRoute === 'kid' ? 'primary' : 'info' } >Niños</Button>
                        </Link>
                    </NextLink>
                </Box>

                <Box flex={1} />

                {
                    isSearchVisible
                        ? (<Input
                            sx={{ display: { xs: 'none', sm: 'flex' } }}
                            autoFocus
                            className='fadeIn'
                            value={ searchTerm }
                            onChange={ e => setSearchTerm( e.target.value ) }
                            onKeyUp={ e => e.key === 'Enter' && onSearchTerm() }
                            type='text'
                            placeholder="Buscar..."
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={ () => setIsSearchVisible(true) }
                                    >
                                        <ClearOutlined />
                                    </IconButton>
                                </InputAdornment>
                            }
                        />)
                    : <IconButton sx={{ display: { xs: 'none', sm: 'flex' } }} className='fadeIn' onClick={ () => setIsSearchVisible(true) }>
                        <SearchOutlined />
                    </IconButton>
                }

                <IconButton sx={{ display: { xs: 'flex', sm: 'none' } }} onClick={ () => toggleSideMenu() }>
                    <SearchOutlined />
                </IconButton>

                <NextLink href='/cart'>
                    <Link component={ 'span' } underline='none'>
                        <IconButton>
                            <Badge badgeContent={ numberOfItems > 9 ? '+9' : numberOfItems } color='secondary' >
                                <ShoppingCartOutlined />
                            </Badge>
                        </IconButton>
                    </Link>
                </NextLink>

                <Button onClick={ () => toggleSideMenu() } >Menu</Button>

            </Toolbar>
        </AppBar>
    )
}
