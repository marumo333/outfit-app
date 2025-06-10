"use client";

import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { supabase } from "@/utils/supabase/supabase";
import { signIn, signOut } from "../authSlice";
import { useRouter } from "next/navigation";

export default function RedirectPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [loading, setLoading] = useState(true); // ローディング制御用

  useEffect(() => {
    // ✅ 既存ログインセッション確認（初回読み込み時）
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      const session = data.session;

      if (session?.user) {
        dispatch(signIn({
          name: session.user.email,
          iconUrl: "",
          token: session.provider_token,
        }));
        router.push("/private");
      } else {
        setLoading(false); // セッションがないので通常UI表示へ
      }
    };

    checkSession();

    // ✅ 認証イベントの監視（Google OAuth後の発火に対応）
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_IN" && session?.user) {
          dispatch(signIn({
            name: session.user.email,
            iconUrl: "",
            token: session.provider_token,
          }));
          router.push("/private");
        } else if (event === "SIGNED_OUT") {
          dispatch(signOut());
        }
      }
    );

    // ✅ クリーンアップ
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [dispatch, router]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center text-gray-700">
      {loading ? (
        <p>ログイン処理中です。しばらくお待ちください...</p>
      ) : (
        <p>ログインしていないためホームに戻ります。</p>
      )}
    </div>
  );
}
