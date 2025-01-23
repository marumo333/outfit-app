import { db } from '@/app/actions/lib';
import { notFound } from 'next/navigation';

export default async function Item({
  params: { item },
}: {
  params: { item: string; }
}) {
  const post = await db.post.findUnique({
    where: {
      item,
    },
  });

  if (!item) {
    notFound();
  }

  return (
    <li className="w-1/4 h-auto p-1" key={item}>
    <a className="hover:opacity-50" href={item} target="_blank">
      <img className="object-cover max-h-32 w-full" src={item} />
    </a>
  </li>
  );
}