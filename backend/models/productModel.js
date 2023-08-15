import mongoose from 'mongoose';

const movementSchema = mongoose.Schema(
  {
    description: { type: String, required: true },
    inOrOutCount: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    countInStock: {
      type: Number,
      required: true,
      default: 0,
    },
    movements: [movementSchema],
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model('Product', productSchema);

export default Product;
