"use client";

import { supabase } from "@/utils/supabase/supabase";
import "../globals.css"
import { signOut } from "../authSlice";
import { signIn } from "../authSlice";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import React from "react";
import Google from "./google";
import X from "./X";
import { useRouter } from "next/navigation";
import GuestLogin from "./guestLogin"


//onAuthChangeをuseEffectに挿入
export default function Home() {
  const auth = useSelector((state: any) => state.auth.isSignIn);
  const dispatch = useDispatch()
  const [user, setUser] = useState("")//ログイン情報を保持するステート
  const [cookies] = useCookies()
  const [avatarUrl, setAvatarUrl] = useState<string>(""); // URLを保存する状態
  const router = useRouter();
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log(event)
        if (session?.user) {
          setUser(session.user.email || "GitHub User")
          dispatch(signIn({
            name: session.user.email,
            iconUrl: "",
            token: session.provider_token
          }))
          window.localStorage.setItem('oauth_provider_token', session.provider_token || "");
          window.localStorage.setItem('oauth_provider_refresh_token', session.provider_refresh_token || "")
        }

        if (event === 'SIGNED_OUT') {
          window.localStorage.removeItem('oauth_provider_token')
          window.localStorage.removeItem('oauth_provider_refresh_token')
          setUser("")//user情報をリセット
          dispatch(signOut());
        }
      }
    );
    //クリーンアップ処理追加（リスナー削除）
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      router.push("/private")
    }
  }, [user, router])

  


  return (
    <div className="flex flex-col items-center justify-center space-y-4 min-h-screen bg-gray-100">
      <GuestLogin />
      <Google />
      <X/>
    </div>
  );
}

