"use client"
import Link from "next/link"
import Icon from "./Icon";
import { supabase } from "@/utils/supabase/supabase";
import React,{useState,useEffect} from "react";

export default function () {
    const [avatarUrl, setAvatarUrl] = useState<string>(""); // URLを保存する状態
    useEffect(() => {
        
    
        const fetchAvatarUrl = async () => {
          const { data } = supabase.storage.from("avatars").getPublicUrl("istockphoto-1370935117-612x612.jpg");
          setAvatarUrl(data.publicUrl || "");
        };
    
        fetchAvatarUrl();
      }, []);
    return (
        <>
            <Link className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-4 rounded-lg" href="/">
                ゲストログイン
            </Link>
            <Icon url={avatarUrl} />
        </>
    )
}