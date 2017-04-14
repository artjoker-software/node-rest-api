import mongoose, { Schema } from 'mongoose';
import { id, defaultSchemaOptions } from '../../../database';
import Review from './Review'; // eslint-disable-line no-unused-vars

const ProductSchema = new Schema({
  id,
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    default: 0,
    required: true
  },
  rating: {
    type: Number,
    default: 0,
    required: true
  }
}, defaultSchemaOptions);

ProductSchema.virtual('reviews', {
  ref: 'Review',
  localField: 'id',
  foreignField: 'product_id'
});

const Product = mongoose.model('Product', ProductSchema);

export default Product;
