import { NextApiRequest, NextApiResponse } from 'next';
import  {supabase}  from "@/utils/supabase/supabase";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { code } = req.query;

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code as string);
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    return res.redirect('/private'); // 認証後のリダイレクト先
  }

  res.status(400).json({ error: 'No code provided' });
}