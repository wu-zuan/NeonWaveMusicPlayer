import React from 'react'
import { FolderOpen, Search, Settings, Music, Disc } from 'lucide-react' // standard import
// Note: lucide-react exports components.
import styles from './Sidebar.module.css'

interface SidebarProps {
    onOpenFolder: () => void
    currentView: string
    onChangeView: (view: string) => void
}

export const Sidebar: React.FC<SidebarProps> = ({ onOpenFolder, currentView, onChangeView }) => {
    return (
        <aside className={styles.sidebar}>
            <div className={styles.brand}>
                <Disc size={32} color="var(--accent-primary)" />
                <h1 className={styles.title}>NeonWave</h1>
            </div>

            <nav className={styles.nav}>
                <button
                    className={`${styles.navItem} ${currentView === 'library' ? styles.active : ''}`}
                    onClick={() => onChangeView('library')}
                >
                    <Music size={20} />
                    <span>音樂庫</span>
                </button>

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

            <button className={styles.openButton} onClick={onOpenFolder}>
                <FolderOpen size={20} color="var(--accent-secondary)" />
                <span>開啟資料夾</span>
            </button>
        </aside>
    )
}
