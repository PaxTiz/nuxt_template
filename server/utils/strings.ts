import { randomBytes } from 'node:crypto';

export const randomString = (length = 16) => {
  return randomBytes(length / 2).toString('hex');
};
