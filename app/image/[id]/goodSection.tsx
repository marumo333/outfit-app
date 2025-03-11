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

    return(
        <>
        </>
    )
}
export default GoodSection;