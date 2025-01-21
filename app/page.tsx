import ImageApp from "@/components/imageApp";

export default function Index() {
  return (
    <>
      <h1 className="mb-4 pt-28 text-4xl">機能性重視の服投稿アプリ</h1>
      <div className="flex-1 w-full flex flex-col items-center">
        <ImageApp />
      </div>
    </>

  );
}