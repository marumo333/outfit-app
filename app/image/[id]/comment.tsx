'use client';

import React, { useState, useEffect } from 'react';
import supabase from '../../supabaseClient';

interface Comment {
  id: number;
  content: string;
  created_at: string;
}

const Page = () => {
  const [comment, setComment] = useState<string>('');
  const [comments, setComments] = useState<Comment[]>([]);

  const fetchComments = async () => {
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) console.error('Error fetching comments', error);
    else setComments(data);
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const handleCommentSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { data, error } = await supabase
      .from('comments')
      .insert([
        { content: comment }
      ]);

    if (error) console.error('Error submitting comment', error);
    else {
      setComment('');
      fetchComments();
    }
  };

  return (
    <div>
      <h1>Comments</h1>
      <form onSubmit={handleCommentSubmit}>
        <textarea
          value={comment}
          onChange={e => setComment(e.target.value)}
          placeholder="Write a comment..."
        />
        <button type="submit">Post Comment</button>
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

export default Page;

