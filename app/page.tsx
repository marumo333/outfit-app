"use client"
import ImageApp from "@/components/imageApp";
import React from "react";
import {  useSelector } from "react-redux";
import {useState,useEffect} from "react";

export default function Index() {
  const auth = useSelector((state:any) => state.auth.isSignIn);
  const [isClient,setIsClient] = useState(false);

  useEffect(()=>{
    setIsClient(true);
  },[])
  if(!isClient){
    return<h1>読み込み中....</h1>
  }
  return (
    <>
    {auth?(
      <>
      <h1 className="mb-4 pt-28 text-4xl">機能性重視の服投稿アプリ</h1>
      <div className="flex-1 w-full flex flex-col items-center">
        <ImageApp />
      </div>
      </>
    ):(
      <h1>ユーザー情報を取得してください</h1>
    )}
      
      </>
  );
}
