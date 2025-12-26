// Helper untuk auto-transfer guest sessions ke user setelah login/register
import { scanSessionStorage } from '@/lib/helper/scan-session-storage';
import axios from 'axios';

export const transferGuestSessions = async (): Promise<void> => {
    const sessionIds = scanSessionStorage.getSessionIds();
    
    if (sessionIds.length === 0) {
        return; // No sessions to transfer
    }

    try {
        const response = await axios.post('/api/scan/transfer-sessions', {
            session_ids: sessionIds,
        });

        if (response.data.ok) {
            // Clear localStorage after successful transfer
            scanSessionStorage.clearSessions();
            console.log(`✅ ${response.data.transferred_count} scan sessions transferred successfully`);
        }
    } catch (error) {
        console.error('Error transferring sessions:', error);
        // Don't throw error, just log it
        // We don't want to break the login/register flow
    }
};
