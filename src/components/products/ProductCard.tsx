import { useMemo, useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardMedia from "@mui/material/CardMedia";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import NextLink from 'next/link';
import { IProduct } from "@/interfaces";

interface ProductCard {
    product: IProduct
}

export const ProductCard: React.FC<ProductCard> = ({ product }) => {

    const [ isHovered, setIsHovered ] = useState(false);
    const [ isImageLoaded, setIsImageLoaded ] = useState(false);

    const productImage = useMemo(() => {
        return isHovered
            ? product.images[1]
            : product.images[0]
    }, [ isHovered, product.images ]);

    return (
        <Grid
            item
            xs={6}
            sm={4}
            onMouseEnter={ () => setIsHovered(true) }
            onMouseLeave={ () => setIsHovered(false) }
        >
            <Card>
                <NextLink href={ `/product/${ product.slug }` } passHref legacyBehavior prefetch={ false } >
                    <Link>
                        <CardActionArea>

                            {
                                product.inStock === 0
                                    && <Chip
                                        color='primary'
                                        label='No hay disponibles'
                                        sx={{ position: 'absolute', zIndex: 99, top: '10px', left: '10px' }}
                                    />
                            }
                            <CardMedia
                                component='img'
                                image={ productImage }
                                alt={product.title}
                                className='fadeIn'
                                onLoad={ () => setIsImageLoaded(true) }
                            />
                        </CardActionArea>
                    </Link>
                </NextLink>
            </Card>

            <Box sx={{ mt: 1, display: isImageLoaded ? 'block' : 'none' }} className='fadeIn'>
                <Typography fontWeight={ 700 }>{ product.title }</Typography>
                <Typography fontWeight={ 500 }>${ product.price }</Typography>
            </Box>
        </Grid>
    )
}
