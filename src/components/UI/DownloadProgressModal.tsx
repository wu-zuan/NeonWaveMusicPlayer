import React from 'react';
import styles from './ConfirmationModal.module.css';

interface DownloadProgressModalProps {
    progress: { current: number; total: number; currentTrack: string; isPaused: boolean } | null;
    onPause: () => void;
    onResume: () => void;
    onCancel: () => void;
}

export const DownloadProgressModal: React.FC<DownloadProgressModalProps> = ({ 
    progress,
    onPause,
    onResume,
    onCancel 
}) => {
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
                <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden', margin: '16px 0' }}>
                    <div style={{ width: `${percentage}%`, height: '100%', background: '#8b5cf6', transition: 'width 0.3s ease' }}></div>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                    <button onClick={onCancel} style={{ padding: '8px 16px', background: 'transparent', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'var(--text-main)', cursor: 'pointer' }}>取消下載</button>
                    {progress.isPaused ? (
                        <button onClick={onResume} style={{ padding: '8px 16px', background: 'var(--accent-primary)', border: 'none', borderRadius: '8px', color: '#000', fontWeight: 'bold', cursor: 'pointer' }}>繼續下載</button>
                    ) : (
                        <button onClick={onPause} style={{ padding: '8px 16px', background: 'rgba(255, 255, 255, 0.1)', border: 'none', borderRadius: '8px', color: '#fff', cursor: 'pointer' }}>暫停下載</button>
                    )}
                </div>
            </div>
        </div>
    );
};
