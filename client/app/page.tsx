'use client';

import { RecoilRoot } from 'recoil';
import { RoomList } from '@/app/components/room-list';
import { ChatRoom } from '@/app/components/chat-room';

export default function Home() {
  return (
    <main className="flex flex-row">
      <RecoilRoot>
        <RoomList />
        <ChatRoom />
      </RecoilRoot>
    </main>
  )
}
