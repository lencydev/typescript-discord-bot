import Client from '../client';

import fixError from '../utils/error';

export default async (client: Client) => {

  await fixError(client);
};