export const AUDIO_SETTINGS_KEY = 'nw_audio_settings'
export const AUTO_FOCUS_KEY = 'neonwave_auto_focus'

export const SPACE_MODES = ['none', 'room', 'hall', 'concert', 'tetr'] as const
export type SpaceMode = typeof SPACE_MODES[number]
export interface AudioSettings {
    spaceMode: SpaceMode
    distance: number
    position: { x: number; y: number; z: number }
    focus: boolean
}

export function spacePreset(spaceMode: SpaceMode): AudioSettings {
    const distance = { none: 0, room: 2.5, hall: 5, concert: 7.5, tetr: 1 }[spaceMode]
    const z = { none: 0, room: -2, hall: -3.5, concert: 0, tetr: -1 }[spaceMode]
    return { spaceMode, distance, position: { x: 0, y: 0, z }, focus: false }
}

export function readAudioSettings(raw: string | null): AudioSettings {
    try {
        const saved = JSON.parse(raw || '{}')
        const mode: SpaceMode = SPACE_MODES.includes(saved.spaceMode) ? saved.spaceMode : 'none'
        const defaults = spacePreset(mode)
        const bounded = (value: unknown, min: number, max: number, fallback: number) =>
            typeof value === 'number' && Number.isFinite(value) ? Math.max(min, Math.min(max, value)) : fallback
        return {
            spaceMode: mode,
            distance: bounded(saved.distance, 0, 10, defaults.distance),
            position: {
                x: bounded(saved.position?.x, -10, 10, defaults.position.x),
                y: bounded(saved.position?.y, -10, 10, defaults.position.y),
                z: bounded(saved.position?.z, -10, 10, defaults.position.z)
            },
            focus: saved.focus === true
        }
    } catch { return spacePreset('none') }
}
