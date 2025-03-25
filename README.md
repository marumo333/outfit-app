<h1>React✖️TypeScript✖️Next.jsで作る服投稿アプリ</h1>

<h2>使用言語一覧</h2>
<p>フロントエンド</p>
<img src="https://img.shields.io/badge/-Next.js-000000.svg?logo=Next.js&style=flat&logoColor=ffffff" alt="Next.js Badge">
<img src="https://img.shields.io/badge/-React.js-000000.svg?logo=React.js&style=flat&logoColor=ffffff" alt="React.js Badge">
<img src="https://img.shields.io/badge/-TypeScript-000000.svg?logo=TypeScript&style=flat&logoColor=ffffff" alt="TypeScript Badge">

<p>バックエンド</p>
<img src="https://img.shields.io/badge/-supabase-000000.svg?logo=supabase&style=flat&logoColor=ffffff" alt="supabase Badge">

<h2>webアプリの概要</h2>
<p>ユーザーが普段来ている服のコーディネートを投稿できるwebアプリ</p>

<h2>実装した機能</h2>
<p>ログイン機能（ゲストログイン機能、google,Xでのログイン機能を追加）</P>
<p>服の画像投稿機能（ユーザーは画像のタイトル・内容・ハッシュタグ・画像の添付が可能、投稿にはログインが必須）</P>
<p>ユーザーが投稿した画像に対するいいね機能</p>
<p>いいねしたものをユーザーに表示するマイページ機能を追加</p>
<p>ユーザーが投稿した画像へのコメント機能を実装（コメントを投稿したユーザーのみ自身のコメントを削除可能）</P>
<p>投稿した画像の詳細画面</p>

<h2>実装で苦労したこと</h2>
<p>supabaseを用いてwebアプリを作成することが今回で初めてのことだったため、supabseのコードの書き方やsupabaseを用いての機能の実装にとても苦労した。また、いいね機能の
実装の際、服の画像を保存するpostsテーブルといいねを保存するlikeテーブルを紐付け、マイページのいいね画像を取得する機能を実装するのはとても難しかった。SQLの知識を用いて
のテーブル設計も今回で初めてだったため、supabaseを用いてのいいね機能の実装はいくつもエラーを解決しながらやっと実装できた。</p>

<h2>今後の課題</h2>
<p>実際に機能としてはできたため、vercelでリリースした（urlは下記を参照）。実際にwebアプリとしてどのような改善の余地があるのかを私の友人や身近な人に使用してもらい、より良くしていきたいと思う。</p>

<p>vercel:https://outfitapp-delta.vercel.app/</p>