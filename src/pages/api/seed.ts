import { db, seedDatabase } from '@/database';
import { Order, User } from '@/models';
import Product from '@/models/Products';
import type { NextApiRequest, NextApiResponse } from 'next'

interface Data {
    message: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    if (process.env.NODE_ENV === 'production')
        return res
            .status(404)
            .json({ message: 'Not found' });

    try {
        await db.connect();
        await Product.deleteMany();
        await Product.insertMany(seedDatabase.initialData.products);
        await User.deleteMany();
        await User.insertMany(seedDatabase.initialData.users);
        await Order.deleteMany();
        await db.disconnect();
    } catch (error) {
        await db.disconnect();
        console.log(error);
        return res
            .status(400)
            .json({ message: 'Bad request' });
    }


    return res
        .status(200)
        .json({ message: 'seed ok' });
}