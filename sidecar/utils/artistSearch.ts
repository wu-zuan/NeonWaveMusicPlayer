// Shared artist image search utility
// Used by both main.ts IPC handler and DiscordRPCManager

export async function searchArtistImage(artistName: string): Promise<string | null> {
    try {
        // 1. Try Deezer
        const deezerUrl = `https://api.deezer.com/search/artist?q=${encodeURIComponent(artistName)}&limit=1`
        try {
            const resDeezer = await fetch(deezerUrl)
            if (resDeezer.ok) {
                const dataDeezer: any = await resDeezer.json()
                if (dataDeezer && dataDeezer.data && dataDeezer.data.length > 0) {
                    const pic = dataDeezer.data[0].picture_medium || dataDeezer.data[0].picture_big
                    if (pic) return pic
                }
            }
        } catch (err) {
            // Deezer failed, proceed to fallback
        }

        // 2. Fallback to iTunes (Album Art)
        const itunesUrl = `https://itunes.apple.com/search?term=${encodeURIComponent(artistName)}&media=music&entity=album&limit=1`
        const resItunes = await fetch(itunesUrl)
        if (resItunes.ok) {
            const dataItunes: any = await resItunes.json()
            if (dataItunes && dataItunes.results && dataItunes.results.length > 0) {
                const artwork = dataItunes.results[0].artworkUrl100
                if (artwork) {
                    return artwork.replace('100x100bb', '600x600bb')
                }
            }
        }

        // 3. Fallback to TheAudioDB (Test API)
        try {
            const audioDbUrl = `https://www.theaudiodb.com/api/v1/json/2/search.php?s=${encodeURIComponent(artistName)}`
            const resAudioDb = await fetch(audioDbUrl)
            if (resAudioDb.ok) {
                const dataAudioDb: any = await resAudioDb.json()
                if (dataAudioDb && dataAudioDb.artists && dataAudioDb.artists.length > 0) {
                    const artistObj = dataAudioDb.artists[0]
                    const pic = artistObj.strArtistThumb || artistObj.strArtistFanart
                    if (pic) return pic
                }
            }
        } catch (err) {
            // ignore
        }

        return null
    } catch (e) {
        console.error('Error fetching artist image:', e)
        return null
    }
}
