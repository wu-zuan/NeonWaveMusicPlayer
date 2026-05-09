import React, { useState, useEffect, useRef } from 'react'
import styles from './AudioRadar.module.css'

interface AudioRadarProps {
    onSetPosition: (x: number, y: number, z: number) => void
    currentX?: number
    currentZ?: number
}

export const AudioRadar: React.FC<AudioRadarProps> = ({ onSetPosition, currentX = 0, currentZ = 0 }) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const [dragging, setDragging] = useState(false)

    
    const [pos, setPos] = useState({ x: currentX, z: currentZ })

    useEffect(() => {
        if (!dragging) {
            setPos({ x: currentX, z: currentZ })
        }
    }, [currentX, currentZ, dragging])

    const handleMouseDown = (e: React.MouseEvent) => {
        setDragging(true)
        updatePosition(e)
    }

    const handleMouseMove = (e: MouseEvent) => {
        if (dragging) {
            updatePosition(e)
        }
    }

    const handleMouseUp = () => {
        setDragging(false)
    }

    const updatePosition = (e: MouseEvent | React.MouseEvent) => {
        if (!containerRef.current) return

        const rect = containerRef.current.getBoundingClientRect()
        const clickX = e.clientX - rect.left
        const clickY = e.clientY - rect.top

        
        

        const range = 10 

        
        
        
        
        const centerX = rect.width / 2
        const rawX = (clickX - centerX) / (centerX) * range

        
        
        
        
        
        
        const centerY = rect.height / 2
        const rawZ = (clickY - centerY) / (centerY) * range

        
        const clamp = (v: number) => Math.max(-range, Math.min(range, v))
        const x = clamp(rawX)
        const z = clamp(rawZ)

        setPos({ x, z })
        onSetPosition(x, 0, z) 
    }

    useEffect(() => {
        if (dragging) {
            window.addEventListener('mousemove', handleMouseMove)
            window.addEventListener('mouseup', handleMouseUp)
        } else {
            window.removeEventListener('mousemove', handleMouseMove)
            window.removeEventListener('mouseup', handleMouseUp)
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove)
            window.removeEventListener('mouseup', handleMouseUp)
        }
    }, [dragging])

    const handleReset = (e: React.MouseEvent) => {
        e.stopPropagation()
        onSetPosition(0, 0, 0)
        setPos({ x: 0, z: 0 })
    }

    
    const range = 10
    const leftPct = 50 + (pos.x / range) * 50
    const topPct = 50 + (pos.z / range) * 50

    return (
        <div
            className={styles.radarContainer}
            ref={containerRef}
            onMouseDown={handleMouseDown}
        >
            <div className={styles.grid} />
            <div className={styles.listener} />

            <div
                className={styles.source}
                style={{ left: `${leftPct}%`, top: `${topPct}%` }}
            />

            <button className={styles.resetBtn} onClick={handleReset}>
                重置位置
            </button>
        </div>
    )
}
