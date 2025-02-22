"use client";

import { supabase } from "@/utils/supabase/supabase";
import { ChangeEvent, useEffect, useState } from "react";
import { v4 as uuid4 } from "uuid";
import Link from "next/link";
import { useSelector } from "react-redux";

interface ImageItem {
  id: string;
  name: string;
  url: string;
  title: string;
  content: string;
}

export default function ImageApp() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [title, setTitle] = useState<string>("")
  const [content, setContent] = useState<string>("");
  const [loadingState, setLoadingState] = useState("hidden");
  const [file, setFile] = useState<File | null>(null);
  const auth = useSelector((state: any) => state.auth.isSignIn);
  const [isClient, setIsClient] = useState(false);

  const listAllImage = async () => {
    setLoadingState("flex justify-center");

    const { data, error } = await supabase
      .from("outfit_image")
      .select("id, name, image_url, title, content");

    if (error) {
      console.error("画像取得エラー:", error);
      setLoadingState("hidden");
      return;
    }

    // image_url を url にマッピング
    const formattedData: ImageItem[] = (data || []).map((item: any) => ({
      id: item.id,
      name: item.name,
      url: item.image_url, // ここで image_url を url にマッピング
      title: item.title,
      content: item.content,
    }));

    setImages(formattedData);
    setLoadingState("hidden");
  };

  // 画像ファイル選択時の処理
  const handleChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  // 画像アップロード処理
  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!file || !file.type.match("image.*")) {
      alert("画像ファイル以外はアップロードできません。");
      return;
    }

    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData?.user) {
      alert("ユーザー情報を取得できませんでした。");
      return;
    }

    const userId = userData.user.id;
    const fileName = `${uuid4()}.${file.name.split(".").pop()}`;
    const filePath = `img/${fileName}`;

    // 1. Supabase Storage に画像をアップロード
    const { error: uploadError } = await supabase.storage
      .from("outfit_image")
      .upload(filePath, file);

    if (uploadError) {
      alert("アップロードに失敗しました：" + uploadError.message);
      return;
    }

    // 2. 公開URLを取得
    const { data: publicUrlData } = supabase.storage
      .from("outfit_image")
      .getPublicUrl(filePath);

    const publicUrl = publicUrlData.publicUrl;

    // 3. Supabase の outfit_image テーブルにデータを保存
    const { error: insertError } = await supabase
      .from("outfit_image")
      .insert([
        {
          user_id: userId,
          name: fileName,
          image_url: publicUrl, // image_url に保存
          title: "",
          content: "",
        },
      ]);

    if (insertError) {
      console.error("DB 挿入エラー:", insertError);
      return;
    }

    setFile(null);
    await listAllImage();
  };

  useEffect(() => {
    listAllImage();
  }, []);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <h1>読み込み中....</h1>;
  }

  function handleTitleChange(event: ChangeEvent<HTMLInputElement>): void {
    setTitle(event.target.value)
  }

  const handleContentChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setContent(event.target.value)
  }
  return (
    <>
      {auth ? (
        <>
          <form className="mb-4 text-center" onSubmit={onSubmit}>
            <input
              type="text"
              id="formTitle"
              onChange={handleTitleChange}
              value={title} 
              placeholder="タイトルを入力"
              className="mb-2 border rounded p-2 w-full"
            />
            <input
              type="text"
              id="formContent"
              onChange={handleContentChange}
              value={content} 
              placeholder="コンテンツを入力"
              className="mb-2 border rounded p-2 w-full"
            />
            <input
              className="relative mb-4 block w-full rounded border border-neutral-300 px-3 py-2 text-base file:border-none file:bg-neutral-100 file:mr-2 file:py-1 file:px-3 hover:file:bg-neutral-200"
              type="file"
              id="formFile"
              accept="image/*"
              onChange={handleChangeFile}
            />
            <button
              type="submit"
              disabled={!file}
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 disabled:opacity-50"
            >
              送信
            </button>
          </form>

        </>
      ) : (
        <div>
          <p>アカウントでログインしてください</p>
        </div>
      )}

      <div className={loadingState} aria-label="読み込み中">
        <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent"></div>
      </div>

      <ul className="flex flex-wrap w-full">
        {images.map((item) => (
          <li className="w-1/4 h-auto p-1" key={item.id}>
            <a className="hover:opacity-50" href={item.url} target="_blank" rel="noopener noreferrer">
              <img className="object-cover max-h-32 w-full" src={item.url} alt={item.name} />
            </a>
            <Link href={`/image/${encodeURIComponent(item.id)}`}>
              <span className="text-blue-500 underline hover:opacity-50">詳細を表示</span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
