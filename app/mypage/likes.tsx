"use client"
import { supabase } from "@/utils/supabase/supabase";
import React, { useState, useEffect } from "react";

interface LikesImage {
    image_url: string;
    image_id: string;
}

export default function Good() {
    const [likedImages, setLikedImages] = useState<LikesImage[]>([])
    const [isLiked, setIsLiked] = useState(false)

    useEffect(() => {
        const fetchLikes = async () => {

            try {
                const { data, error } = await supabase
                    .from('likes')
                    .select(`
                    image_id,
                    outfit_image(id, image_url)
                    `)
                console.log(data);
                console.log(error)
                if (error) {
                    console.error('いいねの投稿を取得だきませんでした', error.message);
                    return;
                }

                if (data && data.length > 0) {
                    const formattedData = (data as any[]).map((item) => ({
                        image_id: item.image_id,
                        image_url: item.outfit_image?.image_url ||"",
                    }))
                    setLikedImages(formattedData)
                    setIsLiked(true)//いいね済みのものを表示
                }
                else {
                    setIsLiked(false)
                }
            } catch (err) {
                console.error("お気に入りの取得に失敗しました", err)
            }
        };
        fetchLikes()
    }, [])

    return (
        <div>
            <h1>お気に入りの投稿</h1>
            {isLiked ? (
                likedImages.map((img) => (
                    <div key={img.image_id}>
                        <p>画像ID:{img.image_id}</p>
                        {img.image_url ? (
                            <img src={img.image_url} alt="お気に入りの画像" width={200} />
                        ) : (
                            <p>画像が見つかりません</p>
                        )}
                    </div>
                ))
            ) : (
                <p>いいねした投稿はありません</p>
            )}
        </div>
    )
}