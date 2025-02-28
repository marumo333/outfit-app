"use client"
import { useState, useEffect } from "react";
import React from "react";
import { supabase } from "@/utils/supabase/supabase";
import { signOut } from "../authSlice";
import { signIn } from "../authSlice";
import { useSelector, useDispatch } from "react-redux";
import { useCookies } from "react-cookie";

export default function MyPage() {

    const auth = useSelector((state: any) => state.auth.isSignIn);
    const dispatch = useDispatch()
    const [user, setUser] = useState("")//ログイン情報を保持するステート
    const [cookies] = useCookies()
    const [isClient, setIsClient] = useState(false)

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
        setIsClient(true);
    }, [])
    if (!isClient) {
        return (<h1>読み込み中</h1>)
    }
    return (
        <>
        {auth ? (
                <>
                  <h1 className="mb-4 pt-28 text-4xl">My Page</h1>
                </>
              ) : (
                <h1>ユーザー情報を取得してください</h1>
              )}
        </>
    )
}