'use client'
import { useState, useEffect } from 'react'
import { supabase } from "@/utils/supabase/supabase"

interface Item {
    id: number
    title: string
    // 他の必要なフィールドを追加
}

export default function Todos() {
    const [items, setItems] = useState<Item[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function loadItems() {
            try {
                setIsLoading(true)
                const fetchedItames = await supabase.storage()
                if (fetchedItames) {
                    setItems(fetchedItames)
                } else {
                    setError("データの取得に失敗しました。")
                }
            } catch (err) {
                setError("エラーが発生しました: " + (err instanceof Error ? err.message : String(err)))
            } finally {
                setIsLoading(false)
            }
        }
        loadItems()
    }, [])

    if (isLoading) return <p>Loading...</p>
    if (error) return <p>Error: {error}</p>

    return (
        <ul>
            {items.map((item) => (
                <li key={item.id}>{item.title}</li>
            ))}
        </ul>
    )
}
