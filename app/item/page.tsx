import { db } from '@/app/actions/lib';
import { notFound } from 'next/navigation';

export default async function Item({
  params: { id },
}: {
  params: { id: string; }
}) {
  const post = await db.post.findUnique({
    where: {
      id,
    },
  });

  if (!post) {
    notFound();
  }

  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.body}</p>
    </article>
  );
}