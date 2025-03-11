"use client"
import { HeartIcon } from '@heroicons/react/24/solid'
import { supabase } from "@/utils/supabase/supabase";
import React,{useState,useEffect} from "react";
import router from 'next/router';
interface GoodThread{
    id:number,
    user_id:string,
    comment_id:string,
}
export const GoodSection=()=>{
    const [good,setGood] = useState<GoodThread[]>([])
    const [user,setUser]=useState<string>('')


    useEffect(() => {
            const fetchUser =async()=>{
                const { data,error} = await supabase.auth.getUser();
                console.log(user)
                if(error){
                    console.log("ユーザー情報を取得だきませんでした",error);
                    return;
                }
                if(data?.user){
                    setUser(data.user.id);
              }
            }
            fetchUser();
        }, []);

    const handleLikeSubmit=async (event: React.FormEvent<HTMLFormElement>)=>{
        event.preventDefault();
        if (user!) {
            // いいねを新規作成
            await supabase.from('likes').insert({
              user_id: user.id!,
              comment_id,
            })
          } else {
            // いいねを削除
            await supabase.from('likes').delete().match({ user_id: user.id, comment_id: comment_id })
          }

    }
    return(
        <>
        </>
    )
}
export default GoodSection;