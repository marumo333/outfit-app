"use client";

import React, { useEffect, useState, use } from "react";
import { supabase } from "@/utils/supabase/supabase";
import CommentSection from "./commentSectiont"


interface ImageItem {
  name: string; // 画像名
  url: string;  // 画像の URL
}


export default function Image({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [imageDetail, setImageDetail] = useState<ImageItem | null>(null);
  const [loading, setLoading] = useState(false);


  const fetchImage = async (imageName: string) => {
    setLoading(true);
    const filePath = `img/${imageName}`;
    console.log("ファイルパス:", filePath);

    const { data: signedData, error } = await supabase.storage
      .from("outfit_image")
      .createSignedUrl(filePath, 300);



    if (error) {
      console.error("画像取得エラー:", error.message);
      setLoading(false);
      return;
    }

    if (signedData?.signedUrl) {
      setImageDetail({ name: imageName, url: signedData.signedUrl });
    } else {
      setImageDetail(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (resolvedParams.id) {
      fetchImage(resolvedParams.id);
    }
  }, [resolvedParams.id]);

  const handleDelete = async (imageName: string) => {
    try {
      const filePath = `img/${imageName}`;
      const { error } = await supabase.storage
        .from("outfit_image")
        .remove([filePath])

      if (error) throw new Error(`削除エラー${error.message}`)

      alert("画像を削除しました")
      setImageDetail(null);
    } catch (error: any) {
      alert(error.message);
    }
  }

  useEffect(() => {
    (async () => {
      const resolvedParams = await params;
      if (resolvedParams.id) {
        fetchImage(resolvedParams.id)
      }
    })();
  }, [params])

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
      <h1 className="text-2xl  mb-4">画像のURL:{imageDetail.name}</h1>
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
          <button onClick={() => handleDelete(resolvedParams.id)}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg"
          >投稿の削除</button>
        </div>
      </div>
      <CommentSection />
    </div>

  );
}
