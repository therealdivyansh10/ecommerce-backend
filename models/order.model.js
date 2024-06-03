const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema(
  {
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          default: null,
        },
        quantity: {
          type: Number,
          required: true,
          default: 0,
        },
      },
    ],
    status: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'delivered'],
      default: 'pending',
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    shippingAddress: addressSchema,
    paymentMethod: String,
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed'],
      default: 'pending',
    },
  },
  { timestamps: true },
)

module.exports = mongoose.model('Order', orderSchema)
