import { ISize } from "@/interfaces"
import { Box, Button } from "@mui/material"

interface SizeSelectorProps {
    selectedSize?: ISize
    sizes: ISize[]
    onSelectedSize: (size: ISize) => void
}


export const SizeSelector: React.FC<SizeSelectorProps> = ({ selectedSize, sizes, onSelectedSize }) => {
  return (
    <Box>{
        sizes.map( size => (
            <Button
                key={ size }
                onClick={ () => onSelectedSize(size) }
                size='small'
                color={ selectedSize === size ? 'primary' : 'info' }
            >{ size }</Button>
        ))
    }</Box>
  )
}
