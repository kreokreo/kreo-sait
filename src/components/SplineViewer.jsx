'use client'

import { useEffect, useRef } from 'react'

export default function SplineViewer({ url }) {
  const containerRef = useRef(null)

  useEffect(() => {
    // Загружаем скрипт spline-viewer только на клиенте
    if (typeof window !== 'undefined' && !window.splineViewerLoaded) {
      const script = document.createElement('script')
      script.type = 'module'
      script.src = 'https://unpkg.com/@splinetool/viewer@1.12.5/build/spline-viewer.js'
      script.async = true
      document.head.appendChild(script)
      window.splineViewerLoaded = true
    }
  }, [])

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 w-full h-full"
      style={{ 
        zIndex: 0,
      }}
    >
      <spline-viewer 
        url={url}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
        }}
      />
    </div>
  )
}

