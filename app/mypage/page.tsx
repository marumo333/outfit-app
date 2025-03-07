"use client"
import { useState, useEffect } from "react";
import React from "react";
import { supabase } from "@/utils/supabase/supabase";
import { signOut } from "../authSlice";
import { signIn } from "../authSlice";
import { useSelector, useDispatch } from "react-redux";
import { useCookies } from "react-cookie";
import { User } from "@supabase/supabase-js"
import Compressor from "compressorjs"

interface Prof {
    id: number,
    username: string,
    avatar_url: string,
    updated_at: string,
    full_name: string
}

export default function Mypage() {
    const [myprofs, setMyprofs] = useState<Prof[]>([])//ユーザー情報をセット
    const [file, setFile] = useState<File | null>(null)
    const [error, setError] = useState("")
    const [compressedFile, setCompressedFile] = useState(null); // 圧縮されたファイルを保持するステート
    const [myprof, setMyprof] = useState<string>('')
    const auth = useSelector((state: any) => state.auth.isSignIn);
    const dispatch = useDispatch()
    const [user, setUser] = useState<User | null>(null);
    const [cookies] = useCookies()
    const [isClient, setIsClient] = useState(false)
    const [selectId, setSelectId] = useState<number | null>(null);
    const [account, setAccount] = useState("")//ログイン情報を保持するステート

    useEffect(() => {
        const { data: authListener } = supabase.auth.onAuthStateChange(
            (event, session) => {
                console.log(event)
                if (session?.user) {
                    setAccount(session.user.email || "Login User")
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
                    setUser(null)
                    setAccount("")//user情報をリセット
                    dispatch(signOut());
                }
            }
        );
        //クリーンアップ処理追加（リスナー削除）
        return () => {
            authListener?.subscription.unsubscribe();
        };
    }, [dispatch]);


    const fetchUser = async () => {
        if (!user) return;

        const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("user_id", user.id) // 🔥ユーザーごとのデータのみ取得
            .order("updated_at", { ascending: false })
            .limit(1); // 1件のみ取得

        if (error) {
            console.error("fetching error", error);
        } else if (data.length > 0) {
            setAccount(data[0].avatar_url); // 🔥 最新のアイコン URL をセット
        }
    };


    useEffect(() => {
        fetchUser();
    }, [])

    const profSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!myprof.trim() || !user) {
            alert("ログインしてください")
            return;
        }
        const { data, error } = await supabase
            .from('profiles')
            .insert([{ user_id: user.id, full_name: myprof }])

        if (error) console.error('Error submitting comment', error);
        else {
            setMyprof('');
        }
        setMyprof("")//入力欄リセット
        await fetchUser();//ユーザー情報を再取得
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
                    setFile(new File([compressedResult], selectedFile.name, { type: "image/jpeg" }))
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
        if (!myprof.trim() || !user) {
            alert("ログインしてください")
            return;
        }

        const { data, error } = await supabase
            .from('profiles')
            .update({ avatar_url: account })
            .eq("user_id", user.id);

        if (error) console.error('Error submitting comment', error);
        else {
            setAccount('');
        }
        setAccount("")//入力欄リセット
        await fetchUser();//ユーザー情報を再取得
    }
    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) {
        return <h1>読み込み中...</h1>; // 初回SSR時にはクライアントでレンダリングするまでプレースホルダーを表示
    }

    return (
        <>
            {auth ? (
                <>
                    <h1 suppressHydrationWarning className="mb-4 pt-28 text-4xl">My Page</h1>
                    <form onSubmit={profSubmit}>
                        <textarea
                            value={myprof}
                            id="myprof"
                            name="myprof"
                            onChange={(e) => setMyprof(e.target.value)}
                            placeholder="write a username..."
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
                    <div>
                        {myprofs.map((myprof) => (
                            <div key={myprof.id} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0' }}>
                                <p className="text-blue-500">{myprof.username}</p>
                                {account && (
                                    <img
                                        src={account}
                                        className="w-auto h-auto max-w-[100px] max-h-[100px] rounded-full"
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <h1>ユーザー情報を取得してください</h1>
            )}
        </>
    )
}