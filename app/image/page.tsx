import React, { useCallback, useEffect, useState } from 'react'
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai"
import { supabase } from '@/utils/supabase/supabase'

interface ImageItem{
    name:string,//画像名
    url:string,//画像のURL
  }

export default function Image(){
    const [loadingState,setLoadingState] = useState("hidden")
    const [url,setUrl] =useState<ImageItem[]>([])

  const ImageId = async () => {
      setLoadingState("flex justify-center");
      const tempUrlList: ImageItem[] = [];
  
      const { data, error } = await supabase.storage
        .from("outfit-image")
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
            .from("outfit-image")
            .createSignedUrl(filePath, 300);
  
          if (signedError) {
            console.error(signedError);
            continue;
          }
  
          if (signedData?.signedUrl) {
            tempUrlList.push({name:file.name,url:signedData.signedUrl});
          }
        }
      }
  
      setUrl(tempUrlList);
      setLoadingState("hidden");
    };
    // Fetch image list on component mount
  useEffect(() => {
    (async () => {
      await ImageId();
    })();
  }, []);

  return(
    <ul className="flex flex-wrap w-full">
    {url.map((item) => (
      <li className="w-1/4 h-auto p-1" key={item.name}>
        <a className="hover:opacity-50" href={item.url} target="_blank" rel="noopener noreferrer">
          < img className="object-cover max-h-32 w-full" src={item.url} alt="item.name"  />
        </a>
      </li>
    ))}
  </ul>
  )
}