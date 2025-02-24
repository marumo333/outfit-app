"use client"
import React, { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase/supabase";
import { debounce } from "lodash";

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

    useEffect(() => {
        fetchTags();
    }, [])

    async function fetchTags() {
        const { data } = await supabase
            .from("outfit_image")
            .select("*")
        setTags(data || [])

    }
    const TagSearch = async (value: string) => {
        if (value! == "") {
            const { data: tags, error } = await supabase
                .from("outfit_image")
                .select("*")
                .ilike("tag", `%${value}%`);

            if (error) {
                throw new Error("検索エラー", error)
                return;
            }
            setTags(tags || [])
        }
        else {
            await fetchTags();
        }
    };

    const debounceTagSearch = debounce((value:string)=>{
        
    })


    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, [])

    if (isClient) {
        return <div>読み込み中</div>
    }


    return (
        <>
            <div className="max-w-3xl mx-auto">
                <h1 className="text-2xl font-semibold mb-4">検索機能</h1>
                <p>タグ検索</p>
                <ul className="border border-gray-300 rounded p-4">
                    <li className="font-bold border-b border-gray-300 pb-2 mb-2">
                        <p>タグ一覧</p>
                    </li>
                    {tags.map((tag) => (
                        <li key={tag.id} className="py-2 border-b last:border-none">
                            <input className="font-semibold"
                                type="text"
                                id="search-input"
                                name="search"
                                value={tagsDisplay}
                                onClick={handleChange}
                                autoComplete="off"
                            >{tag.tag}</input>
                        </li>
                    ))}
                </ul>

                <ul className="border border-gray-300 rounded p-4">
                    <li className="font-bold border-b border-gray-300 pb-2 mb-2">
                        <p>投稿日</p>
                        <p>タグ</p>
                        <p>タイトル</p>
                        <p>画像</p>
                    </li>
                    {tags.map((tag) => (
                        <li key={tag.id} className="py-2 border-b last:border-none">
                            <p>{new Date(tag.created_at).toLocaleDateString()}</p>
                            <p className="font-semibold">{tag.tag}</p>
                            <p className="font-semibold">{tag.title}</p>
                            <p className="font-semibold">{tag.image_url}</p>
                            <img
                                src={tag.image_url || "https://example.com/default.jpg"}
                                alt={tag.image_url}
                                className="max-w-full h-auto"
                                onError={(e) => (e.currentTarget.src = "https://example.com/default.jpg")}
                            />
                        </li>
                    ))}

                </ul>

            </div>
        </>
    )
}