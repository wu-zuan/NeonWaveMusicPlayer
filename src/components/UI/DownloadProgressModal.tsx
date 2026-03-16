import React from 'react';
import styles from './ConfirmationModal.module.css';

interface DownloadProgressModalProps {
    progress: { current: number; total: number; currentTrack: string } | null;
}

export const DownloadProgressModal: React.FC<DownloadProgressModalProps> = ({ progress }) => {
    if (!progress) return null;

    const percentage = Math.round((progress.current / progress.total) * 100) || 0;

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <h3 className={styles.title}>正在下載音樂...</h3>
                <p className={styles.message} style={{ marginBottom: '12px' }}>
                    整體進度：{progress.current} / {progress.total} 首
                </p>
                <p className={styles.message} style={{ color: '#fff', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    目前下載：{progress.currentTrack}
                </p>
                <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden', marginTop: '16px' }}>
                    <div style={{ width: `${percentage}%`, height: '100%', background: '#8b5cf6', transition: 'width 0.3s ease' }}></div>
                </div>
            </div>
        </div>
    );
};
