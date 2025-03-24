"use client"
import { useState, useEffect } from "react";
import React from "react";
import { supabase } from "@/utils/supabase/supabase";
import { useSelector, useDispatch } from "react-redux";
import { useCookies } from "react-cookie";
import Compressor from "compressorjs";
import Like from "./likes"

interface Prof {
    id: string,
    avatar_url: string,
    updated_at: string,
    full_name: string
}

export default function Mypage() {
    const [myprof, setMyprof] = useState<Prof>({
        id: "",
        avatar_url: "",
        updated_at: "",
        full_name: "",
    });

    const [file, setFile] = useState<File | null>(null)
    const [error, setError] = useState("")
    const auth = useSelector((state: any) => state.auth.isSignIn);
    const [userId, setUserId] = useState<string>('');
    const [cookies] = useCookies()
    const [isClient, setIsClient] = useState(false)
    const [selectId, setSelectId] = useState<number | null>(null);
    const [avatarUrl, setAvatarUrl] = useState("")//ログイン情報を保持するステート
    useEffect(() => {
        const fetchUser = async () => {
            const { data, error } = await supabase.auth.getUser();
            if (error || !data?.user) {
                console.log("ユーザー情報を取得できませんでした", error);
                return;
            }
            const uid = data.user.id;
            setUserId(uid);
            await getUser(uid);
        };
        fetchUser();
    }, []);
    const getUser = async (userId: string) => {
        if (!userId) return;

        const { data, error } = await supabase
            .from("users")
            .select("id, username, avatar_url, updated_at, full_name")
            .eq("id", userId) // ユーザーごとのデータのみ取得
            .order("updated_at", { ascending: false })
            .limit(1); // 1件のみ取得

        if (error) {
            console.error("fetching error", error);
        } else if (data.length > 0) {
            setAvatarUrl(data[0].avatar_url); //最新のアイコン URL をセット
            setMyprof(data[0]);
        }

    };

    useEffect(() => {
        if (userId) {
            getUser(userId);
        }
    }, [userId])

    const profSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log(myprof)
        console.log(userId)
        if (!myprof || !userId) {
            alert("ログインしてください")
            return;
        }
        const { data, error } = await supabase
            .from('users')
            .upsert(
                { id: userId, full_name: myprof.full_name },
                { onConflict: 'id' }//idが重複していたら更新
            );
        if (error) console.error('Error submitting comment', error);
        else {
            setMyprof(myprof);
        }
        getUser(userId);//ユーザー情報を再取得
    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0] // 選択したファイルを保存
        if (!selectedFile) return;

        // 画像を圧縮する
        new Compressor(selectedFile, {
            quality: 0.8, // 圧縮率
            maxWidth: 100,
            maxHeight: 100,
            mimeType: 'image/jpeg',
            success: (compressedResult) => {
                if (compressedResult instanceof Blob) {
                    setFile(new File([compressedResult], selectedFile.name, { type: "image/jpeg" }));
                }
            },
            error: (err) => {
                console.error(err.message);
                setError("画像の圧縮中にエラーが発生しました。");
            },
        });
    };
    const updateChange = async (event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault();
        if (!file || !userId) {
            alert("画像を選択してください");
            return;
        }

        const filePath = `avatars/${userId}_${Date.now()}.jpg`;
        const { error: uploadError } = await supabase.storage
            .from("avatars")
            .upload(filePath, file, { contentType: "image/jpeg" });

        if (uploadError) {
            console.error("画像アップロードエラー", uploadError);
            return;
        }

        const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
        const publicUrl = data?.publicUrl || "";

        if (!publicUrl) {
            console.error("画像の URL を取得できませんでした。");
            return;
        }

        const { error: updateError } = await supabase
            .from("users")
            .update({ avatar_url: publicUrl })
            .eq("id", userId);

        if (!updateError) {
            setAvatarUrl(publicUrl);
        }

        await getUser(userId);
    };

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) {
        return <h1>読み込み中...</h1>; // 初回SSR時にはクライアントでレンダリングするまでプレースホルダーを表示
    }

    return (
        <>
            {userId ? (
                <>
                    <h1 suppressHydrationWarning className="mb-4 pt-28 text-4xl">My Page</h1>
                    <form onSubmit={profSubmit}>
                        <textarea
                            value={myprof?.full_name ?? ""}
                            id="myprof"
                            name="myprof"
                            placeholder="write your username"
                            onChange={(e) => {
                                setMyprof(prev => ({
                                    id: prev?.id || "",  // 既存のIDがあれば使用
                                    avatar_url: prev?.avatar_url || "",
                                    updated_at: prev?.updated_at || "",
                                    full_name: e.target.value
                                }));
                            }}

                        />
                        <button className="bg-sky-400 text-primary-foreground hover:bg-sky-400/90 border-sky-500 border-b-4 active:border-b-0"
                            type="submit"
                            id="submitComment"
                            name="subamitComment"
                        >ユーザー情報を更新</button>
                    </form>

                    <input
                        accept="image/*"
                        multiple type="file"
                        onChange={handleFileChange}
                    />
                    <button onClick={updateChange} className="bg-sky-400 text-primary-foreground hover:bg-sky-400/90 border-sky-500 border-b-4 active:border-b-0">アイコンを更新</button>

                    <div style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0' }}>
                        <p className="text-blue-500">{myprof?.full_name || "No Username"}</p>
                        {avatarUrl && (
                            <img
                                src={avatarUrl}
                                className="w-auto h-auto max-w-[100px] max-h-[100px] rounded-full"
                            />
                        )}
                        <Like userId={myprof?.id || ""} />
                    </div>




                </>
            ) : (
                <h1>ユーザー情報を取得してください</h1>
            )}
        </>
    )
}