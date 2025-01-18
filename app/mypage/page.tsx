"use client"
import { useState, useEffect } from "react";
import React from "react";
import { supabase } from "@/utils/supabase/supabase";
import { signOut } from "../authSlice";
import { signIn } from "../authSlice";
import { useSelector, useDispatch } from "react-redux";
import { useCookies } from "react-cookie";
import { User } from "@supabase/supabase-js"

interface Prof {
    id: number,
    username: string,
    avatar_url: string,
    updated_at: string,
    full_name: string
}

export default function Mypage() {
    const [myprofs, setMyprofs] = useState<Prof[]>([])//ユーザー情報をセット
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
        const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .order("updated_at", { ascending: false });
        if (error)
            console.error("fetching eror", error)
        else setMyprofs(data || []);
    }

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
            .insert([{ full_name: myprof }]);


        if (error) console.error('Error submitting comment', error);
        else {
            setMyprof('');
        }
        setMyprof("")//入力欄リセット
        await fetchUser();//ユーザー情報を再取得
    }

    const updateChange = async (event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault();
        if (!myprof.trim() || !user) {
            alert("ログインしてください")
            return;
        }

        const { data, error } = await supabase
            .from('profiles')
            .update([{ avatar_url: account }])
            .eq("id", user.id);

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

                    {account && (
                        <img
                            src={account}
                            className="w-auto h-auto max-w-[100px] max-h-[100px] rounded-full"
                        />
                    )}
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