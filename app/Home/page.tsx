"use client";

import { createClient } from "@supabase/supabase-js";
import  "../globals.css"
import { signOut } from "../authSlice";
import {signIn} from "../authSlice";
import { useSelector,useDispatch } from "react-redux";
import {useEffect,useState} from "react";
import { useCookies } from "react-cookie";
import React from "react";

const projectUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const apikey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(projectUrl!, apikey!);



//onAuthChangeをuseEffectに挿入
export default function Home() {
  const auth = useSelector((state:any) => state.auth.isSignIn);
  const dispatch = useDispatch()
  const[user,setUser]= useState("")//ログイン情報を保持するステート
  const [cookies] = useCookies()

  useEffect(()=>{
    const{data:authListener} =supabase.auth.onAuthStateChange(
      (event,session)=>{
        console.log(event)
  if (session?.user) {
    setUser(session.user.email||"GitHub User")
    dispatch(signIn({
      name: session.user.email, 
    iconUrl: "", 
    token: session.provider_token 
    }))
    window.localStorage.setItem('oauth_provider_token', session.provider_token||"");
    window.localStorage.setItem('oauth_provider_refresh_token', session.provider_refresh_token||"")
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
return () =>{
  authListener?.subscription.unsubscribe();
};
  },[dispatch]);

  const signInGitHub = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github'
    })
    if(error) throw new Error(error.message)
  }

  const signOutGithub = async () => {
   try{ 
    const { error } = await supabase.auth.signOut()
    if(error) throw new Error(error.message)
      dispatch(signOut());}
    catch(error:any){
      console.error("ログアウトエラー発生",error.message)
    }
  }

  return (
  <div className="flex justify-center">
    <button onClick={signInGitHub} className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg">githubでログイン</button>
    
   {user?(
    <button 
    onClick={signOutGithub} 
    className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg">
      githubでログアウト
      </button>
      ) :(
        <div className="text-gray-500">ログイン情報を取得中</div>
      )
    }
    </div>
  );
}

