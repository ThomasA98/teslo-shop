import { db } from '@/database'
import { IProduct } from '@/interfaces'
import Product from '@/models/Products'
import type { NextApiRequest, NextApiResponse } from 'next'

type Data
    = { message: string }
    | IProduct

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    switch (req.method) {
        case 'GET': return getProduct(req, res)
        default: return res.status(404).json({ message: 'Method Not Found' })
    }

}

const getProduct = async (req: NextApiRequest, res: NextApiResponse<Data>) => {

    const { slug } = req.query;

    await db.connect();
    const product = await Product.findOne({ slug }).lean();
    await db.disconnect();

    if (!product) return res.status(404).json({ message: 'Not Found' })

    return res.status(200).json(product)

}