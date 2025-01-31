import {useState,useEffect} from "react";
import  supabase  from "@/utils/supabase/supabase";

interface commment{
    id: number,
    content:string,
    created_at:string,
}
export default function Comment(){
    const [comment,setComment] = useState<string>("")
    
    return(
        <>
        </>
    )
}