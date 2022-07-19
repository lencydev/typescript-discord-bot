import { Data } from '@config';

import mongoose from 'mongoose';

export default async function (): Promise<void> {

  await mongoose.connect(Data.Database);
};