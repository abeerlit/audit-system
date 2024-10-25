"use client"
import { AppStore, makeStore } from '@/store/store';
import { Provider } from 'react-redux';
import React, { useRef } from 'react'
import { Toaster } from "react-hot-toast";

const RootLayoutProvider = ({children}: {children: React.ReactNode}) => {
  const storeRef = useRef<AppStore | undefined>(undefined);

  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  return (
    <Provider store={storeRef.current}>
      {children}
      <Toaster />
    </Provider>
  )
}

export default RootLayoutProvider;