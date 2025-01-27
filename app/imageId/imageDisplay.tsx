"use client"
import {useEffect,useState} from "react";
import { supabase } from "@/utils/supabase/supabase"

const ImageDisplay = ({ imagePath }: { imagePath: string }) => {
    const [imageUrl, setImageUrl] = useState<string | null>(null)
  
    useEffect(() => {
      const fetchImageUrl = async () => {
        const { data } = supabase.storage.from('oufit-image').getPublicUrl(imagePath)
        setImageUrl(data.publicUrl)
      }
  
      fetchImageUrl()
    }, [imagePath])
  
    if (!imageUrl) return <div>Loading...</div>
  
    return <img src={imageUrl} alt="Uploaded image" width={300} height={200} />
  }
export default ImageDisplay;