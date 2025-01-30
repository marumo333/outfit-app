"use client"
import { createSlice } from "@reduxjs/toolkit";
import { Cookies } from "react-cookie";

const cookie = new Cookies();

const initialState = {
  isSignIn: cookie.get("token") !== undefined,
  name: '',
  iconUrl: ''
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    signIn: (state, action) => {
      state.isSignIn = true;
      state.name = action.payload.name;
      state.iconUrl = action.payload.iconUrl;
      cookie.set("token", action.payload.token, { path: '/' }); // トークンを保存
    },
    signOut: (state) => {
      state.isSignIn = false;
      state.name = '';
      state.iconUrl = '';
      cookie.remove("token", { path: '/' }); // トークンを削除
    },
  }
});

export const { signIn, signOut } = authSlice.actions;
export const selectAuth = (state) => state.auth; // セレクタを追加
export const selectIsSignIn = (state) => state.auth.isSignIn;
export const selectUserName = (state) => state.auth.name;
export const selectUserIconUrl = (state) => state.auth.iconUrl;

export default authSlice.reducer; // reducer をエクスポート