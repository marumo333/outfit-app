"use client"
import React, { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase/supabase";
import { debounce } from "lodash";
import { Skeleton } from "@mui/material";
import { useCallback } from "react";

interface TagItem {
    created_at: string,
    title: string,
    image_url: string,
    id: number,
    tag: string,
}

export default function TagSearch() {
    const [tags, setTags] = useState<TagItem[]>([])
    const [tagsDisplay, setTagsDisplay] = useState("")
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchTags();
    }, [])

    async function fetchTags() {
        setLoading(true)
        try {
            const { data, error } = await supabase
                .from("outfit_image")
                .select("*");

            if (error) {
                console.error("データ取得エラー", error.message)
                return;
            }
            setTags(data || []);
        } catch (err) {
            console.error("予期しないエラー", err)
        } finally {
            setLoading(false)
        }
    };

    const TagSearch = async (value: string) => {
        if (value.trim()=== "") return;
        setLoading(true)
        try {
            const { data, error } = await supabase
                .from("outfit_image")
                .select("*")
                .ilike("tag", `%${value}%`);

            if (error) {
                console.error("検索エラー:", error.message);
                return;
            }
            setTags(data || []);
        } catch (err) {
            console.error("予期しないエラー発生", err);
        }
        finally {
            setLoading(false)
        }
    };

    const debounceTagSearch = useCallback(
        debounce((value: string) => {
            TagSearch(value);
        }, 1000),
        []
    );

    useEffect(() => {
        if(tagsDisplay !==""){
        debounceTagSearch(tagsDisplay)
        }
    }, [tagsDisplay])
    
    const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const value =e.target.value
        setTagsDisplay(value);
        debounceTagSearch(value);
        console.log("aaa")
    };

    
    const handleTagChange = (e: React.MouseEvent<HTMLButtonElement>) => {
        const selectedTag = e.currentTarget.textContent || "";
        setTagsDisplay(selectedTag);
        TagSearch(selectedTag);
    };

    
    
    

    return (
        <>

            <div className="max-w-3xl mx-auto">
                <h1 className="text-2xl font-semibold mb-4">検索機能</h1>
                <p>タグ検索</p>
                <input
                    className="border p-2 rounded w-full"
                    type="text"
                    placeholder="タグを検索..."
                    value={tagsDisplay}
                    onChange={handleChange}
                />
                <ul className="border border-gray-300 rounded p-4">
                    <li className="font-bold border-b border-gray-300 pb-2 mb-2">
                        <p>タグ一覧</p>
                    </li>
                    {tags.map((tag) => (
                        <li
                            key={tag.id}
                            className="inline-block m-[0_0.1em_0.6em_0] p-[0.6em] leading-none text-blue-600 bg-white border border-blue-600 rounded-[2em]"
                        >
                            <button
                                className="font-semibold border-none bg-transparent outline-none cursor-pointer"
                                onClick={handleTagChange}
                            >{tag.tag}</button>
                        </li>
                    ))}
                </ul>
                {loading ? (
                                  <ul className="border border-gray-300 rounded p-4">
                                    {Array.from({ length: 5 }).map((_, index) => (
                                      <li
                                        key={index}
                                        className="py-4 border-b last:border-none flex justify-between items-center"
                                      >
                                        <Skeleton variant="text" width="20%" />
                                        <Skeleton variant="text" width="40%" />
                                        <Skeleton variant="rectangular" width={100} height={80} />
                                      </li>
                                    ))}
                                  </ul>
                                ) : (
                                  <ul className="border border-gray-300 rounded p-4">
                                    <li className="font-bold border-b border-gray-300 pb-2 mb-2 flex justify-between">
                                      <p className="w-1/4">投稿日</p>
                                      <p className="w-1/4">タグ</p>
                                      <p className="w-1/4">画像</p>
                                    </li>
                                    {tags.map((tag) => (
                                      <li key={tag.id} className="py-4 border-b last:border-none flex justify-between items-center">
                                        <p className="w-1/4">{new Date(tag.created_at).toLocaleDateString()}</p>
                                        <p className="w-1/4 font-semibold">{tag.tag}</p>
                                        <div className="w-1/4">
                                          <img
                                            src={tag.image_url || "https://example.com/default.jpg"}
                                            alt={tag.title}
                                            className="w-[100px] h-[80px] object-cover rounded"
                                            onError={(e) => (e.currentTarget.src = "https://example.com/default.jpg")}
                                          />
                                        </div>
                                      </li>
                                    ))}
                                  </ul>
                                )}
            </div>
        </>
    )
}