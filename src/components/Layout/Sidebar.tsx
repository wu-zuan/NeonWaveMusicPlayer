import React from 'react'
import { FolderOpen, Search, Settings, Music, Heart, ListMusic, Trash2, Edit2, RefreshCw, Radio, Share2, Upload } from 'lucide-react'
import styles from './Sidebar.module.css'
import { Playlist } from '../../hooks/useLibrary'

interface SidebarProps {
    playlists: Playlist[]
    currentView: string
    onChangeView: (view: string) => void
    onOpenFolder: () => void
    onRemoveFolder: (path: string) => void
    onRenameFolder: (path: string, newName: string) => void
    onRefreshLibrary: () => void
    onExportPlaylist: (playlist: Playlist) => void
    onImportPlaylist: () => void
}

export const Sidebar: React.FC<SidebarProps> = ({
    playlists, currentView, onChangeView, onOpenFolder, onRemoveFolder, onRenameFolder, onRefreshLibrary, onExportPlaylist, onImportPlaylist
}) => {
    const folders = playlists.filter(p => !p.type || p.type === 'folder')
    const customLists = playlists.filter(p => p.type === 'custom')
    return (
        <aside className={styles.sidebar}>
            <div className={styles.brand}>
                <h1 className={styles.title}>NeonWave</h1>
            </div>

            <nav className={styles.menu}>
                { }
                <div className={styles.topSection}>
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
                </div>

                <div className={styles.scrollArea}>
                    { }
                    <div className={styles.sectionTitle} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        本機資料夾
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button className={styles.miniAddBtn} onClick={onRefreshLibrary} title="重新整理">
                                <RefreshCw size={14} />
                            </button>
                            <button className={styles.miniAddBtn} onClick={onOpenFolder} title="加入資料夾">
                                <FolderOpen size={14} />
                            </button>
                        </div>
                    </div>

                    <div className={styles.scrollableNav} style={{ marginBottom: '10px' }}>
                        {folders.map(pl => (
                            <div key={pl.id} className={`${styles.navItem} ${currentView === pl.id ? styles.active : ''}`} onClick={() => onChangeView(pl.id)}>
                                <div className={styles.navItemContent}>
                                    <ListMusic size={18} />
                                    <span className={styles.truncate}>{pl.name}</span>
                                </div>

                                <div className={styles.actions}>
                                    <button
                                        className={styles.actionBtn}
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            onExportPlaylist(pl)
                                        }}
                                        title="匯出分享 (.nwp)"
                                    >
                                        <Share2 size={14} />
                                    </button>
                                    <button
                                        className={styles.actionBtn}
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            const newName = prompt("請輸入新名稱:", pl.name)
                                            if (newName && newName.trim()) {
                                                onRenameFolder(pl.path!, newName.trim())
                                            }
                                        }}
                                        title="重新命名"
                                    >
                                        <Edit2 size={14} />
                                    </button>
                                    <button
                                        className={styles.actionBtn}
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            if (confirm(`確定要移除資料夾 "${pl.name}" 嗎?`)) onRemoveFolder(pl.path!)
                                        }}
                                        title="移除資料夾"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        ))}

                        {folders.length === 0 && (
                            <div className={styles.emptyHint}>
                                點擊右上角加入
                            </div>
                        )}
                    </div>

                    {/* Custom Playlists */}
                    <div className={styles.sectionTitle} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        我的歌單
                        <button className={styles.miniAddBtn} onClick={onImportPlaylist} title="匯入分享歌單 (.nwp)">
                            <Upload size={14} />
                        </button>
                    </div>

                    <div className={styles.scrollableNav} style={{ marginBottom: '10px' }}>
                        {customLists.map(pl => (
                            <div key={pl.id} className={`${styles.navItem} ${currentView === pl.id ? styles.active : ''}`} onClick={() => onChangeView(pl.id)}>
                                <div className={styles.navItemContent}>
                                    <ListMusic size={18} />
                                    <span className={styles.truncate}>{pl.name}</span>
                                </div>

                                <div className={styles.actions}>
                                    <button
                                        className={styles.actionBtn}
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            onExportPlaylist(pl)
                                        }}
                                        title="匯出分享 (.nwp)"
                                    >
                                        <Share2 size={14} />
                                    </button>
                                    <button
                                        className={styles.actionBtn}
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            const newName = prompt("請輸入新名稱:", pl.name)
                                            if (newName && newName.trim()) {
                                                onRenameFolder(pl.id, newName.trim())
                                            }
                                        }}
                                        title="重新命名"
                                    >
                                        <Edit2 size={14} />
                                    </button>
                                    <button
                                        className={styles.actionBtn}
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            if (confirm(`確定要移除歌單 "${pl.name}" 嗎?`)) onRemoveFolder(pl.id)
                                        }}
                                        title="移除"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        ))}

                        {customLists.length === 0 && (
                            <div className={styles.emptyHint}>
                                點擊右上角匯入
                            </div>
                        )}
                    </div>
                </div>

                { }
                <div className={styles.bottomSection}>
                    <div className={styles.sectionTitle}>應用程式</div>

                    <button
                        className={`${styles.navItem} ${currentView === 'search' ? styles.active : ''}`}
                        onClick={() => onChangeView('search')}
                    >
                        <Search size={20} />
                        <span>線上搜尋</span>
                    </button>

                    <button
                        className={`${styles.navItem} ${currentView === 'discord' ? styles.active : ''}`}
                        onClick={() => onChangeView('discord')}
                    >
                        <Radio size={20} />
                        <span>Discord 機器人</span>
                    </button>

                    <button
                        className={`${styles.navItem} ${currentView === 'settings' ? styles.active : ''}`}
                        onClick={() => onChangeView('settings')}
                    >
                        <Settings size={20} />
                        <span>設定</span>
                    </button>
                </div>
            </nav>
        </aside>
    )
}
