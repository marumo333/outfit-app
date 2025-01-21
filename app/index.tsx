import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase-client'

export default function Home() {
  const [session, setSession] = useState<object | null>()

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session)
      }
    )

    return () => {
      authListener.unsubscribe()
    }
  }, [])

  function signInWithGithub() {
    supabase.auth.signIn({ provider: 'github' })
  }

  function signOut() {
    supabase.auth.signOut()
  }

  return (
    <>
      {session ? (
        <button onClick={() => signOut()}>サインアウト</button>
      ) : (
        <button onClick={() => signInWithGithub()}>GitHubでログイン</button>
      )}
    </>
  )
}