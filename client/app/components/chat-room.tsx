'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRecoilValue } from 'recoil';
import { activeRoomState } from '@/app/state/activeRoom';
import { socketState } from '@/app/state/socket';

export function ChatRoom() {
  const [messages, setMessages] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const activeRoom = useRecoilValue(activeRoomState);
  const socket = useRecoilValue(socketState);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    socket.on('message', (message) => {
      console.log('on message', message);
      setMessages((messages) => [...messages, message]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    async function fetchMessagesByRoom() {
      const messages = await fetch(`https://upset-lamps-allow.loca.lt/messages/${activeRoom}`, { method: 'GET' })
        .then<string[]>((res) => res.json());
      setMessages(messages);
    }

    if (activeRoom) {
      void fetchMessagesByRoom();
    }
  }, [activeRoom]);

  const handleSendMessage = () => {
    socket.emit('message', activeRoom, message);
    setMessage('');
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-1 flex-col min-h-screen px-32 p-16">
      <div className="flex flex-row justify-between items-center">
        <h1>Chat Room</h1>
        {activeRoom && <h1>Active room: {activeRoom}</h1>}
      </div>
      {activeRoom ? (
        <>
          <div className="flex my-16">
            <ul>
              {messages.map((message, index) => (
                <li key={index}>{message}</li>
              ))}
            </ul>
          </div>
          <input className="border-2 border-black rounded" type="text" ref={inputRef} onKeyDown={handleKeyDown} value={message} onChange={(e) => setMessage(e.target.value)} />
          <button onClick={handleSendMessage} className="bg-blue-500 rounded p-2 min-w-[150px] mt-4">Send</button>
        </>
      ) : (
        <h2>No room selected</h2>
      )}
    </div>
  );
}
