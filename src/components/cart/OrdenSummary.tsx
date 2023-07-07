import { CartContext } from "@/context";
import { currency } from "@/utils";
import { Grid, Typography } from "@mui/material"
import { useContext } from "react"

interface OrdenSummaryProps {
    orderValues?: {
        numberOfItems: number
        subTotal: number
        tax: number
        total: number
    }
}

export const OrdenSummary: React.FC<OrdenSummaryProps> = ({ orderValues }) => {

    const { numberOfItems, subTotal, tax, total } = useContext(CartContext);

    const summaryValues = orderValues ? orderValues : { numberOfItems, subTotal, tax, total };

  return (
    <Grid container >
        <Grid item xs={ 6 }>
            <Typography>No. Productos</Typography>
        </Grid>

        <Grid item xs={ 6 } display='flex' justifyContent='end'>
            <Typography>{ `${ summaryValues.numberOfItems } item${ summaryValues.numberOfItems > 1 ? 's' : '' }` }</Typography>
        </Grid>

        <Grid item xs={ 6 }>
            <Typography>SubTotal</Typography>
        </Grid>

        <Grid item xs={ 6 } display='flex' justifyContent='end'>
            <Typography>{ currency.format(summaryValues.subTotal) }</Typography>
        </Grid>

        <Grid item xs={ 6 }>
            <Typography>Impuestos ({ Number(process.env.NEXT_PUBLIC_TAX_RATE || 0) * 100 }%)</Typography>
        </Grid>

        <Grid item xs={ 6 } display='flex' justifyContent='end'>
            <Typography>{ currency.format(summaryValues.tax) }</Typography>
        </Grid>

        <Grid item xs={ 6 } sx={{ mt: 2 }}>
            <Typography variant="subtitle1" >Total</Typography>
        </Grid>

        <Grid item xs={ 6 } display='flex' justifyContent='end'>
            <Typography variant="subtitle1" >{ currency.format(summaryValues.total) }</Typography>
        </Grid>
    </Grid>
  )
}
