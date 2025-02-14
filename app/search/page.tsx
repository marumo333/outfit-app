"use client"
import React,{useState,useEffect} from "react";
import { supabase } from "@/utils/supabase/supabase";
import Head from "next/head";

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
    };

    const search = async(value:string) =>{
        if(value!==""){
            const {data:post,error} = await supabase
            .from("outfit-app")
            .select()
            .textSearch("title", `${value}`);
            if(error) throw new Error ;
            setPosts(posts)
            return;
        }else{
            await fetchPosts();
        }
        };
        const handleChange = async(e:React.ChangeEvent<HTMLElement>)=>{
            setKeyword(e.target.value);
            search(e.target.value);
        }
        return(
            <>
            </>
        )
    }


    