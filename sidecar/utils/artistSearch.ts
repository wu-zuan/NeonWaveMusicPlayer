// Shared artist image search utility
// Used by both main.ts IPC handler and DiscordRPCManager

import { fetchMusicApi } from './musicApi'

export async function searchArtistImage(artistName: string): Promise<string | null> {
    try {
        // 1. Try Deezer
        const dataDeezer = await fetchMusicApi(`https://api.deezer.com/search/artist?q=${encodeURIComponent(artistName)}&limit=1`)
        if (dataDeezer && dataDeezer.data && dataDeezer.data.length > 0) {
            const pic = dataDeezer.data[0].picture_medium || dataDeezer.data[0].picture_big
            if (pic) return pic
        }

        // 2. Fallback to iTunes (Album Art)
        const dataItunes = await fetchMusicApi(`https://itunes.apple.com/search?term=${encodeURIComponent(artistName)}&media=music&entity=album&limit=1`)
        if (dataItunes && dataItunes.results && dataItunes.results.length > 0) {
            const artwork = dataItunes.results[0].artworkUrl100
            if (artwork) {
                return artwork.replace('100x100bb', '600x600bb')
            }
        }

        // 3. Fallback to TheAudioDB (Test API)
        const dataAudioDb = await fetchMusicApi(`https://www.theaudiodb.com/api/v1/json/2/search.php?s=${encodeURIComponent(artistName)}`)
        if (dataAudioDb && dataAudioDb.artists && dataAudioDb.artists.length > 0) {
            const artistObj = dataAudioDb.artists[0]
            const pic = artistObj.strArtistThumb || artistObj.strArtistFanart
            if (pic) return pic
        }

        return null
    } catch (e) {
        console.error('Error fetching artist image:', e)
        return null
    }
}
