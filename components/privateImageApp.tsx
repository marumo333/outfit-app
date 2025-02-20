"use client"
import { supabase } from "@/utils/supabase/supabase"
import { useEffect, useState } from "react"
import { v4 as uuidv4 } from 'uuid'

export default function PrivateImageApp() {
  const [urlList, setUrlList] = useState<string[]>([])
  const [loadingState, setLoadingState] = useState("hidden")
  const [file, setFile] = useState<File | null>(null);

  const listAllImage = async () => {
    setLoadingState("flex justify-center")

    const {data:userData,error:userError} = await supabase.auth.getUser();
    if(userError|| userData?.user){
      console.log("ユーザー情報を取得できません",userError);
      return;
    }
    const { data, error } = await supabase
      .from('outfit_image')
      .select("image_url")
      .eq("user_id",userData.user.id)
      .order("created_at",{ascending:false});

    if (error) {
      console.log(error)
      return
    }
    setUrlList(data.map(item=> item.image_url));
    setLoadingState("hidden");
  }

  useEffect(() => {
    listAllImage();
  }, [])

const handleFileChange=(event:React.ChangeEvent<HTMLInputElement>)=>{
  if (event.target.files && event.target.files.length > 0) {
    setFile(event.target.files[0]);
  }
}

  const handleSubmit = async (event:React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!file|| !file.type.match("image.*")) {
      alert("画像ファイル以外はアップロード出来ません。")
      return;
    }
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData?.user) {
      alert("ユーザー情報を取得できませんでした。");
      return;
    }

    const userId = userData.user.id;
    const fileExtension = file.name.split(".").pop();
    const filePath = `img/${uuidv4()}.${fileExtension}`;

    // Supabase Storage に画像をアップロード
    const { error: uploadError } = await supabase.storage
      .from('outfit_image')
      .upload(filePath, file);

    if (uploadError) {
      alert("アップロードに失敗しました：" + uploadError.message);
      return;
    }

    // Storage からサイン付きURLを作成
    const { data: signedUrlData, error: signedUrlError } = await supabase.storage
      .from("outfit_image")
      .createSignedUrl(filePath, 300);

    if (signedUrlError) {
      console.log("Signed URL 取得エラー:", signedUrlError);
      return;
    }

    // Supabase の `outfit_image` テーブルに URL を保存
    const { error: insertError } = await supabase
      .from("outfit_image")
      .insert([{ user_id: userId, image_url: signedUrlData.signedUrl }]);

    if (insertError) {
      console.log("DB 挿入エラー:", insertError);
      return;
    }

    // 画像リストを更新
    await listAllImage();
    setFile(null);
  };

  return (
    <>
      <form className="mb-4 text-center" onSubmit={handleSubmit}>
        <input
          className="relative mb-4 block w-full min-w-0 flex-auto rounded border border-solid border-neutral-300 bg-clip-padding px-3 py-[0.32rem] text-base font-normal text-neutral-700 transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 file:px-3 file:py-[0.32rem] file:text-neutral-700 file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:file:bg-neutral-200 focus:border-primary focus:text-neutral-700 focus:shadow-te-primary focus:outline-none"
          type="file"
          id="formFile"
          accept="image/*"
          onChange={handleFileChange}
        />
        <button type="submit" 
        disabled={!file} 
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center disabled:opacity-25">
          送信
        </button>
      </form>
      <div className="w-full max-w-3xl">
        <button onClick={listAllImage} 
        className="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 ">リロード</button>
        <div className={loadingState} aria-label="読み込み中">
          <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent"></div>
        </div>
        <ul className="flex flex-wrap w-full">
          {urlList.map((item, index) => (
            <li className="w-1/4 h-auto p-1" key={index}>
              <a className="hover:opacity-50" href={item} target="_blank">
                <img className="object-cover max-h-32 w-full" src={item} alt="uploading file" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </>

  )

}    