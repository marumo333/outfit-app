"use client"
import React, {  useEffect, useState } from 'react'
import {useRouter} from"next/router"
import { supabase } from '@/utils/supabase/supabase'

interface ImageItem{
    name:string,//画像名
    url:string,//画像のURL
  }

export default function ImageDetail(){
    const [imageDetail,setImageDetail] =useState<ImageItem|null>(null);
    const [loading,setLoading] = useState(false);
    const router = useRouter()
    const {id} = router.query//画像名（URLパラメータ） 

  const fetchImageDetail = async (imageName: string) =>{
    setLoading(true);
    const filePath = `img/${imageName}`;
    const{data:signedData,error} = await supabase.storage
    .from('outfit-image')
    .createSignedUrl(filePath,300);

    if(error){
      console.error("画像取得エラー:",error.message);
      setLoading(false);
      return;
    }
    if(signedData?.signedUrl){
      setImageDetail({name:imageName,url:signedData.signedUrl});
}else{
  setImageDetail(null);
}
setLoading(false);
  };
  //urlバラメータの変更時にデータ取得
  useEffect(()=>{
    if(id){
      fetchImageDetail(id as string);
    }
  },[id]);

  if(loading){
    return(
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent"></div>
      </div>
    )
  }
  if(!imageDetail){
    return(
      <div className="flex justify-center items-center h-screen">
        <span className="text-gray-500">image not found</span>
      </div>
    )
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">{imageDetail.name}</h1>
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
      </div>
    </div>
  )
}