"use client"
import { supabase } from "@/utils/supabase/supabase"
import { useState, useEffect } from "react";
import ImageDisplay from "./imageDisplay"

export default function Item() {

    const [images, setImages] = useState<string[]>([])

    useEffect(() => {
        const fetchImages = async () => {
            const { data, error } = await supabase.storage.from('outfit-image').list('public')
            if (data) {
                setImages(data.map(file => `public/${file.name}`))
            }
            if (error) {
                console.error("Error fetching images:", error.message);
            } else if (data) {
                setImages(data.map((file) => `public/${file.name}`));
            }
        }

        fetchImages()
    }, [])

    return (
        <form className="imageManager">
            <h1>Image Manager</h1>
            <div>
                {images.map(imagePath => (
                    <ImageDisplay key={imagePath} imagePath={imagePath} />
                ))}
            </div>
        </form>
    )
}
