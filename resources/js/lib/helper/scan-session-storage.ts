/* eslint-disable @typescript-eslint/no-explicit-any */
// Helper untuk manage scan session IDs di localStorage (untuk guest)
const STORAGE_KEY = 'rescat_scan_sessions';

export type StoredScanSession = {
    id: string;
    checkup_type: string;
    created_at: string;
    scan_images_count: number;
    results_count: number;
    image_url?: string;
    remarks?: string;
    results?: any[];
};

export const scanSessionStorage = {
    // Get all session IDs from localStorage
    getSessionIds(): string[] {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            if (!data) return [];
            return JSON.parse(data);
        } catch (error) {
            console.error('Error reading session IDs from localStorage:', error);
            return [];
        }
    },

    // Save a session ID
    saveSessionId(sessionId: string): void {
        try {
            const ids = this.getSessionIds();
            
            // Only add if not already exists
            if (!ids.includes(sessionId)) {
                ids.unshift(sessionId); // Add to beginning
            }

            // Keep only last 50 session IDs
            const limited = ids.slice(0, 50);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(limited));
        } catch (error) {
            console.error('Error saving session ID to localStorage:', error);
        }
    },

    // Get latest session ID
    getLatestSessionId(): string | null {
        try {
            const ids = this.getSessionIds();
            return ids[0] || null;
        } catch (error) {
            console.error('Error getting latest session ID:', error);
            return null;
        }
    },

    // Clear all session IDs
    clearSessions(): void {
        try {
            localStorage.removeItem(STORAGE_KEY);
        } catch (error) {
            console.error('Error clearing sessions:', error);
        }
    },

    // Legacy methods for backward compatibility
    getSessions(): StoredScanSession[] {
        // Deprecated: use getSessionIds and fetch from API instead
        return [];
    },

    saveSession(session: StoredScanSession): void {
        // Save only the ID
        this.saveSessionId(session.id);
    },
};
