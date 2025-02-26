"use client"
import React, { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase/supabase";
import Head from "next/head";
import { debounce } from "lodash";
import { useSelector, useDispatch } from "react-redux";
import { signOut, signIn } from "../authSlice";
import Link from "next/link";
import { Skeleton } from '@mui/material'

interface ImageItem {
  id: number,
  user_id: number,
  image_url: string,
  created_at: string,
  title: string,
  content: string,
}


export default function Search() {
  const auth = useSelector((state: any) => state.auth.isSignIn);
  const dispatch = useDispatch()
  const [user, setUser] = useState("")//ログイン情報を保持するステート


  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log(event)
        if (session?.user) {
          setUser(session.user.email || "Login User")
          dispatch(signIn({
            name: session.user.email,
            iconUrl: "",
            token: session.provider_token
          }))
          window.localStorage.setItem('oauth_provider_token', session.provider_token || "");
          window.localStorage.setItem('oauth_provider_refresh_token', session.provider_refresh_token || "")
        }

        if (event === 'SIGNED_OUT') {
          window.localStorage.removeItem('oauth_provider_token')
          window.localStorage.removeItem('oauth_provider_refresh_token')
          dispatch(signOut());
          setUser("")//user情報をリセット
        }
      }
    );
    //クリーンアップ処理追加（リスナー削除）
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [dispatch]);
  const [posts, setPosts] = useState<ImageItem[]>([]);
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    fetchPosts();
  }, []);


  async function fetchPosts() {
    const { data } = await supabase
      .from("outfit_image")
      .select("*");
    setPosts(data || []);
  };

  const search = async (value: string) => {
    if (value !== "") {
      const { data: posts, error } = await supabase
        .from("outfit_image")
        .select("*")
        .ilike("title", `%${value}%`);

      if (error) {
        console.error("検索エラー:", error.message);
        return;
      }
      setPosts(posts || []);
    } else {
      await fetchPosts();
    }
  };


  const debounceSearch = debounce((value: string) => {
    search(value);
  }, 300)

  const handleChange = async (e: React.ChangeEvent<HTMLElement>) => {
    const value = (e.target as HTMLInputElement).value
    setKeyword(value);
    debounceSearch(value);
  }

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, [])
  if (!isClient) {
    return <h1>読み込み中....</h1>
  }
  return (
    <>
      {auth ? (<>
        <div>
          <Head>
            <title>検索機能</title>
          </Head>
          <main className="p-6">
            <div className="max-w-3xl mx-auto">
              <h1 className="text-2xl font-semibold mb-4">検索機能</h1>
              <div className="flex justify-end">
                <Link href="/tagSearch" className="flex justify-center items-center w-[300px] h-[60px] text-[#333] text-lg font-bold bg-[#7dca65] rounded-[20px] border-2 border-[#325328] no-underline">
                  タグで検索する
                </Link>
              </div>
              <p>タイトル検索</p>
              <div>
                <input
                  type="text"
                  id="search-input"
                  name="search"
                  value={keyword}
                  className="my-6 w-full max-w-md p-2 rounded border border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="検索..."
                  onChange={handleChange}
                  autoComplete="off"
                />
                <Skeleton variant="circular">
                <ul className="border border-gray-300 rounded p-4">
                  <li className="font-bold border-b border-gray-300 pb-2 mb-2">
                    <p>投稿日</p>
                    <p>タイトル</p>
                    <p>画像</p>
                  </li>
                  {posts.map((post) => (
                    <li key={post.id} className="py-2 border-b last:border-none">
                      <p>{new Date(post.created_at).toLocaleDateString()}</p>
                      <p className="font-semibold">{post.title}</p>
                      <p className="font-semibold">{post.image_url}</p>
                      <img
                        src={post.image_url || "https://example.com/default.jpg"}
                        alt={post.image_url}
                        className="max-w-full h-auto"
                        onError={(e) => (e.currentTarget.src = "https://example.com/default.jpg")}
                      />
                    </li>
                  ))}

                </ul>
                </Skeleton>
              </div>
            </div>
          </main>
        </div>
      </>) : (<div>アカウントでログインしてください</div>)}
    </>
  )
}


