import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';
import { useNavigate } from 'react-router-dom';


export default function(){
    const navigate =useNavigate();
    const guestSignIn=()=>{
        navigate("/private")
    }

    return(
        <>
        <button className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg" onClick={guestSignIn}>
            ゲストログイン
            </button>
        </>
    )
}