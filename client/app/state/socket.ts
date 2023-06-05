import io, { Socket } from 'socket.io-client';
import { atom } from 'recoil';

import getConfig from 'next/config';

// @ts-ignore
const socket = io(process.env.NEXT_PUBLIC_SERVER_TUNNEL_URL);

export const socketState = atom<Socket>({
  key: 'Socket',
  default: socket,
  dangerouslyAllowMutability: true,
});
