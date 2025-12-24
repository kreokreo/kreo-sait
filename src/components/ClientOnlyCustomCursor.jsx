'use client'

import dynamic from 'next/dynamic'

const CustomCursor = dynamic(() => import('@/components/CustomCursor'), { 
  ssr: false,
  loading: () => null
})

export default function ClientOnlyCustomCursor() {
  return <CustomCursor />
}


