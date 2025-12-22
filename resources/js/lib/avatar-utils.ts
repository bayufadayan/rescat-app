/**
 * Avatar utilities untuk manage seed di localStorage
 */

const AVATAR_SEED_KEY = 'guest_avatar_seed';

/**
 * Generate random seed untuk avatar
 */
export function generateAvatarSeed(): string {
    return Math.random().toString(36).slice(2, 10);
}

/**
 * Get atau create seed untuk guest user
 * Simpan di localStorage agar konsisten
 */
export function getGuestAvatarSeed(): string {
    if (typeof window === 'undefined') return generateAvatarSeed();
    
    let seed = localStorage.getItem(AVATAR_SEED_KEY);
    if (!seed) {
        seed = generateAvatarSeed();
        localStorage.setItem(AVATAR_SEED_KEY, seed);
    }
    return seed;
}

/**
 * Clear guest avatar seed dari localStorage
 * Dipanggil setelah register/login sukses
 */
export function clearGuestAvatarSeed(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(AVATAR_SEED_KEY);
}

/**
 * Check apakah avatar string adalah URL atau seed
 */
export function isAvatarUrl(avatar: string | null | undefined): boolean {
    if (!avatar) return false;
    return avatar.startsWith('http://') || 
           avatar.startsWith('https://') || 
           avatar.startsWith('/storage/') ||
           avatar.startsWith('/');
}
