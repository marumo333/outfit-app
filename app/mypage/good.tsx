"use client"
import { supabase } from "@/utils/supabase/supabase";
import { eq } from "lodash";
import React, { useState, useEffect } from "react";


export default function Good() {
    const [imageId, setImageId] = useState<string>("")
    const [userId, setUserId] = useState<string>("")
    const [isLiked,setIsLiked]=useState<Boolean>(false)

    useEffect(() => {
        const fetchLikes = async () => {
            if (!imageId || !userId) return;

            try{
            const { data, error } = await supabase
                .from('likes')
                .select("*", { count: "exact" })
                .eq("image_id", imageId)
                .eq("user_id", userId)
                .maybeSingle()

            if (error) {
                console.error('いいねの投稿を取得だきませんでした', error.message);
                return;
            }

            if(data){
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
        </>
    )
}