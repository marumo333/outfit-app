"use client"
import { supabase } from "@/utils/supabase/supabase";
import React,{useState,useEffect} from "react";

interface GoodThread{
    imageId:string,
    userId:string,
}
export default function Good(){
    const [imageId,setImageId]= useState<GoodThread[]>([])
    const [userId, setUserId] = useState<string>("")
    
        useEffect(() => {
            const fetchLikes = async () => {
                if (!imageId || !userId) return;
                const { data, error } = await supabase
                    .from('likes')
                    .select("*", { count: "exact" })
                    .eq("image_id", imageId);
    
                if (!error) {
                    console.error('お気に入りページの')
                }
                const { data: likeData } = await supabase
                    .from('likes')
                    .select("*", { count: "exact" })
                    .eq("image_id", imageId)
                    .eq("user_id", userId)
                    .maybeSingle()
    
                if (likeData) {
                    setUserId(likeData);
                    setImageId(likeData);
                }
            };
            fetchLikes();
        }, [userId, imageId])
    return(
        <>
        <h1>お気に入りの投稿</h1>
        <p>{userId}</p>
        <p>{imageId}</p>
        </>
    )
}