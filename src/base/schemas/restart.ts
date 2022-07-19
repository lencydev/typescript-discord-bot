import { model as Model, Schema } from 'mongoose';

export default Model('restart',
  new Schema<RestartSchema>({
    status: { type: Boolean, required: true },
  }),
);