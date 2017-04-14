import mongoose, { Schema } from 'mongoose';
import { id, defaultSchemaOptions } from '../../../database';

const ReviewSchema = new Schema({
  id,
  message: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true
  },
  product_id: String
}, defaultSchemaOptions);

const Review = mongoose.model('Review', ReviewSchema);

export default Review;
