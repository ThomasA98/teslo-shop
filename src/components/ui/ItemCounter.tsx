import { AddCircleOutline, RemoveCircleOutline } from "@mui/icons-material"
import { Box, IconButton, Typography } from "@mui/material"
import React from "react"

interface ItemCounterProps {
  currentValue: number
  maxValue: number
  updateQuantity: (newQuantity: number) => void
}

export const ItemCounter: React.FC<ItemCounterProps> = ({ currentValue, maxValue, updateQuantity }) => {

  console.log(currentValue);

  const onUpdate = (newValue: number) => {
    if (newValue > 0 && newValue <= maxValue) return updateQuantity(newValue);
  }

  return (
    <Box display='flex' alignItems='center'>
        <IconButton
          onClick={ () => onUpdate(currentValue - 1) }
        >
            <RemoveCircleOutline />
        </IconButton>
        <Typography sx={{ width: 40, textAlign: 'center' }}>{ currentValue }</Typography>
        <IconButton
          onClick={ () => onUpdate(currentValue + 1) }
        >
            <AddCircleOutline />
        </IconButton>
    </Box>
  )
}
