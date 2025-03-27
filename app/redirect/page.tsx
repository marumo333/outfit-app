"use client"
import { useSelector, useDispatch } from "react-redux";
import React, { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/supabase";
import { signOut, signIn } from "../authSlice";


export default function Redirect() {
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

                    window.location.href = "https://your-app-name.vercel.app/private";
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
    return (
        <div>Homeページに移動しています。</div>
    )
}
