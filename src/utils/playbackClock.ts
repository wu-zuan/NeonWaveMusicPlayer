type PlaybackClockSource = Pick<HTMLMediaElement, 'currentTime' | 'addEventListener' | 'removeEventListener'>

const CLOCK_EVENTS = ['timeupdate', 'loadedmetadata', 'emptied', 'seeking', 'seeked', 'ended'] as const

// Subscribe only in UI components that display the clock. No polling loop is
// needed: media events keep seeks, resets and background playback in sync.
export function subscribePlaybackTime(media: PlaybackClockSource, onTime: (time: number) => void): () => void {
    const update = () => onTime(Number.isFinite(media.currentTime) ? media.currentTime : 0)
    for (const event of CLOCK_EVENTS) media.addEventListener(event, update)
    update()
    return () => {
        for (const event of CLOCK_EVENTS) media.removeEventListener(event, update)
    }
}
