"use client"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"

export function VisitorCounter() {
  const [count, setCount] = useState(1888) // 初始保底大数字

  useEffect(() => {
    const fetchCount = async () => {
      if (!supabase) return
      const { count: realCount } = await supabase
        .from("interactions")
        .select("*", { count: "exact", head: true })
      
      if (realCount !== null) {
        setCount(1888 + realCount)
      }
    }
    fetchCount().catch(() => {})
  }, [])

  return (
    <div className="text-[10px] font-mono text-muted-foreground opacity-50 mt-4">
      已有 {count} 位损友试图挑战现实
    </div>
  )
}