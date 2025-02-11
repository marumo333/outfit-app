"use client"

import React, { useState, useEffect } from 'react';
import  {supabase}  from "@/utils/supabase/supabase";
import { useSelector,useDispatch } from 'react-redux';
import { signOut } from "@/app/authSlice";
import {signIn} from "@/app/authSlice";
interface Comment {
  id: number;
  content: string;
  created_at: string;
}

export   const CommentSection = ()=> {
  const [comment, setComment] = useState<string>('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [selectId,setSelectId]=useState<number|null>(null);
  const auth = useSelector((state:any) => state.auth.isSignIn);
  const dispatch = useDispatch()
  const[user,setUser]= useState("")//ログイン情報を保持するステート
  useEffect(()=>{
      const{data:authListener} =supabase.auth.onAuthStateChange(
        (event,session)=>{
          console.log(event)
    if (session?.user) {
      setUser(session.user.email||"GitHub User")
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
      setUser("")//user情報をリセット
      dispatch(signOut());
        }
    }
  );
  //クリーンアップ処理追加（リスナー削除）
  return () =>{
    authListener?.subscription.unsubscribe();
  };
    },[dispatch]);

  const fetchComments = async () => {
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) console.error('Error fetching comments', error);
    else setComments(data||[]);
  };

  useEffect(() => {
    const getComments= async()=>{
      await fetchComments();
    }
    getComments();
  }, []);

  const handleCommentSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!comment.trim()) return;//無記名送信を避ける

    const { data, error } = await supabase
      .from('comments')
      .insert([{ content: comment }]);
   

    if (error) console.error('Error submitting comment', error);
    else {
      setComment('');
    }
    if(data){
      setComments([data[0],...comments]);//追加するコメントを先頭に配置
    }
  };

  const handleSelectChange=(event:React.ChangeEvent<HTMLSelectElement>)=>{
    setSelectId(Number(event.target.value))
  }

  const handleDelete=async()=>{
   if(selectId===null) return

   try{
    const {error} = await supabase
    .from('comments')
    .delete()
    .eq("id",selectId)//削除対象を特定

if(error) throw new Error("削除エラー",error)

  // UI更新（削除後に再取得 or フィルタリング）
  setComments(comments.filter(c => c.id !== selectId));
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
            <p>{comment.content}</p>
            <p>{comment.created_at}</p>
          </div>
        ))}
      </div>
      {user?(
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