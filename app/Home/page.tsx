"use client";

import { createClient } from "@supabase/supabase-js";
import  "../globals.css"


const projectUrl = "https://tkkavdiinrmmeeghllrr.supabase.co";
const apikey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRra2F2ZGlpbnJtbWVlZ2hsbHJyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY5OTI3NDcsImV4cCI6MjA1MjU2ODc0N30.XISx-SV_WFRf5WKepyZq9R4yOwrRT2koFpD8ZsHlXRg";
const supabase = createClient(projectUrl, apikey);


supabase.auth.onAuthStateChange((event, session) => {
  if (session && session.provider_token) {
    window.localStorage.setItem('oauth_provider_token', session.provider_token)
  }

  if (session && session.provider_refresh_token) {
    window.localStorage.setItem('oauth_provider_refresh_token', session.provider_refresh_token)
  }

  if (event === 'SIGNED_OUT') {
    window.localStorage.removeItem('oauth_provider_token')
    window.localStorage.removeItem('oauth_provider_refresh_token')
  }
})

export default function Home() {
  
  const signInGitHub = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'github'
    })
  }
  const signOutGithub = async () => {
    const { error } = await supabase.auth.signOut()
    if(error) throw new Error(error.message)
   
    
  }

  return (
  <div className="flex justify-center">
    <button onClick={signInGitHub} className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg">githubでログイン</button>
    
    <button onClick={signOutGithub} className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg">githubでログアウト</button>
    </div>
    
  );
}

