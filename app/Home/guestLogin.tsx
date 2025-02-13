import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';
import { useNavigate } from 'react-router-dom';


export default function(){
    const navigate = useNavigate();
    const guestSignIn=()=>{
        navigate("/Home")
    }

    return(
        <>
        <button className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-4 rounded-lg" onClick={guestSignIn}>
            ゲストログイン
            </button>
        </>
    )
}