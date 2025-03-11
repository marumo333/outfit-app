"use client"
import { HeartIcon } from '@heroicons/react/24/solid'
import { supabase } from "@/utils/supabase/supabase";
import React,{useState,useEffect} from "react";
import router from 'next/router';
import { moveMessagePortToContext } from 'worker_threads';
interface GoodThread{
    imageId:string,
    userId:string,
}

export const GoodSection:React.FC<GoodThread>=({imageId,userId})=>{
    const [isLiked,setIsLiked] = useState(false)
    const[likeCount,setLikeCount] = useState(0) 
    const [loading,setLoading] = useState(false)

    useEffect(()=>{
        const fetchLikes=async()=>{
            const{data,error}=await supabase 
            .from('likes')
            .select("*",{count:"exact"})
            .eq("image_id",imageId);

            if(!error){
                setLikeCount(data.length);
            }
            const{data:likeData}= await supabase
            .from('likes')
            .select("*")
            .eq("image_id",imageId)
            .eq("user_id",userId)
            .single();;

            if(likeData){
                setLoading(true);
            }
        };
        fetchLikes();
    },[userId,imageId])
    return(
        <>
        </>
    )
}
export default GoodSection;