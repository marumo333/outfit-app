"use client"
import React,{useState,useEffect} from "react";
import { supabase } from "@/utils/supabase/supabase";
import Head from "next/head";

interface ImageItem{
    id:number,
    title:string,
    created_at:string,
    content:string,
}

export default function Serach(){
    const [posts,setPosts] = useState<ImageItem[]>([]);
    const [keyword,setKeyword] = useState("");

    useEffect(()=>{
        fetchPosts();
    },[])

    async function fetchPosts(){
        const {data} = await supabase.from("outfit-app").select("*");
        setPosts(data||[]);
    };

    const search = async(value:string) =>{
        if(value!==""){
            const {data:posts,error} = await supabase
            .from("outfit-app")
            .select()
            .textSearch("title", `%${value}%`);
            if(error) throw  error ;
            setPosts(posts)
            return;
        }else{
            await fetchPosts();
        }
        };
        const handleChange = async(e:React.ChangeEvent<HTMLElement>)=>{
            setKeyword((e.target as HTMLInputElement).value);
            search((e.target as HTMLInputElement).value);
        }
        return(
            <>
            <div>
                <Head>
                    <title>検索機能</title>
                </Head>
                <main className="p-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-semibold mb-4">検索機能</h1>
          <div>
            <input
              type="text"
              value={keyword}
              className="my-6 w-full max-w-md p-2 rounded border border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="検索..."
              onChange={handleChange}
            />
            <ul className="border border-gray-300 rounded p-4">
              <li className="font-bold border-b border-gray-300 pb-2 mb-2">
                <p>投稿日</p>
                <p>タイトル</p>
                <p>内容</p>
              </li>
              {posts.map((post) => (
                <li key={post.id} className="py-2 border-b last:border-none">
                  <p>{post.created_at.substr(0, 10)}</p>
                  <p className="font-semibold">{post.title}</p>
                  <p>{post.content}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
            </div>
            </>
        )
    }


    