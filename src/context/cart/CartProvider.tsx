import { useEffect, useReducer } from "react";
import Cookie from 'js-cookie';
import { CartContext } from "./CartContext"
import { CartState, cartReducer } from "./cartReducer";
import { ICartProduct, IOrder } from "@/interfaces";
import { ShippingAddress } from "@/interfaces";
import { tesloApi } from "@/api";
import axios from "axios";

interface CartProviderProps {
    children: React.ReactNode
}

const CART_INITIAL_STATE: CartState = {
    isLoaded: false,
    cart: [],
    numberOfItems: 0,
    subTotal: 0,
    tax: 0,
    total: 0,
    shippingAddress: undefined
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {

    const [ state, dispatch ] = useReducer(cartReducer, CART_INITIAL_STATE);

    useEffect(() => {
        const cart = JSON.parse(Cookie.get('cart') ?? '[]');

        if (Array.isArray(cart) && cart.length > 0) dispatch({
            type: '[CART] - Load Cart from cookies | storage',
            payload: cart
        })

    }, []);

    useEffect(() => {
        Cookie.set('cart', JSON.stringify(state.cart))
    }, [ state.cart ]);

    useEffect(() => {

        const numberOfItems = state.cart.reduce((prev, current) => current.quantity + prev , 0);
        const subTotal = state.cart.reduce((prev, current) => (current.price * current.quantity) + prev, 0);
        const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE || 0);

        const orderSummary = {
            numberOfItems,
            subTotal,
            tax: subTotal * taxRate,
            total: subTotal * (taxRate + 1)
        }

        dispatch({
            type: '[CART] - Update order summary',
            payload: orderSummary
        })
    }, [ state.cart ]);

    useEffect(() => {

        const addressCookie = Cookie.get('addresForm');

        if(!addressCookie) return;

        const address: ShippingAddress = JSON.parse(addressCookie);

        dispatch({
            type: '[CART] - LoadAddress from Cookies',
            payload: address
        })

    }, [])

    const addProductToCart = (payload: ICartProduct) => {

        const itemCart = state.cart.find(
            item => item.size === payload.size
                 && item._id === payload._id
        );

        const cart = !itemCart
            ? [ ...state.cart, payload ]
            : state.cart.map(item =>
                                (item.size === payload.size && item._id === payload._id)
                                ? { ...item, quantity: item.quantity + payload.quantity }
                                : item
                            )

        dispatch({
            type: '[CART] - Add Product',
            payload: cart
        })
    }

    const updateCartQuantity = (product: ICartProduct) => {
        dispatch({
            type: '[CART] - Change cart quantity',
            payload: product
        })
    }

    const removeCartProduct = (product: ICartProduct) => {
        dispatch({
            type: '[CART] - Remove product in cart',
            payload: product
        })
    }

    const updateAddress = (address: ShippingAddress) => {

        Cookie.set('addresForm', JSON.stringify(address));

        dispatch({
            type: '[CART] - Update Address',
            payload: address
        })
    }

    const createOrder = async (): Promise<{ hasError: boolean; message: string }> => {

        if (!state.shippingAddress) throw new Error('No hay direccion de entrega');

        const body: IOrder = {
            orderItems: state.cart.map(product => ({
                ...product,
                size: product.size!
            })),
            shippingAddress: state.shippingAddress,
            numberOfItems: state.numberOfItems,
            subTotal: state.subTotal,
            tax: state.tax,
            total: state.total,
            isPaid: false
        }

        try {
            const { data } = await tesloApi.post<IOrder>('/orders', body);

            dispatch({
                type: '[CART] - Order Complete'
            })

            return {
                hasError: false,
                message: data._id!
            }

        } catch (error) {
            if (axios.isAxiosError(error)) return {
                hasError: true,
                message: error.response?.data.message
            }

            return {
                hasError: true,
                message: 'Error no controlado, hable con el administrador'
            }
        }
    }

    return (
        <CartContext.Provider value={{
            ...state,
            addProductToCart,
            updateCartQuantity,
            removeCartProduct,
            updateAddress,
            createOrder,
        }}>
            { children }
        </CartContext.Provider>
    )
}