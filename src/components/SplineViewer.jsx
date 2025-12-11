'use client'

import { useEffect, useRef, useState } from 'react'

export default function SplineViewer({ url, mobileUrl }) {
  const containerRef = useRef(null)
  const [isMobile, setIsMobile] = useState(false)
  const [isReady, setIsReady] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    
    // Определяем, мобильное ли устройство
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [mounted])

  useEffect(() => {
    // Загружаем скрипт spline-viewer только на клиенте
    if (typeof window !== 'undefined' && !window.splineViewerLoaded) {
      const script = document.createElement('script')
      script.type = 'module'
      script.src = 'https://unpkg.com/@splinetool/viewer@1.12.6/build/spline-viewer.js'
      script.async = true
      document.head.appendChild(script)
      window.splineViewerLoaded = true
    }

    // Подавляем ошибки WebGL от Spline (они не критичны)
    if (typeof window !== 'undefined') {
      const originalError = console.error
      const originalWarn = console.warn
      
      console.error = (...args) => {
        const errorStr = args[0]?.toString?.() || ''
        // Игнорируем ошибки WebGL от Spline
        if (errorStr.includes('GL_INVALID') || 
            errorStr.includes('WebGL') ||
            errorStr.includes('Missing property') ||
            errorStr.includes('Framebuffer is incomplete') ||
            errorStr.includes('zero-size texture')) {
          return
        }
        originalError.apply(console, args)
      }

      console.warn = (...args) => {
        const warnStr = args[0]?.toString?.() || ''
        // Игнорируем предупреждения WebGL от Spline
        if (warnStr.includes('GL_INVALID') || 
            warnStr.includes('WebGL') ||
            warnStr.includes('Framebuffer')) {
          return
        }
        originalWarn.apply(console, args)
      }

      return () => {
        console.error = originalError
        console.warn = originalWarn
      }
    }
  }, [])

  useEffect(() => {
    if (!mounted) return
    
    // Ждем, пока контейнер получит размеры перед рендерингом Spline
    if (containerRef.current) {
      const checkSize = () => {
        const rect = containerRef.current.getBoundingClientRect()
        if (rect.width > 0 && rect.height > 0) {
          setIsReady(true)
        } else {
          // Повторяем проверку через небольшую задержку
          setTimeout(checkSize, 100)
        }
      }
      
      // Используем ResizeObserver для отслеживания изменений размера
      const resizeObserver = new ResizeObserver(() => {
        checkSize()
      })
      
      resizeObserver.observe(containerRef.current)
      checkSize()
      
      return () => {
        resizeObserver.disconnect()
      }
    }
  }, [mounted])

  // Выбираем URL в зависимости от устройства (только после монтирования)
  const sceneUrl = mounted && (isMobile && mobileUrl) ? mobileUrl : url

  // Не рендерим ничего до монтирования, чтобы избежать двойной загрузки
  if (!mounted) {
    return (
      <div 
        ref={containerRef}
        className="absolute inset-0 w-full h-full"
        style={{ 
          zIndex: 0,
          minWidth: '1px',
          minHeight: '1px',
        }}
      />
    )
  }

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 w-full h-full"
      style={{ 
        zIndex: 0,
        minWidth: '1px',
        minHeight: '1px',
      }}
    >
      {isReady && (
      <spline-viewer 
          key={sceneUrl}
          url={sceneUrl}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
        }}
      />
      )}
    </div>
  )
}

