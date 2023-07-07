import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import Divider from '@mui/material/Divider'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import NextLink from 'next/link'
import ErrorOutline from '@mui/icons-material/ErrorOutline'
import { AuthLayout } from '@/components/layouts'
import { validations } from '@/utils'
import { useRouter } from 'next/router'
import { getSession, signIn, getProviders } from 'next-auth/react'

interface FormData {
    email: string
    password: string
}

const LoginPage = () => {

    const router = useRouter();
    const { register, handleSubmit, formState: { errors }, } = useForm<FormData>();
    const [ showError, setShowError ] = useState(false);
    const [ providers, setProviders ] = useState<any>({});

    useEffect(() => {
        getProviders()
            .then(prov => {
                setProviders(prov)
            })
    }, [])

    const onLoginUser = async ({ email, password }: FormData) => {

        setShowError(false);

        // const isValidLogin = await loginUser(email, password);

        // if (isValidLogin) return router.replace(router.query.p?.toString() || '/');

        // setShowError(true);
        // setTimeout(() => setShowError(false), 3_000);

        await signIn('credentials', {
            email,
            password
        });

    }

  return (
    <AuthLayout title="Login">
        <form onSubmit={ handleSubmit(onLoginUser) }>
            <Box sx={{ width: 350, padding: '10px 20px' }}>
                <Grid container spacing={ 2 }>
                    <Grid item xs={ 12 }>
                        <Typography variant='h1' component='h1'>Iniciar Sesión</Typography>
                        <Chip
                            label='No reconocemos ese usuario / contraseña'
                            color='error'
                            icon={ <ErrorOutline /> }
                            className='fadeIn'
                            sx={{ display: showError ? 'flex' : 'none' }}
                        />
                    </Grid>
                    <Grid item xs={ 12 }>
                        <TextField
                            label='Correo'
                            variant="filled"
                            fullWidth
                            type='email'
                            { ...register("email", {
                                required: 'Este campo es requerido',
                                validate: validations.isEmail
                            }) }
                            error={ !!errors.email }
                            helperText={ errors.email?.message }
                        />
                    </Grid>
                    <Grid item xs={ 12 }>
                        <TextField
                            label='Contraseña'
                            type="password"
                            variant="filled"
                            fullWidth
                            { ...register('password', {
                                required: 'Este campo es requerido',
                                minLength: { value: 6, message: 'Mínimo 6 caracteres'}
                            }) }
                            error={ !!errors.password }
                            helperText={ errors.password?.message }
                        />
                    </Grid>
                    <Grid item xs={ 12 }>
                        <Button
                            type="submit"
                            color='secondary'
                            className='circular-btn'
                            size='large'
                            fullWidth
                        >Ingresar</Button>
                    </Grid>
                    <Grid item xs={ 12 } display='flex' justifyContent='end'>
                        <NextLink href={ `/auth/register${ router.query.p ? `?p=${ router.query.p.toString() }` : '' }` } passHref legacyBehavior >
                            <Link underline="always">
                                ¿No tienes cuenta?
                            </Link>
                        </NextLink>
                    </Grid>
                </Grid>

                <Grid item xs={ 12 } display='flex' justifyContent='end'>
                    <Divider sx={{ width: '100%', mb: 2 }} />
                        {
                            Object.values(providers).map((provider: any) => {

                                if (provider.id === 'credentials') return (
                                    <div key={ provider.id }></div>
                                )

                                return (
                                    <Button
                                        key={ provider.id }
                                        variant='outlined'
                                        fullWidth
                                        color='primary'
                                        sx={{ mb: 1 }}
                                        onClick={ () => signIn(provider.id) }
                                    >
                                        { provider.name }
                                    </Button>
                                )
                            })
                        }
                </Grid>
            </Box>
        </form>
    </AuthLayout>
  )
}

import { GetServerSideProps } from 'next'

export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {

    const session = await getSession({
        req
    });

    const { p = '/' } = query;

    if (session) return {
        redirect: {
            destination: p.toString(),
            permanent: false
        }
    }

    return {
        props: {  }
    }
}

export default LoginPage