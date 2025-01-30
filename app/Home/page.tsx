"use client";

import { createClient } from "@supabase/supabase-js";
import  "../globals.css"
import { signOut } from "../authSlice";
import { useSelector,useDispatch } from "react-redux";
import {useEffect} from "react";
import "./env.local"

const projectUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const apikey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(projectUrl!, apikey!);



//onAuthChangeをuseEffectに挿入
export default function Home() {
  const auth = useSelector((state:any) => state.auth.isSignIn);
  const dispatch = useDispatch()

  useEffect(()=>{
    const{data:authListener} =supabase.auth.onAuthStateChange(
      (event,session)=>{
        console.log(event)
  if (session?.provider_token) {
    window.localStorage.setItem('oauth_provider_token', session.provider_token);
  }

  if (session?.provider_refresh_token) {
    window.localStorage.setItem('oauth_provider_refresh_token', session.provider_refresh_token)
  }

  if (event === 'SIGNED_OUT') {
    window.localStorage.removeItem('oauth_provider_token')
    window.localStorage.removeItem('oauth_provider_refresh_token')
      }
  }
);
//クリーンアップ処理追加（リスナー削除）
return () =>{
  authListener?.subscription.unsubscribe();
};
  },[]);

  const signInGitHub = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'github'
    })
  }
  
  const signOutGithub = async () => {
    const { error } = await supabase.auth.signOut()
    dispatch(signOut())
    if(error) throw new Error(error.message)
   
    
  }

  return (
  <div className="flex justify-center">
    <button onClick={signInGitHub} className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg">githubでログイン</button>
    
   {auth?(<button onClick={signOutGithub} className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg">githubでログアウト</button>):<></>}
    </div>
    
  );
}

