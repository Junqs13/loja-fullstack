import mongoose from 'mongoose';

const productSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    name: {
      pt: { type: String, required: true },
      en: { type: String, required: true },
    },
    image: {
      type: String,
      required: true,
    },
    brand: {
      pt: { type: String, required: true },
      en: { type: String, required: true },
    },
    category: {
      pt: { type: String, required: true },
      en: { type: String, required: true },
    },
    description: {
      pt: { type: String, required: true },
      en: { type: String, required: true },
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    countInStock: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model('Product', productSchema);

export default Product;