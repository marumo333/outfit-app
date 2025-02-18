"use client"
import React,{useEffect,useState} from "react";
import { supabase } from "@/utils/supabase/supabase";
import "../globals.css"
import { signOut } from "../authSlice";
import { signIn } from "../authSlice";
import { useSelector, useDispatch } from "react-redux";
import { useCookies } from "react-cookie";
import Icon from "./Icon";
import { useRouter } from "next/navigation";

export default function X(){
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
              setUser(session.user.email || "Google User")
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
    return(
        <>
        </>
    )
}