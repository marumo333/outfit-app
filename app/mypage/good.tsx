"use client"
import { supabase } from "@/utils/supabase/supabase";
import React, { useState, useEffect } from "react";


export default function Good() {
    const [imageId, setImageId] = useState<string|null>(null)
    const [userId, setUserId] = useState<string|null>(null)
    const [isLiked,setIsLiked]=useState<Boolean>(false)

    useEffect(() => {
        const fetchLikes = async () => {

            try{
            const { data, error } = await supabase
                .from('profiles')
                .select(`
                    id,
                    likes(user_id,image_id)
                    `)
                    console.log(data);
                    console.log(error)
            if (error) {
                console.error('いいねの投稿を取得だきませんでした', error.message);
                return;
            }

            if(data){
                setUserId(userId),
                setImageId(imageId)
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
    },[imageId,userId])

    return (
        <>
            <h1>お気に入りの投稿</h1>
            <p>ユーザーID: {userId || "未設定"}</p>
            <p>画像ID: {imageId || "未設定"}</p>
            <p>{isLiked?"この投稿はいいねされています！":"この投稿はいいねされていません"}</p>
        </>
    )
}