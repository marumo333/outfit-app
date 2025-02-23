"use client"
import React,{useState,useEffect} from "react";
import { supabase } from "@/utils/supabase/supabase";

interface TagItem{
    tag:string,
}

export default function TagSearch(){
    const [tag,settag] = useState<TagItem[]>([])
    const [data ,error] = supabase 


    const {isClient,setIsClient} = useState(false);

    useEffect(()=>{
        setIsClient(true);
    },[])

    if(isClient){
        return<div>読み込み中</div>
    }
    

    return(
        <>
        </>
    )
}