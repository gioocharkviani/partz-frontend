'use client';

import { useEffect } from 'react';
import { io, Socket } from 'socket.io-client';

const ORIGIN = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api').replace(/\/api\/?$/, '');

let socket: Socket | null = null;

function currentToken() {
  if (typeof window === 'undefined') return undefined;
  return localStorage.getItem('partz_token') || undefined;
}

/** Singleton connection — anonymous visitors connect too (for the public activity feed), just without a personal room. */
export function getSocket(): Socket {
  if (!socket) {
    socket = io(ORIGIN, { auth: { token: currentToken() } });
  }
  return socket;
}

/** Call right after login/logout so the socket re-handshakes under the current auth token. */
export function refreshSocketAuth(): Socket {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
  return getSocket();
}

/** Subscribe to a socket event for the lifetime of the component. */
export function useSocketEvent<T = any>(event: string, handler: (data: T) => void) {
  useEffect(() => {
    const s = getSocket();
    s.on(event, handler);
    return () => {
      s.off(event, handler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event, handler]);
}
