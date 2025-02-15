"use client"
import ImageApp from "@/components/imageApp";
import React from "react";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";

export default function Private() {
  const auth = useSelector((state: any) => state.auth?.isSignIn ?? false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, [])
  if (!isClient) {
    return <h1>読み込み中....</h1>
  }
  return (
    <>
      {auth ? (
        <>
          <h1 className="mb-4 pt-28 text-4xl">オシャレ服投稿アプリ</h1>
          <p className="mb-4">
            *表示された画像は5分でリンクが不可になります。<br />
            再度アクサスした場合はリロードボタンを押してください。
          </p>
          <div className="flex-1 w-full flex flex-col items-center">
            <ImageApp />
          </div>
        </>
      ) : (
        <h1>ユーザー情報を取得してください</h1>
      )}

    </>
  )
}
