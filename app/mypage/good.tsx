"use client"
import { supabase } from "@/utils/supabase/supabase";
import React, { useState, useEffect } from "react";

interface LikesImage{
    image_url:string,
    image_id:string,
}

export default function Good() {
    const [imageId, setImageId] = useState<LikesImage[]>([])
    const [imageUrl, setImageUrl] = useState<string>("")
    const [isLiked,setIsLiked]=useState<Boolean>(false)

    useEffect(() => {
        const fetchLikes = async () => {

            try{
            const { data, error } = await supabase
                .from('likes')
                .select(`
                    iamge_id,
                    outfit_image(id,image_url)
                    `)
                    console.log(data);
                    console.log(error)
            if (error) {
                console.error('いいねの投稿を取得だきませんでした', error.message);
                return;
            }

            if(data){
                setImageUrl(imageUrl),
                setImageId(imageId),
                setIsLiked(true)//いいね済みのものを表示
            }
            else{
                setIsLiked(false)
            }
        }catch(err){
                console.error("お気に入りの取得に失敗しました",err)
            }
        };
        fetchLikes()
    },[imageId,imageUrl])

    return (
        <>
            <h1>お気に入りの投稿</h1>
            <p>ユーザーID: {imageId ||"未設定"}</p>
            <p>画像ID: {imageUrl || "未設定"}</p>
            <p>{isLiked?"この投稿はいいねされています！":"この投稿はいいねされていません"}</p>
        </>
    )
}