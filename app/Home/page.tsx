"use client";

import  {supabase}  from "@/utils/supabase/supabase";
import  "../globals.css"
import { signOut } from "../authSlice";
import {signIn} from "../authSlice";
import { useSelector,useDispatch } from "react-redux";
import {useEffect,useState} from "react";
import { useCookies } from "react-cookie";
import React from "react";
import Icon from "./Icon";
import Google from "./google";
import {useNavigate} from "react-router-dom";

//onAuthChangeをuseEffectに挿入
export default function Home() {
  const auth = useSelector((state:any) => state.auth.isSignIn);
  const dispatch = useDispatch()
  const[user,setUser]= useState("")//ログイン情報を保持するステート
  const [cookies] = useCookies()
  const [avatarUrl, setAvatarUrl] = useState<string>(""); // URLを保存する状態
  const navigate = useNavigate();
  useEffect(()=>{
    const{data:authListener} =supabase.auth.onAuthStateChange(
      (event,session)=>{
        console.log(event)
  if (session?.user) {
    setUser(session.user.email||"GitHub User")
    navigate('/private')
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

  useEffect(() => {
    if (!user) return; // user が null の場合は何もしない
  
    const fetchAvatarUrl = async () => {
      const { data } = supabase.storage.from("avatars").getPublicUrl("github.jpg");
      setAvatarUrl(data.publicUrl || "");
    };
  
    fetchAvatarUrl();
  }, [user]);

  
  return (
  <div className="flex flex-col items-center justify-center space-y-4 min-h-screen bg-gray-100">
    <button onClick={signInGitHub} className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg">githubでログイン</button>
   {user?(
    <button 
    onClick={signOutGithub} 
    className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg">
      githubでログアウト
      </button>
      ) :(
        <div className="text-gray-500" color="blue"><p>ログイン情報を取得中:</p></div>
      )
    }
    {user?(
      <Icon url={avatarUrl}/>):(
        <div className="text-gray-500" color="green"><span>アイコンを取得してください</span></div>
    )}
    <Google/>
    </div>
  );
}

