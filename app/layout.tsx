import Header from "@/components/header"
import "./globals.css";
import {Provider} from "react-redux";
import store from './store';

const defaultURL = process.env.VERCEL_URL
? `https://${process.env.VERCEL_URL}`
: "http://localhost:3000";

export const metadata ={
  metadataBase: new URL(defaultURL),
  title: "Next.js and Supabase Starter Kit",
  description: "The fastest way to build apps with Next.js and Supabase",
};
export default function RootLayout({
  children,
}:{
  children:React.ReactNode;
}){
  return (
    <html lang="ja">
      <body className="bg-background text-foreground">
      <Provider store={store}>
        <Header></Header>
        <main className="min-h-screen flex flex-col items-center px2">
          {children}
        </main>
        </Provider>
      </body>
    </html>
  );
}
