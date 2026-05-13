// src/hooks/useToast.ts
"use client";
import * as React from "react";
import type { ToastProps } from "@/components/ui/toast";

const TOAST_LIMIT = 3;
const TOAST_REMOVE_DELAY = 4000;

type ToasterToast = ToastProps & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
};

let count = 0;

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}

type State = {
  toasts: ToasterToast[];
};

const listeners: Array<(state: State) => void> = [];
let memoryState: State = { toasts: [] };

function dispatch(toasts: ToasterToast[]) {
  memoryState = { toasts };
  listeners.forEach((listener) => listener(memoryState));
}

function toast({
  title,
  description,
  variant = "default",
  ...props
}: Omit<ToasterToast, "id">) {
  const id = genId();
  const newToast: ToasterToast = { id, title, description, variant, ...props };

  const next = [newToast, ...memoryState.toasts].slice(0, TOAST_LIMIT);
  dispatch(next);

  setTimeout(() => {
    dispatch(memoryState.toasts.filter((t) => t.id !== id));
  }, TOAST_REMOVE_DELAY);

  return id;
}

function useToast() {
  const [state, setState] = React.useState<State>(memoryState);

  React.useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) listeners.splice(index, 1);
    };
  }, []);

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => {
      dispatch(
        toastId
          ? memoryState.toasts.filter((t) => t.id !== toastId)
          : []
      );
    },
  };
}

export { useToast, toast };
