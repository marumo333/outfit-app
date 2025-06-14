"use client";

import { supabase } from "@/utils/supabase/supabase";
import "../globals.css"
import { signIn } from "../authSlice";
import { signOut } from "../authSlice";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import React from "react";
import Icon from "./Icon";
import { useRouter } from "next/navigation";

//onAuthChangeをuseEffectに挿入
export default function Google() {
  const auth = useSelector((state: any) => state.auth.isSignIn);
  const dispatch = useDispatch()
  const [user, setUser] = useState("")//ログイン情報を保持するステート
  const [cookies] = useCookies()
  const [avatarUrl, setAvatarUrl] = useState<string>(""); // URLを保存する状態
  const router = useRouter();
  

  const signInGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: "https://outfitapp-delta.vercel.app/redirect" },
    })
    if (error) throw new Error(error.message)
  }

  const signOutGoogle = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw new Error(error.message)
      dispatch(signOut());
    }
    catch (error: any) {
      console.error("ログアウトエラー発生", error.message)
    }
  }

  useEffect(() => {
    

    const fetchAvatarUrl = async () => {
      const { data } = supabase.storage.from("avatars").getPublicUrl("google.jpg");
      setAvatarUrl(data.publicUrl || "");
    };

    fetchAvatarUrl();
  }, []);
  return (
    <div className="flex flex-col items-center justify-center space-y-4 min-h-screen bg-gray-100">
      <button onClick={signInGoogle} className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg">googleでログイン</button>
      {user ? (
        <button
          onClick={signOutGoogle}
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg">
          googleでログアウト
        </button>
      ) : (
        <div className="text-gray-500" color="blue"><p>ログイン情報を取得中:</p></div>
      )
      }
        <Icon url={avatarUrl} />
        <div className="text-gray-500" color="green"><span>ログインしてください</span></div>
    </div>
  )
}