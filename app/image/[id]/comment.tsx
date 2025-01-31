"use client"

import {useState,useEffect} from "react";
import  supabase  from "@/utils/supabase/supabase";
import { v4 as uuid4 } from "uuid";

interface Comment{
    id: number,
    content:string,
    created_at:string,
}
const Comment=()=>{
    const [comment,setComment] = useState<string>("")
    const [comments,setComments] =useState<Comment[]>([])
    
    const fetchComments = async()=>{
        const {data,error} = await supabase
        .from('comments')
        .select('*')
        .order('created_at', {ascending:false});
        if (error ) console.error ("コメントを取得できませんでした",error)
            
            else setComments(data);
    };
    useEffect(()=>{
        fetchComments();
    },[]);

    const handleSubmit = async(event:React.FormEvent<HTMLFormElement>)=>{
        event.preventDefault();
        const [data,error] = await supabase
        .from('commnets')
        .insert([
            {content:comment}
        ]);
        if (error) console.error('送信エラー',error);
        else{
            setComments('');
            fetchComments();
        }
    }
    return(
        <div>
            <h1>comments</h1>
            <form onSubmit={handleSubmit}>
                <textarea
                value={comment}
                onChange={e=>setComments(e.target.value)}
                placeholder="コメントを投稿"
                />
                <button type="submit">コメントを投稿</button> 
            </form>
            <ul>
                {comments.map((comment)=>{
                    <li key ={comment.id} style={{border: '1px solid #ccc',padding:'10px',margin:'10px0'}}>
                        <p>{comment.content}</p>
                        </li>
                })}
            </ul>
        </div>
    )
}
export default Comment;