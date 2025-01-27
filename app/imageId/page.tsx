import React, { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai"
import { supabase } from '@/utils/supabase/supabase'
import { DateTime } from 'luxon'
type props={
    photoData:publicPhoto
}

export const imageId:React.FC<props>=({pthotoData})=>{
    const [comment,setComment]=useState<string>('')
    const {
        profile
    } = useUser()
}