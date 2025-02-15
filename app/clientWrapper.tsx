"use client"
import { Provider } from "react-redux";
import store from "./store";
import React from "react";
import { BrowserRouter } from "react-router-dom"

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>
    <BrowserRouter>
      {children}
    </BrowserRouter></Provider>; // ← `Provider` が使われていることを確認
}

