'use client'

import { useEffect, useRef } from 'react'
import Spline from '@splinetool/react-spline'

export default function SplineScene({ sceneUrl, parentRef }) {
  const containerRef = useRef(null)
  const canvasRef = useRef(null)
  const rafRef = useRef(null)
  const lastX = useRef(0)
  const lastY = useRef(0)

  // Находим canvas после загрузки Spline
  useEffect(() => {
    const findCanvas = () => {
      if (containerRef.current) {
        const canvas = containerRef.current.querySelector('canvas')
        if (canvas) {
          canvasRef.current = canvas
          // Делаем canvas интерактивным
          canvas.style.pointerEvents = 'auto'
          return true
        }
      }
      return false
    }

    // Пытаемся найти canvas сразу
    if (!findCanvas()) {
      // Если не нашли, проверяем периодически
      const interval = setInterval(() => {
        if (findCanvas()) {
          clearInterval(interval)
        }
      }, 100)

      return () => clearInterval(interval)
    }
  }, [])

  // Обработка событий мыши на всей области родителя
  useEffect(() => {
    const parentElement = parentRef?.current
    if (!parentElement) return

    const handleMouseMove = (e) => {
      // Отменяем предыдущий RAF
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }

      // Используем requestAnimationFrame для оптимизации
      rafRef.current = requestAnimationFrame(() => {
        // Проверяем минимальное изменение (throttling)
        const deltaX = Math.abs(e.clientX - lastX.current)
        const deltaY = Math.abs(e.clientY - lastY.current)
        
        if (deltaX < 2 && deltaY < 2) {
          return
        }

        lastX.current = e.clientX
        lastY.current = e.clientY

        if (canvasRef.current) {
          try {
            // Получаем координаты относительно canvas
            const rect = canvasRef.current.getBoundingClientRect()
            const x = e.clientX - rect.left
            const y = e.clientY - rect.top

            // Создаем MouseEvent для canvas
            const mouseEvent = new MouseEvent('mousemove', {
              clientX: e.clientX,
              clientY: e.clientY,
              bubbles: true,
              cancelable: true,
              view: window,
            })

            // Отправляем событие напрямую в canvas
            canvasRef.current.dispatchEvent(mouseEvent)
          } catch (error) {
            // Тихая обработка ошибок
            if (process.env.NODE_ENV === 'development') {
              console.debug('Spline mouse event:', error)
            }
          }
        }
      })
    }

    // Слушаем события на родительском элементе (вся Hero секция)
    parentElement.addEventListener('mousemove', handleMouseMove, { passive: true })
    
    return () => {
      parentElement.removeEventListener('mousemove', handleMouseMove)
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [parentRef])

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 w-full h-full spline-container pointer-events-none" 
      style={{ 
        zIndex: 0,
        pointerEvents: 'none'
      }}
    >
      <Spline 
        scene={sceneUrl}
        onLoad={(spline) => {
          // После загрузки находим canvas
          if (containerRef.current) {
            const canvas = containerRef.current.querySelector('canvas')
            if (canvas) {
              canvasRef.current = canvas
              canvas.style.pointerEvents = 'auto'
            }
          }
        }}
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: 'none',
        }}
      />
    </div>
  )
}

