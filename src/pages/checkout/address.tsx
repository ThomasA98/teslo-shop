import { ShopLayout } from "@/components/layouts";
import { CartContext } from "@/context";
import { countries } from "@/utils";
import { Box, Button, FormControl, Grid, MenuItem, TextField, Typography } from "@mui/material";
import Cookies from "js-cookie";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";

interface FormData {
    firstName: string
    lastName: string
    address: string
    address2?: string
    zip: string
    city: string
    country: string
    phone: string
}

const defaultFormValues: FormData = {
    firstName: '',
    lastName: '',
    address: '',
    address2: '',
    zip: '',
    city: '',
    country: countries[0].code,
    phone: ''
}

const getAddressFromCookies = (): FormData => {

    const cookieAddresForm = Cookies.get('addresForm');

    return cookieAddresForm ? JSON.parse(cookieAddresForm) : defaultFormValues;

}

const AddressPage: NextPage = () => {

    const router = useRouter();
    const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
        defaultValues: getAddressFromCookies()
    });

    useEffect(() => {
        reset(getAddressFromCookies());
    }, [ reset ])

    const { updateAddress, shippingAddress } = useContext(CartContext);

    const submit = (data: FormData) => {

        updateAddress(data);

        router.push('/checkout/summary');

    }

  return (
    <ShopLayout title="Direccion" pageDescription="Confirmar direccion del destino">
        <Typography variant="h1" component='h1'>Direccion</Typography>

        <form onSubmit={ handleSubmit(submit) }>
            <Grid container spacing={ 2 } sx={{ mt: 2 }}>
                <Grid item xs={ 12 } sm={ 6 }>
                    <TextField
                        label='Nombre'
                        variant="filled"
                        fullWidth
                        { ...register('firstName', {
                            required: 'El nombre es obligatorio',
                        })}
                        error={ !!errors.firstName }
                        helperText={ errors.firstName?.message }
                    />
                </Grid>
                <Grid item xs={ 12 } sm={ 6 }>
                    <TextField
                        label='Apellido'
                        variant="filled"
                        fullWidth
                        { ...register('lastName', {
                            required: 'El apellido es obligatorio'
                        }) }
                        error={ !!errors.lastName }
                        helperText={ errors.lastName?.message }
                    />
                </Grid>
                <Grid item xs={ 12 } sm={ 6 }>
                    <TextField
                        label='Direccion'
                        variant="filled"
                        fullWidth
                        { ...register('address', {
                            required: 'La direccion es obligatoria'
                        })}
                        error={ !!errors.address }
                        helperText={ errors.address?.message }
                    />
                </Grid>
                <Grid item xs={ 12 } sm={ 6 }>
                    <TextField
                        label='Direccion 2 (opcional)'
                        variant="filled"
                        fullWidth
                        { ...register('address2', {
                            required: false,
                        })}
                        error={ !!errors.address2 }
                        helperText={ errors.address2?.message }
                    />
                </Grid>
                <Grid item xs={ 12 } sm={ 6 }>
                    <TextField
                        label='Codigo Postal'
                        variant="filled"
                        fullWidth
                        { ...register('zip', {
                            required: 'El codigo postal es obligatorio'
                        })}
                        error={ !!errors.zip }
                        helperText={ errors.zip?.message }
                    />
                </Grid>
                <Grid item xs={ 12 } sm={ 6 }>
                    <TextField
                        label='Ciudad'
                        variant="filled"
                        fullWidth
                        { ...register('city', {
                            required: 'La ciudad es obligatoria'
                        })}
                        error={ !!errors.city }
                        helperText={ errors.city?.message }
                    />
                </Grid>
                <Grid item xs={ 12 } sm={ 6 }>
                    <FormControl fullWidth>
                        <TextField
                            select
                            variant="filled"
                            label='País'
                            defaultValue={ shippingAddress?.country || countries[0].code }
                            { ...register('country', { required: 'Selecciona un país' }) }
                            error={ !!errors.country }
                            helperText={ errors.country?.message }
                        >
                            {
                                countries.map(country => (
                                    <MenuItem key={ country.code } value={ country.code }>{ country.name }</MenuItem>
                                ))
                            }
                        </TextField>
                    </FormControl>
                </Grid>
                <Grid item xs={ 12 } sm={ 6 }>
                    <TextField
                        label='Teléfono'
                        variant="filled"
                        fullWidth
                        { ...register('phone', {
                            required: 'El numero de teléfono es obligatorio'
                        })}
                        error={ !!errors.phone }
                        helperText={ errors.phone?.message }
                    />
                </Grid>
            </Grid>
            <Box sx={{ mt: 5 }} display='flex' justifyContent='center' >
                <Button
                    color='secondary'
                    className="circular-btn"
                    size='large'
                    type='submit'
                >Revisar pedido</Button>
            </Box>
        </form>
    </ShopLayout>
  )
}

// import { GetServerSideProps } from 'next'

// export const getServerSideProps: GetServerSideProps = async ({ req }) => {

//     const { token = '' } = req.cookies;

//     let userId;
//     let isValidToken;

//     try {
//         userId = await jwt.isValidToken(token);
//         isValidToken = true;
//     } catch (error) {
//         isValidToken = false;
//     }

//     if (!isValidToken) return {
//         redirect: {
//             destination: '/auth/login?p=/checkout/address',
//             permanent: false
//         }
//     }

//     return {
//         props: {

//         }
//     }
// }

export default AddressPage;

// https://www.twitch.tv/karmavt_