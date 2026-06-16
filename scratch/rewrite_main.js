import fs from 'fs';

const mainPath = 'd:/開發/鑽石託管/music/electron/main.ts';
let code = fs.readFileSync(mainPath, 'utf8');

const targetStart = `  ipcMain.handle('search:lyrics', async (_, title, artist, filePath, duration, aiConfig) => {`;
const startIndex = code.indexOf(targetStart);
if (startIndex === -1) {
  console.error("Could not find start of search:lyrics handler!");
  process.exit(1);
}

let openBrackets = 1;
let endIndex = startIndex + targetStart.length;
while (openBrackets > 0 && endIndex < code.length) {
  if (code[endIndex] === '{') openBrackets++;
  else if (code[endIndex] === '}') openBrackets--;
  endIndex++;
}

console.log(`Found search:lyrics block from index ${startIndex} to ${endIndex}`);

const newHandler = `  ipcMain.handle('search:lyrics', async (_, title, artist, filePath, duration, aiConfig) => {
    try {
      const getArtistTitle = createRequire(import.meta.url)('get-artist-title')

      console.log(\`[Lyrics] Search Request: Title="\${title}", Artist="\${artist}", Duration=\${duration}, AIConfig=\${JSON.stringify(aiConfig || {})}\`)

      // --- 1. Local Cache Check ---
      if (filePath) {
        try {
          const extName = path.extname(filePath)
          const lrcPath = filePath.substring(0, filePath.length - extName.length) + '.lrc'
          try {
            await fs.promises.access(lrcPath)
            const cachedLrc = await fs.promises.readFile(lrcPath, 'utf8')
            if (cachedLrc && cachedLrc.trim().length > 0) {
              console.log(\`[Lyrics] Found local cached LRC at: \${lrcPath}\`)
              return convertToSimplified(cachedLrc)
            }
          } catch (e) {
            // Local file doesn't exist
          }
        } catch (err) {
          console.error('[Lyrics] Error accessing local cache:', err)
        }
      }

      // --- Helper to save result to local cache ---
      const saveToLocalCache = async (lyricsText: string) => {
        if (filePath && lyricsText) {
          try {
            const extName = path.extname(filePath)
            const lrcPath = filePath.substring(0, filePath.length - extName.length) + '.lrc'
            await fs.promises.writeFile(lrcPath, lyricsText, 'utf8')
            console.log(\`[Lyrics] Cached lrc locally to: \${lrcPath}\`)
          } catch (e) {
            console.error('[Lyrics] Failed to write local cache file:', e)
          }
        }
      }

      // --- 2. Database Search Setup (LRCLib / Netease) ---
      const getDurationDiff = (candDur: number, targetDur?: number) => {
        if (!targetDur) return 0 
        return Math.abs(candDur - targetDur)
      }

      const searchLrcLib = async (q: string, targetDur?: number) => {
        try {
          const url = \`https://lrclib.net/api/search?q=\${encodeURIComponent(q)}\`
          const res = await fetch(url, { signal: AbortSignal.timeout(5000) })
          if (!res.ok) return []
          const list: any[] = await res.json()

          if (!Array.isArray(list)) return []

          return list
            .filter(t => t.syncedLyrics && t.syncedLyrics.length > 0)
            .map(t => ({
              source: 'LRCLib',
              id: t.id,
              track: t.trackName,
              artist: t.artistName,
              duration: t.duration, 
              lyrics: t.syncedLyrics,
              diff: targetDur ? getDurationDiff(t.duration, targetDur) : 0
            }))
        } catch (e) {
          console.error("LRCLib Error:", e)
          return []
        }
      }

      const searchNetease = async (q: string, targetDur?: number) => {
        try {
          const searchUrl = \`https://music.163.com/api/search/get/web?s=\${encodeURIComponent(q)}&type=1&offset=0&total=true&limit=5\`
          const res = await fetch(searchUrl, {
            headers: { 'Referer': 'https://music.163.com/', 'Cookie': 'appver=2.0.2' },
            signal: AbortSignal.timeout(5000)
          })
          if (!res.ok) return []
          const data: any = await res.json()

          if (!data.result || !data.result.songs) return []

          let candidates = data.result.songs.map((s: any) => ({
            id: s.id,
            track: s.name,
            artist: s.artists?.[0]?.name || 'Unknown',
            duration: s.duration / 1000, 
            diff: targetDur ? getDurationDiff(s.duration / 1000, targetDur) : 0
          }))

          if (targetDur) {
            candidates = candidates.filter((c: any) => c.diff <= 15)
            candidates.sort((a: any, b: any) => a.diff - b.diff)
          }

          if (candidates.length === 0) return []

          const best = candidates[0]
          const lyricUrl = \`https://music.163.com/api/song/lyric?id=\${best.id}&lv=1&kv=1&tv=-1\`
          const lrcRes = await fetch(lyricUrl, {
            headers: { 'Referer': 'https://music.163.com/', 'Cookie': 'appver=2.0.2' },
            signal: AbortSignal.timeout(5000)
          })
          const lrcData: any = await lrcRes.json()

          if (lrcData.lrc && lrcData.lrc.lyric) {
            return [{
              source: 'Netease',
              id: best.id,
              track: best.track,
              artist: best.artist,
              duration: best.duration,
              lyrics: lrcData.lrc.lyric,
              diff: best.diff
            }]
          }
        } catch (e) {
          console.error("Netease Error:", e)
        }
        return []
      }

      let candidates: any[] = []

      // Run traditional strategies
      if (title && artist) {
        const query = \`\${title} \${artist}\`
        console.log(\`[Lyrics] Strategy A: \${query}\`)

        const [lrcLibRes, neteaseRes] = await Promise.all([
          searchLrcLib(query, duration),
          searchNetease(query, duration)
        ])
        candidates.push(...lrcLibRes, ...neteaseRes)
      }

      const cTitle = cleanString(title)
      const cArtist = cleanString(artist)
      if (cTitle && (cTitle !== title || cArtist !== artist)) {
        const query = \`\${cTitle} \${cArtist}\`
        console.log(\`[Lyrics] Strategy B: \${query}\`)
        const [lrcLibRes, neteaseRes] = await Promise.all([
          searchLrcLib(query, duration),
          searchNetease(query, duration)
        ])
        candidates.push(...lrcLibRes, ...neteaseRes)
      }

      if (filePath) {
        let filename = path.basename(filePath, path.extname(filePath))
        const promises: Promise<any[]>[] = []

        const varietyMatch = filename.match(/(.+?)《(.+?)》(.*)/)
        if (varietyMatch) {
          const rawArtist = varietyMatch[1] 
          const rawTitle = varietyMatch[2]  

          const cA = cleanString(rawArtist).replace(/合唱/g, '').trim()
          const cT = cleanString(rawTitle)

          if (cT) {
            const query = \`\${cT} \${cA}\`
            console.log(\`[Lyrics] Strategy C-0 (Variety Pattern): \text \${query}\`)
            promises.push(searchLrcLib(query, duration))
            promises.push(searchNetease(query, duration))

            if (cA.length > 0) {
              console.log(\`[Lyrics] Strategy C-0 (Title + Duration): \${cT}\`)
              promises.push(searchLrcLib(cT, duration))
              promises.push(searchNetease(cT, duration))
            }
          }
        }

        const parsed = getArtistTitle(filename.replace(/_/g, ' '))
        if (parsed && parsed.length === 2) {
          const [a, t] = parsed
          const query = \`\${t} \${a}\`
          console.log(\`[Lyrics] Strategy C-1 (Parsed): \${query}\`)
          promises.push(searchLrcLib(query, duration))
          promises.push(searchNetease(query, duration))
        }

        const cFilename = cleanString(filename)
        console.log(\`[Lyrics] Strategy C-2 (Raw Cleaned): \${cFilename}\`)
        promises.push(searchLrcLib(cFilename, duration))
        promises.push(searchNetease(cFilename, duration))

        const resultsList = await Promise.all(promises)
        resultsList.forEach(res => {
          candidates.push(...res)
        })
      }

      // Check if we got a valid database candidate
      let bestMatch: any = null
      if (candidates.length > 0) {
        const unique = new Map()
        candidates.forEach(c => {
          const key = \`\${c.source}-\\/\${c.id}\`
          if (!unique.has(key)) unique.set(key, c)
        })
        let finalPool = Array.from(unique.values())

        // Calculate title matching scores
        const targetTitleClean = cleanString(title)
        finalPool.forEach((c: any) => {
          c.titleScore = getTitleMatchScore(c.track, targetTitleClean)
        })

        if (duration && duration > 0) {
          const strictMatches = finalPool.filter(c => c.diff <= 4)
          if (strictMatches.length > 0) {
            console.log(\`[Lyrics] Calibration: Found \${strictMatches.length} strict duration matches.\`)
            finalPool = strictMatches
          } else {
            const lenientMatches = finalPool.filter(c => c.diff <= 10)
            if (lenientMatches.length > 0) {
              console.log(\`[Lyrics] Calibration: Found \${lenientMatches.length} lenient duration matches.\`)
              finalPool = lenientMatches
            } else {
              console.log(\`[Lyrics] Calibration: No duration matches found.\`)
            }
          }
        }

        finalPool.sort((a, b) => {
          const scoreDiff = b.titleScore - a.titleScore
          if (Math.abs(scoreDiff) > 0.2) {
            return scoreDiff // Higher score first
          }
          return a.diff - b.diff
        })

        const topCand = finalPool[0]
        // If the best match is reasonably named, we select it
        if (topCand && topCand.titleScore >= 0.55) {
          bestMatch = topCand
        }
      }

      if (bestMatch) {
        console.log(\`[Lyrics] Selected from DB: \${bestMatch.track} (\${bestMatch.artist}) [\${bestMatch.source}] Diff=\${bestMatch.diff.toFixed(2)}s, TitleScore=\${bestMatch.titleScore.toFixed(2)}\`)
        let finalLyrics = convertToSimplified(bestMatch.lyrics)
        if (finalLyrics && duration && bestMatch.duration && Math.abs(duration - bestMatch.duration) > 2.0 && Math.abs(duration - bestMatch.duration) < 30.0) {
          if (aiConfig && aiConfig.provider && aiConfig.provider !== 'default') {
            console.log(\`[Lyrics AI] Triggering AI-driven timeline calibration. Original: \${bestMatch.duration}s, Target: \${duration}s\`)
            try {
              const calibrationSystemPrompt = "You are a professional lyrics synchronization tool.\\nYou will receive an LRC synced lyrics text. Your task is to adjust all timestamps (e.g. [01:23.45]) to fit the target audio duration of " + Math.floor(duration) + " seconds. The original duration of this LRC text is " + Math.round(bestMatch.duration) + " seconds.\\nIf the target version has a longer or shorter intro/outro, apply a uniform mathematical shift, or stretch the timestamps proportionally so that the lyric lines align correctly from start to finish.\\nReturn ONLY the adjusted LRC lyrics. DO NOT wrap the output in markdown code blocks (\`\`\`) or include any explanations."

              const calibrationUserPrompt = "Please adjust these LRC lyrics to fit target duration " + Math.floor(duration) + "s (original is " + Math.round(bestMatch.duration) + "s):\\n\\n" + finalLyrics

              let aiCalibrated: string | null = null
              
              const provider = aiConfig.provider
              const apiKey = aiConfig.apiKey || ''
              const endpoint = aiConfig.endpoint || ''
              const model = aiConfig.model || ''
              
              if (provider === 'gemini') {
                const finalModel = model || 'gemini-1.5-flash'
                const url = endpoint || \`https://generativelanguage.googleapis.com/v1beta/models/\${finalModel}:generateContent?key=\${apiKey}\`
                const response = await fetch(url, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    contents: [{ parts: [{ text: calibrationSystemPrompt + "\\n\\n" + calibrationUserPrompt }] }]
                  }),
                  signal: AbortSignal.timeout(10000)
                })
                if (response.ok) {
                  const resJson: any = await response.json()
                  aiCalibrated = resJson.candidates?.[0]?.content?.parts?.[0]?.text || null
                }
              } else if (provider === 'claude') {
                const finalModel = model || 'claude-3-5-sonnet-20241022'
                const url = endpoint || 'https://api.anthropic.com/v1/messages'
                const response = await fetch(url, {
                  method: 'POST',
                  headers: {
                    'x-api-key': apiKey,
                    'anthropic-version': '2023-06-01',
                    'content-type': 'application/json'
                  },
                  body: JSON.stringify({
                    model: finalModel,
                    max_tokens: 4000,
                    system: calibrationSystemPrompt,
                    messages: [{ role: 'user', content: calibrationUserPrompt }]
                  }),
                  signal: AbortSignal.timeout(10000)
                })
                if (response.ok) {
                  const resJson: any = await response.json()
                  aiCalibrated = resJson.content?.[0]?.text || null
                }
              } else {
                let finalEndpoint = endpoint
                if (!finalEndpoint) {
                  if (provider === 'openai' || provider === 'chatgpt') finalEndpoint = 'https://api.openai.com/v1/chat/completions'
                  else if (provider === 'openrouter') finalEndpoint = 'https://openrouter.ai/api/v1/chat/completions'
                  else if (provider === 'ollama') finalEndpoint = 'http://localhost:11434/v1/chat/completions'
                  else if (provider === 'opwebui') finalEndpoint = 'http://localhost:3000/api/v1/chat/completions'
                } else {
                  if (!finalEndpoint.endsWith('/chat/completions')) {
                    finalEndpoint = finalEndpoint.endsWith('/') ? finalEndpoint + 'chat/completions' : finalEndpoint + '/chat/completions'
                  }
                }
                const finalModel = model || (
                  provider === 'openai' ? 'gpt-4o-mini' :
                  provider === 'openrouter' ? 'meta-llama/llama-3-8b-instruct:free' :
                  provider === 'ollama' ? 'llama3' :
                  provider === 'opwebui' ? 'llama3' : ''
                )
                const requestBody: any = {
                  model: finalModel,
                  messages: [
                    { role: 'system', content: calibrationSystemPrompt },
                    { role: 'user', content: calibrationUserPrompt }
                  ]
                }
                requestBody.reasoning_effort = 'none'
                requestBody.reasoningEffort = 'none'
                
                const response = await fetch(finalEndpoint, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    ...(apiKey ? { 'Authorization': \`Bearer \${apiKey}\` } : {})
                  },
                  body: JSON.stringify(requestBody),
                  signal: AbortSignal.timeout(10000)
                })
                if (response.ok) {
                  const resJson: any = await response.json()
                  aiCalibrated = resJson.choices?.[0]?.message?.content || null
                }
              }

              if (aiCalibrated) {
                let cleanedCal = aiCalibrated.trim()
                cleanedCal = cleanedCal.replace(/\`\`\`(?:lrc|ini|txt|)?\\n([\\s\\S]*?)\\n\`\`\`/g, '$1')
                cleanedCal = cleanedCal.replace(/\`\`\`([\\s\\S]*?)\`\`\`/g, '$1')
                cleanedCal = cleanedCal.trim()
                if (cleanedCal && cleanedCal.includes('[')) {
                  console.log(\`[Lyrics AI] AI-driven calibration succeeded.\`)
                  finalLyrics = convertToSimplified(cleanedCal)
                }
              }
            } catch (calErr) {
              console.error('[Lyrics AI] AI-driven calibration failed, falling back to math offset:', calErr)
              const autoOffsetMs = Math.round((duration - bestMatch.duration) * 1000)
              finalLyrics = \`[offset:\${autoOffsetMs}]\\n\` + finalLyrics
            }
          } else {
            const autoOffsetMs = Math.round((duration - bestMatch.duration) * 1000)
            finalLyrics = \`[offset:\${autoOffsetMs}]\\n\` + finalLyrics
          }
        }
        if (finalLyrics) {
          await saveToLocalCache(finalLyrics)
          return finalLyrics
        }
      }

      // --- 3. AI Lyrics Fallback Generation (Only if DB search failed) ---
      if (aiConfig && aiConfig.provider && aiConfig.provider !== 'default') {
        console.log(\`[Lyrics] DB search failed or score too low. Falling back to AI lyrics generation...\`)
        try {
          let searchInfo = {
            title: title || '',
            artist: artist || '',
            filename: filePath ? path.basename(filePath) : ''
          }

          if (filePath && (aiConfig.mode === 'audio' || aiConfig.mode === 'audio_filename')) {
            try {
              const mm = createRequire(import.meta.url)('music-metadata')
              const metadata = await mm.parseFile(filePath, { skipCovers: true })
              if (metadata.common.title) searchInfo.title = metadata.common.title
              if (metadata.common.artist) searchInfo.artist = metadata.common.artist
            } catch (err) {
              console.warn('[Lyrics] Failed to read ID3 tags for AI search:', err)
            }
          }

          const parsedSong = parseChineseSongInfo(searchInfo.filename || searchInfo.title)
          const cleanTitle = cleanString(parsedSong.title || searchInfo.title)
          const cleanArtist = cleanString(parsedSong.artist || searchInfo.artist)
          const cleanFilename = cleanString(searchInfo.filename)

          let promptDetails = ""
          if (aiConfig.mode === 'filename') {
            promptDetails += \`- Cleaned Track Title: "\${cleanTitle}"\\n- Cleaned Artist: "\${cleanArtist}"\\n- Raw Filename: "\${searchInfo.filename || searchInfo.title}"\\n\`
          } else if (aiConfig.mode === 'audio') {
            promptDetails += \`- Cleaned Track Title: "\${cleanTitle}"\\n- Cleaned Artist: "\${cleanArtist}"\\n- Raw Track Title: "\${searchInfo.title}"\\n- Raw Artist: "\${searchInfo.artist}"\\n\`
          } else {
            promptDetails += \`- Cleaned Track Title: "\${cleanTitle}"\\n- Cleaned Artist: "\${cleanArtist}"\\n- Cleaned Filename: "\${cleanFilename}"\\n- Raw Track Title: "\${searchInfo.title}"\\n- Raw Artist: "\${searchInfo.artist}"\\n- Raw Filename: "\${searchInfo.filename}"\\n\`
          }

          if (duration) {
            promptDetails += \`- Song Duration: \text \${Math.floor(duration)} seconds\\n\`
          }

          const systemPrompt = "You are a synchronized lyrics database. You MUST output ONLY the synced LRC lyrics with [mm:ss.xx] timestamps for the requested song. No explanations, no markdown blocks.\\nCRITICAL: If you do not know the exact, real lyrics of the song, or if you are not 100% sure of the correct lyrics, you MUST output exactly: \\"Lyrics not found\\". DO NOT hallucinate, invent, or make up lyrics under any circumstances."

          const userPrompt = "Please find or generate the synchronized lyrics (LRC format) for this song.\\nThe lyrics MUST contain precise timestamps in the [minutes:seconds.hundredths] format (e.g., [00:12.34]).\\n\\nSong details:\\n" + promptDetails + "\\n\\nCRITICAL REQUIREMENTS:\\n1. Output ONLY the raw LRC content.\\n2. DO NOT wrap the output in markdown code blocks (\`\`\`), HTML, or any other explanations.\\n3. If this is a cover version (翻唱), ensure the lyrics and timestamps match this version, particularly aligning with the total duration of " + (duration ? Math.floor(duration) : 'unknown') + " seconds. Adjust the spacing and timestamps of the lines so they fit naturally from the beginning to the end of the song duration.\\n4. If you absolutely cannot find or generate any lyrics, output exactly: \\"Lyrics not found\\"."

          const provider = aiConfig.provider
          const apiKey = aiConfig.apiKey || ''
          const endpoint = aiConfig.endpoint || ''
          const model = aiConfig.model || ''
          
          let aiOutput: string | null = null
          console.log(\`[Lyrics AI] Calling provider: \${provider}, model: \${model}\`)

          if (provider === 'gemini') {
            const finalModel = model || 'gemini-1.5-flash'
            const url = endpoint || \`https://generativelanguage.googleapis.com/v1beta/models/\${finalModel}:generateContent?key=\${apiKey}\`
            const response = await fetch(url, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                contents: [{ parts: [{ text: systemPrompt + "\\n\\n" + userPrompt }] }]
              })
            })
            if (!response.ok) {
              const errText = await response.text()
              throw new Error(\`Gemini API error: \${response.status} - \${errText}\`)
            }
            const resJson: any = await response.json()
            aiOutput = resJson.candidates?.[0]?.content?.parts?.[0]?.text || null
          } else if (provider === 'claude') {
            const finalModel = model || 'claude-3-5-sonnet-20241022'
            const url = endpoint || 'https://api.anthropic.com/v1/messages'
            const response = await fetch(url, {
              method: 'POST',
              headers: {
                'x-api-key': apiKey,
                'anthropic-version': '2023-06-01',
                'content-type': 'application/json'
              },
              body: JSON.stringify({
                model: finalModel,
                max_tokens: 4000,
                system: systemPrompt,
                messages: [{ role: 'user', content: userPrompt }]
              })
            })
            if (!response.ok) {
              const errText = await response.text()
              throw new Error(\`Claude API error: \${response.status} - \${errText}\`)
            }
            const resJson: any = await response.json()
            aiOutput = resJson.content?.[0]?.text || null
          } else {
            let finalEndpoint = endpoint
            if (!finalEndpoint) {
              if (provider === 'openai' || provider === 'chatgpt') finalEndpoint = 'https://api.openai.com/v1/chat/completions'
              else if (provider === 'openrouter') finalEndpoint = 'https://openrouter.ai/api/v1/chat/completions'
              else if (provider === 'ollama') finalEndpoint = 'http://localhost:11434/v1/chat/completions'
              else if (provider === 'opwebui') finalEndpoint = 'http://localhost:3000/api/v1/chat/completions'
            } else {
              if (!finalEndpoint.endsWith('/chat/completions')) {
                finalEndpoint = finalEndpoint.endsWith('/') ? finalEndpoint + 'chat/completions' : finalEndpoint + '/chat/completions'
              }
            }
            const finalModel = model || (
              provider === 'openai' ? 'gpt-4o-mini' :
              provider === 'openrouter' ? 'meta-llama/llama-3-8b-instruct:free' :
              provider === 'ollama' ? 'llama3' :
              provider === 'opwebui' ? 'llama3' : ''
            )

            const headers: any = { 'Content-Type': 'application/json' }
            if (apiKey) {
              headers['Authorization'] = \`Bearer \${apiKey}\`
            }

            const requestBody: any = {
              model: finalModel,
              messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt }
              ]
            }

            if (aiConfig && aiConfig.reasoning && aiConfig.reasoning !== 'default') {
              requestBody.reasoning_effort = aiConfig.reasoning
              requestBody.reasoningEffort = aiConfig.reasoning
            }

            const response = await fetch(finalEndpoint, {
              method: 'POST',
              headers,
              body: JSON.stringify(requestBody),
              signal: AbortSignal.timeout(30000)
            })

            if (!response.ok) {
              const errText = await response.text()
              throw new Error(\`AI API error (\${provider}): \${response.status} - \${errText}\`)
            }

            const resJson: any = await response.json()
            aiOutput = resJson.choices?.[0]?.message?.content || null
          }

          if (aiOutput) {
            let cleaned = aiOutput.trim()
            cleaned = cleaned.replace(/\`\`\`(?:lrc|ini|txt|)?\\n([\\s\\S]*?)\\n\`\`\`/g, '$1')
            cleaned = cleaned.replace(/\`\`\`([\\s\\S]*?)\`\`\`/g, '$1')
            cleaned = cleaned.trim()

            if (cleaned && !cleaned.toLowerCase().includes('lyrics not found') && cleaned.includes('[')) {
              const simplifiedLrc = convertToSimplified(cleaned)
              if (simplifiedLrc) {
                console.log(\`[Lyrics AI] Successfully generated lyrics via AI fallback.\`)
                await saveToLocalCache(simplifiedLrc)
                return simplifiedLrc
              }
            }
          }
        } catch (err) {
          console.error('[Lyrics AI] Failed to generate fallback lyrics via AI:', err)
        }
      }

      console.log("[Lyrics] No lyrics found via DB or AI.")
      return null

    } catch (e) {
      console.error('Error fetching lyrics:', e)
      return null
    }
  })`;

const updatedCode = code.substring(0, startIndex) + newHandler + code.substring(endIndex);
fs.writeFileSync(mainPath, updatedCode, 'utf8');
console.log("Successfully rewrote main.ts!");
