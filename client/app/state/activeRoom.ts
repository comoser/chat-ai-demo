import { atom } from 'recoil';

export const activeRoomState = atom<string>({
  key: 'ActiveRoom',
  default: undefined,
});
