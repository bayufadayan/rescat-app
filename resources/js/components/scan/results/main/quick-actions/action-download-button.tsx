import React, { useState } from 'react';
import { useScanResultContext } from '@/contexts/scan-result-context';
import IconPlaceholder from './icon-placeholder';

export default function DownloadButton() {
    const { session } = useScanResultContext();
    const [isDownloading, setIsDownloading] = useState(false);

    const handleDownload = async () => {
        if (isDownloading || !session?.id) return;

        try {
            setIsDownloading(true);
            
            // Generate download URL
            const downloadUrl = `/scan-reports/${session.id}/download`;
            
            // Use window.open for better feedback and error handling
            window.location.href = downloadUrl;
            
            // Reset loading state after short delay
            setTimeout(() => {
                setIsDownloading(false);
            }, 2000);
        } catch (error) {
            console.error('Error downloading report:', error);
            alert('Gagal mengunduh laporan. Silakan coba lagi.');
            setIsDownloading(false);
        }
    };

    return (
        <IconPlaceholder 
            onClick={handleDownload} 
            ariaLabel="Download hasil checkup"
            disabled={isDownloading}
        >
            {isDownloading ? (
                <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="#0D99FF" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="#0D99FF" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M9.99999 14.4687C9.83332 14.4687 9.67708 14.4429 9.53124 14.3912C9.38541 14.3396 9.24999 14.2508 9.12499 14.125L4.625 9.625C4.375 9.375 4.255 9.08333 4.265 8.75C4.275 8.41667 4.395 8.125 4.625 7.875C4.875 7.625 5.17208 7.495 5.51625 7.485C5.86041 7.475 6.15708 7.59458 6.40624 7.84375L8.74999 10.1875V1.25C8.74999 0.895837 8.86999 0.599171 9.10999 0.360004C9.34999 0.120838 9.64666 0.000837643 9.99999 4.31034e-06C10.3533 -0.000829023 10.6504 0.119171 10.8912 0.360004C11.1321 0.600838 11.2517 0.897504 11.25 1.25V10.1875L13.5937 7.84375C13.8437 7.59375 14.1408 7.47375 14.485 7.48375C14.8292 7.49375 15.1258 7.62417 15.375 7.875C15.6042 8.125 15.7242 8.41667 15.735 8.75C15.7458 9.08333 15.6258 9.375 15.375 9.625L10.875 14.125C10.75 14.25 10.6146 14.3387 10.4687 14.3912C10.3229 14.4437 10.1667 14.4696 9.99999 14.4687ZM2.5 20C1.8125 20 1.22417 19.7554 0.734999 19.2662C0.245833 18.7771 0.000833333 18.1883 0 17.5V15C0 14.6458 0.12 14.3492 0.36 14.11C0.6 13.8708 0.896666 13.7508 1.25 13.75C1.60333 13.7492 1.90041 13.8692 2.14125 14.11C2.38208 14.3508 2.50166 14.6475 2.5 15V17.5H17.5V15C17.5 14.6458 17.62 14.3492 17.86 14.11C18.1 13.8708 18.3967 13.7508 18.75 13.75C19.1033 13.7492 19.4004 13.8692 19.6412 14.11C19.8821 14.3508 20.0016 14.6475 20 15V17.5C20 18.1875 19.7554 18.7762 19.2662 19.2662C18.7771 19.7562 18.1883 20.0008 17.5 20H2.5Z" fill="#0D99FF" />
                </svg>
            )}
        </IconPlaceholder>
    );
}
