import ImageApp from "@/components/imageApp";

export default function Private(){
  return(
  <>
  <h1 className="mb-4 pt-28 text-4xl">オシャレ服投稿アプリ</h1>
  <p className="mb-4">
    *表示された画像は5分でリンクが不可になります。<br/>
    再度アクサスした場合はリロードボタンを押してください。
  </p>
  <div className="flex-1 w-full flex flex-col items-center">
    <ImageApp/>
  </div>
  </>
  )
}
