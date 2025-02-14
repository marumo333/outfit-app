"use client"
import React,{useState,useEffect} from "react";
import { supabase } from "@/utils/supabase/supabase";
import Head from "next/head";

interface ImageItem {
    name: string; // 画像名
    url: string;  // 画像の URL
  }

export default function Serach(){
    const [posts,setPosts] = useState<ImageItem | null>(null);
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
            <div>
                <Head>
                    <title>検索機能</title>
                </Head>
                <main>
                    <div>
                        <h1>検索機能</h1>
                        <div>
                            <input 
                            type="text"
                            value={keyword}
                            className="my-6 rounded border border-balack"
                            placeholder="search"
                            onChange={(e)=>handleChange(e)}
                            />
                            <ul>
                                <li>
                                    <p>投稿日</p>
                                    <p>タイトル</p>
                                    <p>内容</p>
                                    </li>
                            </ul>
                            <body>
                                <ul>
                                {posts.map((post:any)=>(
                                    <li key={post.id}>
                                        <p>{post.created_at.substr(0,10)}</p>
                                        <p>{post.title}</p>
                                        <p>{post.content}</p>
                                    </li>
                                ))}
                                </ul>
                            </body>
                        </div>
                    </div>
                </main>
            </div>
            </>
        )
    }


    