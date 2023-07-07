import { tesloApi } from '@/api'
import { AuthLayout } from '@/components/layouts'
import { validations } from '@/utils'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import NextLink from 'next/link'
import { useContext, useState } from 'react'
import { useForm } from 'react-hook-form'
import ErrorOutline from '@mui/icons-material/ErrorOutline'
import { useRouter } from 'next/router'
import { AuthContext } from '@/context'
import { getSession, signIn } from 'next-auth/react'

interface FormData {
    name: string
    email: string
    password: string
}

const RegisterPage = () => {

    const router = useRouter();
    const { registerUser } = useContext(AuthContext);

    const { register, handleSubmit, formState: { errors }, } = useForm<FormData>();
    const [ showError, setShowError ] = useState(false);
    const [ errorMessage, setErrorMessage ] = useState('');

    const onRegisterForm = async ({ email, name, password }: FormData) => {

        setShowError(false);

        const response = await registerUser({
            email,
            name,
            password
        });

        // const redirectUrl = router.asPath.split('?p=')[1] || '/';

        // if (!response.hasError) return router.replace(redirectUrl);

        if (!response.hasError) return await signIn('credentials', {
            email,
            password
        });

        setShowError(true);
        setTimeout(() => setShowError(false), 3_000);
        setErrorMessage(response.message);

    }

    return (
        <AuthLayout title="Register">
            <form onSubmit={ handleSubmit(onRegisterForm) }>
                <Box sx={{ width: 350, padding: '10px 20px' }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography variant='h1' component='h1'>Crear cuenta</Typography>
                            <Chip
                                label='No reconocemos ese usuario / contraseña'
                                color='error'
                                icon={ <ErrorOutline /> }
                                className='fadeIn'
                                sx={{ display: showError ? 'flex' : 'none' }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label='Nombre completo'
                                variant="filled"
                                fullWidth
                                { ...register('name', {
                                    required: 'El nombre es obligatorio',
                                    minLength: { value: 2, message: 'El nombre debe tener al menos 2 caracteres' }
                                }) }
                                error={ !!errors.name }
                                helperText={ errors.name?.message }
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label='Correo'
                                type='email'
                                variant="filled"
                                fullWidth
                                { ...register("email", {
                                    required: 'Este campo es requerido',
                                    validate: validations.isEmail
                                }) }
                                error={ !!errors.email }
                                helperText={ errors.email?.message }
                            />
                        </Grid>
                        <Grid item xs={12}>
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
                        <Grid item xs={12}>
                            <Button
                                color='secondary'
                                className='circular-btn'
                                size='large'
                                fullWidth
                                type='submit'
                            >Ingresar</Button>
                        </Grid>
                        <Grid item xs={12} display='flex' justifyContent='end'>
                            <NextLink href={ `/auth/login${ router.query.p ? `?p=${ router.query.p.toString() }` : '' }` } passHref legacyBehavior >
                                <Link underline="always">
                                    ¿Ya tienes una cuenta?
                                </Link>
                            </NextLink>
                        </Grid>
                    </Grid>
                </Box>
            </form>
        </AuthLayout>
    )
}

import { GetServerSideProps } from 'next'

export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {

    const session = await getSession({ req });

    const { p = '/' } = query;

    if (session) return {
        redirect: {
            destination: p.toString(),
            permanent: false
        }
    }

    return {
        props: {}
    }
}

export default RegisterPage