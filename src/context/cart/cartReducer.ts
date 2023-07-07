import { ICartProduct, ShippingAddress } from "@/interfaces";

export interface CartState {
    isLoaded: boolean
    cart: ICartProduct[]
    numberOfItems: number
    subTotal: number
    tax: number
    total: number
    shippingAddress?: ShippingAddress
}

type CartActionType
    = { type: '[CART] - Load Cart from cookies | storage', payload: ICartProduct[] }
    | { type: '[CART] - Add Product', payload: ICartProduct[] }
    | { type: '[CART] - Change cart quantity', payload: ICartProduct }
    | { type: '[CART] - Remove product in cart', payload: ICartProduct }
    | { type: '[CART] - LoadAddress from Cookies', payload: ShippingAddress }
    | { type: '[CART] - Update Address', payload: ShippingAddress }
    | { type: '[CART] - Order Complete' }
    | {
        type: '[CART] - Update order summary',
        payload: Omit<CartState, 'cart' | 'isLoaded'>
    }

export const cartReducer = (state: CartState, action: CartActionType): CartState => {

    switch (action.type) {
        case '[CART] - Load Cart from cookies | storage':
            return {
                ...state,
                isLoaded: true,
                cart: action.payload
            }
        case '[CART] - Add Product':
            return {
                ...state,
                cart: action.payload
            }
        case '[CART] - Change cart quantity':
            return {
                ...state,
                cart: state.cart.map( product => {
                    if ( product._id !== action.payload._id ) return product;

                    if ( product.size !== action.payload.size ) return product;

                    if (!action.payload.quantity) return { ...product, quantity: 1 };

                    return action.payload;
                })
            }
        case '[CART] - Remove product in cart':
            return {
                ...state,
                cart: state.cart.filter(
                    product => !(product._id === action.payload._id && product.size === action.payload.size)
                )
            }
        case '[CART] - Update order summary':
            return {
                ...state,
                ...action.payload
            }
        case '[CART] - Update Address':
        case '[CART] - LoadAddress from Cookies':
            return {
                ...state,
                shippingAddress: action.payload
            }
        case '[CART] - Order Complete':
            return {
                ...state,
                cart: [],
                numberOfItems: 0,
                subTotal: 0,
                tax: 0,
                total: 0
            }
        default: return state
    }

}