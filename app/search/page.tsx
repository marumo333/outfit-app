"use client"
import React,{useState,useEffect} from "react";
import { supabase } from "@/utils/supabase/supabase";

export default function Serach(){
    const [posts,setPosts] = useState([]);
    const [keyword,setKeyword] = useState("");

    useEffect(()=>{
        fetchPosts();
    },[])

    const fetchPosts =async()=>{
        const {data} = await supabase
        .from("outfit-app")
        .select("*");
        setPosts(data);
    }

    
    return(
        <>
        </>
    )
}