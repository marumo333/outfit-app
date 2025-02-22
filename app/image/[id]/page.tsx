"use client";

import React, { useEffect, useState, use } from "react";
import { supabase } from "@/utils/supabase/supabase";
import CommentSection from "./commentSectiont"


interface ImageItem {
  id: string; // 画像ID
  name: string; // 画像名
  url: string; // 画像のURL
  title: string;
  content: string;
}

export default function Image({ params }: { params:Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [imageDetail, setImageDetail] = useState<ImageItem | null>(null);
  const [loading, setLoading] = useState(false);


  const fetchImage = async (imageUrl: string) => {
    setLoading(true);
    const { data, error } = await supabase
      .from("outfit_image")
      .select("id,name,image_url,title,content")
      .eq("id",imageUrl)
      .single();

    if (error || !data) {
      console.error("画像取得エラー:", error.message);
      setLoading(false);
      return;
    }
      setImageDetail({
        id: data.id,
      name: data.name,
      url: data.image_url, // DB に保存されている URL を直接使用
      title: data.title || "タイトルなし",
      content: data.content || "説明なし",
      })
    setLoading(false);
  };


  const handleDelete = async () => {
    if (!imageDetail) return;
    try {
      const filePath = imageDetail.url.replace(
        `https://tkkavdiinrmmeeghllrr.supabase.co/storage/v1/object/public/outfit_image/`,
        ""
      );
      const { error:deleteError } = await supabase.storage
        .from("outfit_image")
        .remove([filePath])

      if (deleteError) throw new Error(`削除エラー${deleteError.message}`)

        const {error:dbError} =await supabase
        .from("outfit_image")
        .delete()
        .eq("id",imageDetail.id);

        if (dbError) throw new Error(`データベース削除エラー:${dbError.message}`)
          
      alert("画像を削除しました")
      setImageDetail(null);
    } catch (error: any) {
      alert(error.message);
    }
  }

  useEffect(() => {
      if (resolvedParams.id) {
        fetchImage(resolvedParams.id);
      }
  }, [resolvedParams.id])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  if (!imageDetail) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="text-gray-500">画像が見つかりません。</span>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl  mb-4">画像名:{imageDetail.name}</h1>
      <div className="mb-4">
        <img
          src={imageDetail.url}
          alt={imageDetail.name}
          className="object-contain max-w-full max-h-[400px] rounded-lg shadow-md"
        />
      </div>
      <div className="flex justify-center">
        <a
          href={imageDetail.url}
          download={imageDetail.name}
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg"
        >
          ダウンロード
        </a>
        <div className="flex justify-center">
          <button onClick={handleDelete}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg"
          >投稿の削除</button>
        </div>
      </div>
      <CommentSection />
    </div>

  );
}


