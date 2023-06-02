import { atom } from 'recoil';

export const roomListState = atom<string[]>({
  key: 'RoomList',
  default: [],
});
