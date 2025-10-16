import mongoose from 'mongoose';

// 1. Criar um schema para as avaliações
const reviewSchema = mongoose.Schema({
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
      },
}, {
    timestamps: true
})

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
    // 2. Adicionar os novos campos ao schema do produto
    reviews: [reviewSchema],
    rating: {
        type: Number,
        required: true,
        default: 0
    },
    numReviews: {
        type: Number,
        required: true,
        default: 0
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