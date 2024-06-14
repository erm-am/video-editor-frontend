import { create } from 'zustand';

enum Status {
  open = 'open',
  closed = 'closed',
  error = 'error',
}

type WebSocketState = {
  status: Status;
};

type WebSocketStateActions = {
  open: () => void;
  closed: () => void;
  error: () => void;
};

export const webSocketStore = create<WebSocketState & WebSocketStateActions>((set) => ({
  status: Status.closed,
  open: () => set({ status: Status.open }),
  closed: () => set({ status: Status.closed }),
  error: () => set({ status: Status.error }),
}));
