import { model, Schema } from 'mongoose';

export default model('blacklist', 
  new Schema({
    user: { type: String },
    reason: { type: String },
    date: { type: Date },
  }),
);