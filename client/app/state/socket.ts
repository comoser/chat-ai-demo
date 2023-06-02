import io, { Socket } from 'socket.io-client';
import { atom } from 'recoil';

const socket = io('https://evil-trams-shake.loca.lt');
// const socket = io('http://localhost:3001');

export const socketState = atom<Socket>({
  key: 'Socket',
  default: socket,
  dangerouslyAllowMutability: true,
});
