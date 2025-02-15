"use client"
import ImageApp from "@/components/imageApp";
import React from "react";
export default function Index() {

  return (
    <>

      <>
        <h1 className="mb-4 pt-28 text-4xl">服投稿アプリ</h1>
        <div className="flex-1 w-full flex flex-col items-center">
          <ImageApp />
        </div>
      </>

    </>
  );
}
