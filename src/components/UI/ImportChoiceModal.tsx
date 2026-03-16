import React from 'react';
import styles from './ConfirmationModal.module.css';

interface ImportChoiceModalProps {
    isOpen: boolean;
    playlistName: string;
    onSelectDownload: () => void;
    onSelectStream: () => void;
    onCancel: () => void;
}

export const ImportChoiceModal: React.FC<ImportChoiceModalProps> = ({
    isOpen,
    playlistName,
    onSelectDownload,
    onSelectStream,
    onCancel
}) => {
    if (!isOpen) return null;

    return (
        <div className={styles.overlay} onClick={onCancel}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <h3 className={styles.title}>匯入歌單：{playlistName}</h3>
                <p className={styles.message}>
                    您想要將此歌單的音樂完整「下載」到電腦裡，還是直接加入「線上串流」歌單？<br/><br/>
                    • <b>下載實體檔案</b>：需要選擇資料夾，會佔用空間但可離線聽。<br/>
                    • <b>線上串流</b>：不佔用空間，隨時連線播放。
                </p>
                <div className={styles.actions} style={{ justifyContent: 'space-between' }}>
                    <button
                        className={styles.cancelButton}
                        onClick={onCancel}
                    >
                        取消匯入
                    </button>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                            className={styles.confirmButton}
                            style={{ background: '#3b82f6' }}
                            onClick={onSelectStream}
                        >
                            線上串流
                        </button>
                        <button
                            className={`${styles.confirmButton} ${styles.primary}`}
                            onClick={onSelectDownload}
                        >
                            下載實體檔案
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
