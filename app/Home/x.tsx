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
      const signInX = async () => {
          const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
              redirectTo: `http://localhost:3000/redirect`,
            },
          })
          router.push("/private")
          if (error) throw new Error(error.message)
        }
      
        const signOutX = async () => {
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
          if (!user) return; // user が null の場合は何もしない
      
          const fetchAvatarUrl = async () => {
            const { data } = supabase.storage.from("avatars").getPublicUrl("x.jpg");
            setAvatarUrl(data.publicUrl || "");
          };
      
          fetchAvatarUrl();
        }, [user]);
    return(
        <>
        <div className="flex flex-col items-center justify-center space-y-4 min-h-screen bg-gray-100">
      <button onClick={signInX} className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg">Xでログイン</button>
      {user ? (
        <button
          onClick={signOutX}
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg">
          Xでログアウト
        </button>
      ) : (
        <div className="text-gray-500" color="blue"><p>ログイン情報を取得中:</p></div>
      )
      }
      {user ? (
        <Icon url={avatarUrl} />) : (
        <div className="text-gray-500" color="green"><span>アイコンを取得してください</span></div>
      )}
    </div>
        </>
    )
}