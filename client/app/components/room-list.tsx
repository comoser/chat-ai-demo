'use client';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { roomListState } from '@/app/state/roomList';
import { activeRoomState } from '@/app/state/activeRoom';
import { socketState } from '@/app/state/socket';
import { useEffect } from 'react';

export function RoomList() {
  const roomList = useRecoilValue(roomListState);
  const socket = useRecoilValue(socketState);
  const setRoomList = useSetRecoilState(roomListState);
  const setActiveRoom = useSetRecoilState(activeRoomState);

  useEffect(() => {
    async function fetchRooms() {
      const rooms = await fetch('https://upset-lamps-allow.loca.lt/rooms', { method: 'GET' })
        .then<string[]>((res) => res.json());
      console.log('on roomList', rooms);
      setRoomList(rooms);
    }
    void fetchRooms();
  }, []);

  const onCreateRoom = () => {
    const roomName = window.prompt('Enter the room name:');
    if (!roomName) {
      console.error('No room name provided');
      return;
    }
    setRoomList([...roomList, roomName]);
    void fetch('https://upset-lamps-allow.loca.lt/rooms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ room: roomName }),
    });
  }

  const onSetActiveRoom = (room: string) => {
    setActiveRoom(room);
    socket.emit('join', room);
  }

  return (
    <aside className="flex flex-col min-w-[300px] bg-gray-100 p-16">
      <button className="bg-blue-500 rounded p-2 mb-16" onClick={onCreateRoom}>Create room</button>
      {roomList.map((room) => (
        <button key={room} className="bg-transparent p-2" onClick={() => onSetActiveRoom(room)}>{room}</button>
      ))}
    </aside>
  );
}
