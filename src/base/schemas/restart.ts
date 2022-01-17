import { model, Schema } from 'mongoose';

export default model('restart', 
  new Schema({
    status: { type: Boolean },
  }),
);