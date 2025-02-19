"use client";

import { supabase } from "@/utils/supabase/supabase";
import { useEffect, useState } from "react";
import { v4 as uuid4 } from "uuid";
import Link from "next/link"
import { useDispatch } from "react-redux";
import React from "react";
import { useSelector } from "react-redux";

interface ImageItem {
  name: string,//画像名
  url: string,//画像のURL
}

export default function ImageApp() {
  const [urlList, setUrlList] = useState<ImageItem[]>([]);
  const [loadingState, setLoadingState] = useState("hidden");
  const [file, setFile] = useState<File | undefined>();
  const auth = useSelector((state: any) => state.auth.isSignIn);
  const [isClient, setIsClient] = useState(false);
  const dispatch = useDispatch();

  const listAllImage = async () => {
    setLoadingState("flex justify-center");
    const tempUrlList: ImageItem[] = [];

    const { data, error } = await supabase.storage
      .from("outfit_image")
      .list("img", {
        limit: 100,
        offset: 0,
        sortBy: { column: "created_at", order: "desc" },
      });

    if (error) {
      console.error(error);
      setLoadingState("hidden");
      return;
    }

    const fileList = data || [];

    for (const file of fileList) {
      if (file.name !== ".emptyFolderPlaceholder") {
        const filePath = `img/${file.name}`;
        const { data: signedData, error: signedError } = await supabase.storage
          .from("outfit_image")
          .createSignedUrl(filePath, 300);

        if (signedError) {
          console.error(signedError);
          continue;
        }

        if (signedData?.signedUrl) {
          tempUrlList.push({ name: file.name, url: signedData.signedUrl });
        }
      }
    }

    setUrlList(tempUrlList);
    setLoadingState("hidden");
  };

  // Handle file change
  const handleChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  // Handle form submission
  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (file && file.type.match("image.*")) {
      const fileExtension = file.name.split(".").pop();
      const { error } = await supabase.storage
        .from("outfit_image")
        .upload(`img/${uuid4()}.${fileExtension}`, file);

      if (error) {
        alert("エラーが発生しました: " + error.message);
        return;
      }

      setFile(undefined);
      await listAllImage();
    } else {
      alert("画像ファイル以外はアップロードできません。");
    }
  };

  // Fetch image list on component mount
  useEffect(() => {
    (async () => {
      await listAllImage();
    })();
  }, []);
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
          <form className="mb-4 text-center" onSubmit={onSubmit}>
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
          <p>
            アカウントでログインしてください
          </p>
        </div>
      )}


      <div className={loadingState} aria-label="読み込み中">
        <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent"></div>
      </div>

      <ul className="flex flex-wrap w-full">
        {urlList.map((item) => (
          <li className="w-1/4 h-auto p-1" key={item.name}>
            <a className="hover:opacity-50" href={item.url} target="_blank" rel="noopener noreferrer">
              < img className="object-cover max-h-32 w-full" src={item.url} alt="item.name" />
            </a>
            <Link href={`/image/${encodeURIComponent(item.name)}`}>
              <span className="text-blue-500 underline hover:opacity-50">詳細を表示</span>
            </Link>

          </li>
        ))}
      </ul>
    </>
  );
}
