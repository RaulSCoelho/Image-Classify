'use client'

import { useFirstRenderEffect } from '@/hooks/use-first-render-effect'
import { api } from '@/lib/api'
import { useState } from 'react'

export default async function Home() {
  const [predictions, setPredictions] = useState([])

  useFirstRenderEffect(() => {
    api.get('predictions/').then(response => {
      console.log(response)
      setPredictions([])
    })
  })

  return (
    <div>
      <h1>Hello world!</h1>
    </div>
  )
}
