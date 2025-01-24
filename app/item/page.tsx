"use client"
import { supabase } from "@/utils/supabase/supabase"
import {useState,useEffect} from "react";
import ImageDisplay from "./imageDisplay"

export default function Item(){
    const imageManager = () => {
        const [images, setImages] = useState<string[]>([])
      
        useEffect(() => {
          const fetchImages = async () => {
            const { data, error } = await supabase.storage.from('outfit-image').list('public')
            if (data) {
              setImages(data.map(file => `public/${file.name}`))
            }
          }
      
          fetchImages()
        }, [])
      
        return (
          <div>
            <h1>Image Manager</h1>
            <div>
              {images.map(imagePath => (
                <ImageDisplay key={imagePath} imagePath={imagePath} />
              ))}
            </div>
          </div>
        )
      }
}
