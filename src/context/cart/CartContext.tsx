import { createContext } from "react";
import { ICartProduct, ShippingAddress } from "@/interfaces";

interface CartContextProps {
    isLoaded: boolean
    cart: ICartProduct[]
    numberOfItems: number
    subTotal: number
    tax: number
    total: number
    shippingAddress?: ShippingAddress
    addProductToCart: (payload: ICartProduct) => void
    updateCartQuantity: (product: ICartProduct) => void
    removeCartProduct: (product: ICartProduct) => void
    updateAddress: (address: ShippingAddress) => void
    createOrder: () => Promise<{ hasError: boolean; message: string; }>
}

export const CartContext = createContext({} as CartContextProps);