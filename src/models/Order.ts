import mongoose, { Schema, model, Model } from 'mongoose'
import { IOrder } from '@/interfaces';

const OrderSchema = new Schema<IOrder>({
    // name: { type: String, require: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', require: true },
    orderItems: [{
        _id: { type: Schema.Types.ObjectId, ref: 'Product', require: true },
        title: { type: String, require: true },
        size: { type: String, require: true },
        quantity: { type: Number, require: true },
        slug: { type: String, require: true },
        image: { type: String, require: true },
        price: { type: Number, require: true },
        gender: { type: String, require: true }
    }],
    shippingAddress: {
        firstName: { type: String, require: true },
        lastName: { type: String, require: true },
        address: { type: String, require: true },
        address2: { type: String },
        zip: { type: String, require: true },
        city: { type: String, require: true },
        country: { type: String, require: true },
        phone: { type: String, require: true }
    },
    paymentResult: { type: String, require: true },
    numberOfItems: { type: Number, require: true },
    subTotal: { type: Number, require: true },
    tax: { type: Number, require: true },
    total: { type: Number, require: true },
    isPaid: { type: Boolean, require: true },
    paidAt: { type: Number, require: true },
    transactionId: { type: String }
}, {
    timestamps: true
})

const Order: Model<IOrder> = mongoose.models.Order || model('Order', OrderSchema);

export default Order