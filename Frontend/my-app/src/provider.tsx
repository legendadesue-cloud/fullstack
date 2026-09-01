"use client";

import { Provider } from "react-redux";
import { store } from "@/src/store/store";
import type { ReactNode } from "react";

interface StoreProviderProps {
  children: ReactNode;
}

export default function StoreProvider({
  children,
}: StoreProviderProps) {
  return (
    <Provider store={store}>
      {children}
    </Provider>
  );
}