// components/Header.tsx
"use client"
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signIn, signOut } from "../app/authSlice";
import { supabase } from "@/utils/supabase/supabase";
import { selectIsSignIn } from "../app/authSlice";
import Link from "next/link";

export default function Header() {
  const dispatch = useDispatch();
  const isSignIn = useSelector(selectIsSignIn);
  const [text, setText] = useState("ログイン");
  useEffect(() => {
    // 初回表示時にログイン状態を再評価
    supabase.auth.getSession().then(({ data }) => {
      const user = data.session?.user;
      if (user) {
        dispatch(signIn({
          name: user.email,
          iconUrl: '',
          token: data.session?.provider_token
        }));
      } else {
        dispatch(signOut());
      }
    });
  }, [dispatch]);

  return isSignIn ? (
    <header className="p-4 border-b-2 border-gray-300 w-full bg-white">
                <ul className="w-full max-w-3xl m-auto flex font-medium flex-row space-x-6 flex-wrap justify-center">

                    <li>
                        <Link className="text-gray-900 hover:text-blue-500 transition-colors duration-200" href="/private">
                            オシャレ着投稿（プライベート画像）
                        </Link>
                    </li>

                    <li>
                        <Link className="text-gray-900 hover:text-blue-500 transition-colors duration-200" href="/logout">
                            ログアウト
                        </Link>
                    </li>
                    <li>
                        <Link className="text-gray-900 hover:text-blue-500 transition-colors duration-200" href="/search">
                            気になる服の画像検索
                        </Link>
                    </li>
                    <li>
                        <Link className="text-gray-900 hover:text-blue-500 transition-colors duration-200" href="/mypage">
                            マイページ
                        </Link>
                    </li>
                </ul>

                <button
                    data-testid="excutebutton"
                    onClick={() => setText("Home")}
                    className="mt-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-all duration-200 focus:ring focus:ring-blue-300"
                >
                </button>
            </header>
  ) : (
    <header className="p-4 border-b-2 border-gray-300 w-full bg-white">
                <ul className="w-full max-w-3xl m-auto flex font-medium flex-row space-x-6 flex-wrap justify-center">
                    <li>
                        <Link className="text-gray-900 hover:text-blue-500 transition-colors duration-200" href="/Home">{text}</Link>
                    </li>

                    <li>
                        <Link className="text-gray-900 hover:text-blue-500 transition-colors duration-200" href="/private">
                            オシャレ着投稿（プライベート画像）
                        </Link>
                    </li>

                    <li>
                        <Link className="text-gray-900 hover:text-blue-500 transition-colors duration-200" href="/search">
                            気になる服の画像検索
                        </Link>
                    </li>
                    <li>
                        <Link className="text-gray-900 hover:text-blue-500 transition-colors duration-200" href="/mypage">
                            マイページ
                        </Link>
                    </li>
                </ul>

                <button
                    data-testid="excutebutton"
                    onClick={() => setText("Home")}
                    className="mt-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-all duration-200 focus:ring focus:ring-blue-300"
                >
                </button>
            </header>
  );
}
