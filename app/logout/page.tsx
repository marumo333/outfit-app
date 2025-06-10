"use client"

import React, { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/supabase";
import { useSelector, useDispatch } from "react-redux";
import { signOut, signIn } from "../authSlice";
import { useCookies } from "react-cookie";
import { useRouter } from "next/navigation";

export default function Logout() {
  const auth = useSelector((state: any) => state.auth.isSignIn);
  const dispatch = useDispatch();
  const [user, setUser] = useState<string | null | undefined>(undefined);
  const [cookies] = useCookies();
  const router = useRouter();

  //  ログイン状態の監視
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      const session = data.session;
      if (session?.user) {
        setUser(session.user.email || "User");
        dispatch(signIn({
          name: session.user.email,
          iconUrl: "",
          token: session.provider_token,
        }));
      } else {
        setUser(null);
      }
    };
    checkSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log(event);
        if (event === "SIGNED_OUT") {
          setUser(null);
          dispatch(signOut());
        }
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [dispatch]);

  //  安全なログアウト処理
  const logOut = async () => {
    try {
      const { data, error: sessionError } = await supabase.auth.getSession();
      if (!data.session) {
        console.warn("すでにログアウト状態です");
        return;
      }

      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      dispatch(signOut());
      setUser(null);
      setTimeout(() => {
        router.push("/Home");
      }, 100);
    } catch (error: any) {
      console.error("ログアウトエラー発生:", error.message);
    }
  };

  //  ローディング中
  if (user === undefined) {
    return <div className="text-gray-500">ローディング中...</div>;
  }

  return (
    <>
      {user ? (
        <button
          onClick={logOut}
          className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-4 rounded-lg"
        >
          ログアウト
        </button>
      ) : (
        <div>
          <p className="text-lg">ログインしていません</p>
        </div>
      )}
    </>
  );
}
