import { db } from '@/database'
import { User, Products, Order } from '@/models'
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
    numberOfOrders: number
    paidOrders: number
    notPaidOrders: number
    numberOfClients: number
    numberOfProducts: number
    productsWithNoInventory: number
    lowInentory: number
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    await db.connect();

    const [ numberOfClients, orders, products ] = await Promise.all([
        User.count({
            role: 'client'
        }).lean(),
        Order.find().lean(),
        Products.find().lean()
    ]);

    await db.disconnect();

    const numberOfOrders = orders.length;

    const paidOrders = orders.filter(order => order.isPaid).length;

    const notPaidOrders = numberOfOrders - paidOrders;

    const numberOfProducts = products.length;

    const productsWithNoInventory = products.filter(product => product.inStock < 1).length;

    const lowInentory = products.filter(product => product.inStock <= 10).length;

    return res.status(200).json({
        numberOfClients,
        numberOfOrders,
        paidOrders,
        notPaidOrders,
        numberOfProducts,
        productsWithNoInventory,
        lowInentory,
    });
}