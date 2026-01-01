import { FolderOpen, Search, Settings, Music, Disc, Heart, ListMusic, Trash2, Edit2 } from 'lucide-react'

// ...

interface SidebarProps {
    playlists: Playlist[]
    currentView: string
    onChangeView: (view: string) => void
    onOpenFolder: () => void
    onRemoveFolder: (path: string) => void
    onRenameFolder: (path: string, newName: string) => void
}

export const Sidebar: React.FC<SidebarProps> = ({
    playlists, currentView, onChangeView, onOpenFolder, onRemoveFolder, onRenameFolder
}) => {
    // ... (rest of the code)

    <div className={styles.scrollableNav}>
        {playlists.map(pl => (
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

        {playlists.length === 0 && (
            <div className={styles.emptyHint}>
                點擊 + 加入
            </div>
        )}
    </div>

    {/* Online & Settings */ }
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
            </nav >
        </aside >
    )
}
