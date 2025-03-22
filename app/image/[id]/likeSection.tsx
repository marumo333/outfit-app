"use client"
import { HeartIcon } from '@heroicons/react/24/solid'
import { supabase } from "@/utils/supabase/supabase";
import React, { useState, useEffect } from "react";


interface LikeThread {
    imageId: string,
    userId: string,
}

export const LikeSection: React.FC<LikeThread> = ({ imageId, userId }) => {
    const [isLiked, setIsLiked] = useState(false)
    const [likeCount, setLikeCount] = useState(0)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const fetchLikes = async () => {
            if (!imageId || !userId) return;
            const { data, error } = await supabase
                .from('likes')
                .select("*", { count: "exact" })
                .eq("image_id", imageId);

            if (!error) {
                setLikeCount(data.length);
            }
            const { data: likeData } = await supabase
                .from('likes')
                .select("*", { count: "exact" })
                .eq("image_id", imageId)
                .eq("user_id", userId)
                .maybeSingle()

            if (likeData) {
                setIsLiked(true);
            }
        };
        fetchLikes();
    }, [userId, imageId])

    const handleLikeToggle = async () => {
        if (!userId) return; // ログインしていない場合は処理しない

        setLoading(true);

        if (isLiked) {
            // いいねを削除
            const { error } = await supabase
                .from("likes")
                .delete()
                .match({ user_id: userId, image_id: imageId });

            if (!error) {
                setIsLiked(false);
                setLikeCount((prev) => prev - 1);
            }
        } else {
            // いいねを追加
            const { error } = await supabase
                .from("likes")
                .insert({ user_id: userId, image_id: imageId });

            if (!error) {
                setIsLiked(true);
                setLikeCount((prev) => prev + 1);
            }
        }

        setLoading(false);
    };

    return (
        <button
            onClick={handleLikeToggle}
            className={`flex items-center space-x-2 ${isLiked ? "text-red-500" : "text-gray-500"}`}
            disabled={loading}
        >
            <HeartIcon className="h-6 w-6" />
            <span>{likeCount}</span>
        </button>
    );
};

export default LikeSection;