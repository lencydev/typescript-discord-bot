import Context from '../interfaces/context'; let ctx: Context = new Context();

import mongoose from 'mongoose';

export default async () => {

  mongoose.connect(ctx.config.data.database);
};