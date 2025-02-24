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
        if (value !== "") {
            const { data: tags, error } = await supabase
                .from("outfit_image")
                .select("*")
                .ilike("tag", `%${value}%`);

            if (error) {
                console.error("検索エラー", error.message)
                return;
            }
            setTags(tags || [])
        }
        else {
            await fetchTags();
        }
    };

    const debounceTagSearch = debounce((value: string) => {
        TagSearch(value);
    }, 300)

    useEffect(() => {
        debounceTagSearch(tagsDisplay)
    }, [tagsDisplay])
    const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setTagsDisplay(e.target.value);
    }

    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, [])

    if (!isClient) {
        return <div>読み込み中</div>
    }


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
                            <input
                                className="font-semibold border-none bg-transparent outline-none cursor-pointer"
                                type="text"
                                name="search"
                                value={tag.tag}
                                onClick={() => handleChange}
                                readOnly
                                autoComplete="off"
                            />
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