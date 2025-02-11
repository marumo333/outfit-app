"use client"

import React, { useState, useEffect } from 'react';
import  {supabase}  from "@/utils/supabase/supabase";
import { useSelector,useDispatch } from 'react-redux';
import { signOut } from "@/app/authSlice";
import {signIn} from "@/app/authSlice";
import {User} from "@supabase/supabase-js"
interface Comment {
  id: number;
  content: string;
  created_at: string;
  user_id:string;
}

export   const CommentSection = ()=> {
  const [user,setUser] =useState<User|null>(null);
  const [comment, setComment] = useState<string>('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [selectId,setSelectId]=useState<number|null>(null);
  const auth = useSelector((state:any) => state.auth.isSignIn);
  const dispatch = useDispatch()
  const[account,setAccount]= useState("")//ログイン情報を保持するステート
  //ログイン情報を取得
  useEffect(()=>{
      const{data:authListener} =supabase.auth.onAuthStateChange(
        (event,session)=>{
          console.log(event)
    if (session?.user) {
      setUser(session.user)
      setAccount(session.user.email||"GitHub User")
      dispatch(signIn({
        name: session.user.email, 
      iconUrl: "", 
      token: session.provider_token 
      }))
      window.localStorage.setItem('oauth_provider_token', session.provider_token||"");
      window.localStorage.setItem('oauth_provider_refresh_token', session.provider_refresh_token||"")
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
  return () =>{
    authListener?.subscription.unsubscribe();
  };
    },[dispatch]);

    //コメントをフェッチ
  const fetchComments = async () => {
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) console.error('Error fetching comments', error);
    else setComments(data||[]);
  };

  //コメント情報を更新
  useEffect(() => {
     fetchComments();
  }, []);
  

  const handleCommentSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!comment.trim()||!user){
      alert("ログインしてください")
      return;//無記名送信を避ける
    } 
    const { data, error } = await supabase
      .from('comments')
      .insert([{ content: comment ,user_id:user.id}]);
   

    if (error) console.error('Error submitting comment', error);
    else {
      setComment('');
    }
      setComment("")//入力欄リセット
    await fetchComments();//コメントを再取得
  };

 

  const handleSelectChange=(event:React.ChangeEvent<HTMLSelectElement>)=>{
    setSelectId(Number(event.target.value))
  }

  const handleDelete=async()=>{
   if(selectId===null|| !user) return

   try{
    const {data:commentData,error:fetchError} = await supabase
    .from('comments')
    .select("user_id")
    .eq("id",selectId)//削除対象を特定
    .single();

  if(fetchError) throw new Error("削除エラー")

    if(commentData?.user_id!==user.id){
      alert("投稿主のみ自身の投稿の削除可能")
      return;
    }

  const{error} =await supabase
  .from("comments")
  .delete()
  .eq("id",selectId);

  if(error) throw new Error ("削除エラー")

  // UI更新（削除後に再取得 or フィルタリング）
  await fetchComments();
  setSelectId(null);
   }catch (error:any) {
    alert(error.message);
  }
  };

  return (
    <div>
      <h1>Comments</h1>
      <form onSubmit={handleCommentSubmit}>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write a comment..."
        />
        <button className="bg-sky-400 text-primary-foreground hover:bg-sky-400/90 border-sky-500 border-b-4 active:border-b-0" type="submit">コメント投稿</button>
      </form>
      <div>
        <p>コメント一覧</p>
      </div>
      <div>
        {comments.map((comment) => (
          <div key={comment.id} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0' }}>
            <p className="text-blue-500">{comment.content}</p>
            <p>user-id:{comment.user_id}</p>
          </div>
        ))}
      </div>
      {account?(
        <><div>
          <select id="selectId" onChange={handleSelectChange}>
            {comments.map((comment) => (
              <option
                key={comment.id}
                value={comment.id}
                style={{
                  border: '1px solid #ccc',
                  padding: '10px',
                  margin: '10px 0'
                }}
              >
                {comment.content}
              </option>
            ))}
          </select>
        </div><p onClick={handleDelete}
          className="bg-sky-400 text-primary-foreground hover:bg-sky-400/90 border-sky-500 border-b-4 active:border-b-0"
        >
            選択中のコメントを削除
          </p></>):(
        <p>ログインしてくだいさい</p>
      )}
    </div>
  );
};



export default CommentSection;