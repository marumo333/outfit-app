import Link from "next/link"
import {useState} from "react";

export default function Header(){
    const [text,setText]= useState("Home");

 return(
    <header className="p-4 border-b-2 border-gray-300 w-full bg-white">
        <ul className="w-full max-w-3xl m-auto flex font-medium flex-row">
            <li className='pr-4'>
                {/* 修正: Home のテキストを変更可能に */}
                <Link className="text-gray-700 hover:text-blue-700" href="/Home">{text}</Link> 
            </li>

            <li>
                <Link className="text-gray-700 hover:text-blue-700" href="/private">機能性重視の服（プライベート画像）</Link>
            </li>
        </ul>

        {/* 修正: テストでクリックできるボタンを追加 */}
        <button
        data-testId="excutebutton"
        onClick={()=>setText("Homeにページ遷移後")}
        className="mt-4 p-2 bg-blue-500 text-white rounded"
        >
            実行
        </button>
    </header>
 )
}