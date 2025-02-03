"use client"

import React, { useState, useEffect } from 'react';
import  supabase  from "@/utils/supabase/supabase";

interface Comment {
  id: number;
  content: string;
  created_at: string;
}

export   const CommentSection = ()=> {
  const [comment, setComment] = useState<string>('');
  const [comments, setComments] = useState<Comment[]>([]);

  const fetchComments = async () => {
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) console.error('Error fetching comments', error);
    else setComments(data||[]);
  };

  useEffect(() => {
    (async()=>{await fetchComments();
    })();
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
      setComments([...(data||[]),...comments]);
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
        {comments.map((comment) => (
          <div key={comment.id} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0' }}>
            <p>{comment.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};



export default CommentSection;