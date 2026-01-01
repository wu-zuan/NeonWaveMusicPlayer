import React from 'react'
import { FolderOpen, Search, Settings, Music, Disc, Heart, ListMusic, Trash2 } from 'lucide-react'
import styles from './Sidebar.module.css'
import { Playlist } from '../../hooks/useLibrary'

interface SidebarProps {
    playlists: Playlist[]
    currentView: string
    onChangeView: (view: string) => void
    onOpenFolder: () => void
    onRemoveFolder: (path: string) => void
}

export const Sidebar: React.FC<SidebarProps> = ({
    playlists, currentView, onChangeView, onOpenFolder, onRemoveFolder
}) => {
    return (
        <aside className={styles.sidebar}>
            <div className={styles.brand}>
                <Disc size={32} color="var(--accent-primary)" />
                <h1 className={styles.title}>NeonWave</h1>
            </div>

            <nav className={styles.menu}>
                {/* Core Views */}
                <div className={styles.sectionTitle}>音樂庫</div>

                <button
                    className={`${styles.navItem} ${currentView === 'all_songs' ? styles.active : ''}`}
                    onClick={() => onChangeView('all_songs')}
                >
                    <Music size={20} />
                    <span>所有歌曲</span>
                </button>

                <button
                    className={`${styles.navItem} ${currentView === 'favorites' ? styles.active : ''}`}
                    onClick={() => onChangeView('favorites')}
                >
                    <Heart size={20} fill={currentView === 'favorites' ? "currentColor" : "none"} />
                    <span>我的最愛</span>
                </button>

                {/* Local Folders */}
                <div className={styles.sectionTitle} style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    本機資料夾
                    <button className={styles.miniAddBtn} onClick={onOpenFolder} title="加入資料夾">
                        <FolderOpen size={14} />
                    </button>
                </div>

                <div className={styles.scrollableNav}>
                    {playlists.map(pl => (
                        <div key={pl.id} className={`${styles.navItem} ${currentView === pl.id ? styles.active : ''}`} onClick={() => onChangeView(pl.id)}>
                            <div className={styles.navItemContent}>
                                <ListMusic size={18} />
                                <span className={styles.truncate}>{pl.name}</span>
                            </div>
                            <button
                                className={styles.deleteBtn}
                                onClick={(e) => {
                                    e.stopPropagation()
                                    if (confirm(`確定要移除資料夾 "${pl.name}" 嗎?`)) onRemoveFolder(pl.path!)
                                }}
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                    ))}

                    {playlists.length === 0 && (
                        <div className={styles.emptyHint}>
                            點擊 + 加入
                        </div>
                    )}
                </div>

                {/* Online & Settings */}
                <div className={styles.sectionTitle} style={{ marginTop: '20px' }}>應用程式</div>

                <button
                    className={`${styles.navItem} ${currentView === 'search' ? styles.active : ''}`}
                    onClick={() => onChangeView('search')}
                >
                    <Search size={20} />
                    <span>線上搜尋</span>
                </button>

                <button
                    className={`${styles.navItem} ${currentView === 'settings' ? styles.active : ''}`}
                    onClick={() => onChangeView('settings')}
                >
                    <Settings size={20} />
                    <span>設定</span>
                </button>
            </nav>
        </aside>
    )
}
