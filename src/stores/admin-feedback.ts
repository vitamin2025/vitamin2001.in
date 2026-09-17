"use client";

type Toast = { id: number; message: string };

let nextId = 1;
let toasts: Toast[] = [];
const listeners = new Set<() => void>();
const EMPTY: Toast[] = [];

export function pushToast(message: string): void {
  const id = nextId++;
  toasts = [...toasts, { id, message }];
  listeners.forEach((listener) => listener());
  window.setTimeout(() => {
    toasts = toasts.filter((toast) => toast.id !== id);
    listeners.forEach((listener) => listener());
  }, 4000);
}

export function getToasts(): Toast[] {
  return toasts;
}

export function getServerToasts(): Toast[] {
  return EMPTY;
}

export function subscribeToasts(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
