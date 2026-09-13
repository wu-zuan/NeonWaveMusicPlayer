import { useEffect, useState } from 'react'
import { subscribePlaybackTime } from '../utils/playbackClock'

export function usePlaybackTime(getMediaElement: () => HTMLMediaElement | null, enabled = true): number {
    const [time, setTime] = useState(0)
    useEffect(() => {
        if (!enabled) return
        const media = getMediaElement()
        if (media) return subscribePlaybackTime(media, setTime)
    }, [getMediaElement, enabled])
    return time
}
