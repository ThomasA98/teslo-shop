import { db } from '@/database'
import { IProduct } from '@/interfaces'
import { Products } from '@/models'
import { isValidObjectId } from 'mongoose'
import type { NextApiRequest, NextApiResponse } from 'next'
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config(process.env.CLOUDINARY_URL || '');

type Data
    = { message: string }
    | IProduct[]
    | IProduct

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    switch (req.method) {
        case 'GET': return getProducts(req, res)
        case 'PUT': return updateProduct(req, res)
        case 'POST': return createProducts(req, res)
        default: return res.status(400).json({ message: 'Bad request' })
    }

}

const getProducts = async (req: NextApiRequest, res: NextApiResponse<Data>) => {

    await db.connect();
    const products = await Products.find().sort({ title: 'asc' }).lean();
    await db.disconnect();

    if (!products) res.status(400).json({ message: 'Bad request' });

    const updatedProducts = products.map(product => {
        product.images = product.images.map(image => {
            return image.includes('http') ? image : `${ process.env.HOST_NAME }products/${ image }`;
        })

        return product;
    })

    return res.status(200).json(updatedProducts);

}
const updateProduct = async (req: NextApiRequest, res: NextApiResponse<Data>) => {

    const { _id = '', images = [] } = req.body as IProduct;

    if (isValidObjectId(_id)) return res.status(400).json({ message: 'El id del producto no es valido' });

    if (images.length < 2) return res.status(400).json({ message: 'Es necesario al menos 2 imagenes' });

    try {
        await db.connect();
        const product = await Products.findById(_id);

        if(!product) {
            await db.disconnect();
            return res.status(404).json({ message: 'No existe un producto con ese Id' });
        }

        product.images.forEach(async (image) => {

            if (!images.includes(image)) {
                const [ fileId, fileExtension ] = image.substring(image.lastIndexOf('/') + 1).split('.');

                await cloudinary.uploader.destroy(fileId);
            }

        })

        await product.updateOne(req.body)

        await db.disconnect();

        return res.status(200).json(product);

    } catch (error) {
        await db.disconnect();
        console.log(error);
        return res.status(400).json({ message: 'Revisar el servidor' });
    }

}

const createProducts = async (req: NextApiRequest, res: NextApiResponse<Data>) => {

    const { images = [] } = req.body as IProduct;

    if (images.length < 2 ) return res.status(400).json({ message: 'El producto necesita al menos 2 imagenes' });

    try {
        await db.connect();

        const productInDb = await Products.findOne({ slug: req.body.slug });
        if (productInDb) {
            await db.disconnect();
            return res.status(400).json({ message: 'El slug del producto ya existe' });
        }

        const product = new Products(req.body);
        await product.save();

        await db.disconnect();

        return res.status(201).json(product);
    } catch (error) {
        await db.disconnect();
        console.log(error);
        return res.status(400).json({ message: 'Revisar logs del servidor' });
    }

}