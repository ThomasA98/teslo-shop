import Grid from "@mui/material/Grid"
import { IProduct } from "@/interfaces"
import { ProductCard } from "./ProductCard"

interface ProductListProps {
    products: IProduct[]
}

export const ProductList: React.FC<ProductListProps> = ({ products }) => {
  return (
    <Grid container spacing={ 4 }>{
        products.map(product => <ProductCard key={ product.slug } product={ product } />)
    }</Grid>
  )
}
