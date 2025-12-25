<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>403 - Akses Ditolak | {{ config('app.name') }}</title>
        <link rel="icon" href="/images/icon/favicon-new.svg" type="image/svg+xml">
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=urbanist:400,500,600,700" rel="stylesheet" />
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: 'Urbanist', ui-sans-serif, system-ui, -apple-system, sans-serif;
                background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%);
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 1rem;
                position: relative;
                overflow: hidden;
            }

            /* Animated background circles */
            .bg-circle {
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.1);
                animation: float 20s infinite ease-in-out;
            }

            .circle-1 {
                width: 300px;
                height: 300px;
                top: -100px;
                left: -100px;
                animation-delay: 0s;
            }

            .circle-2 {
                width: 200px;
                height: 200px;
                bottom: -50px;
                right: -50px;
                animation-delay: 3s;
            }

            .circle-3 {
                width: 150px;
                height: 150px;
                top: 50%;
                right: 10%;
                animation-delay: 6s;
            }

            @keyframes float {
                0%, 100% {
                    transform: translate(0, 0) scale(1);
                }
                25% {
                    transform: translate(20px, -20px) scale(1.1);
                }
                50% {
                    transform: translate(-20px, 20px) scale(0.9);
                }
                75% {
                    transform: translate(20px, 20px) scale(1.05);
                }
            }

            .container {
                position: relative;
                z-index: 10;
                max-width: 600px;
                width: 100%;
                text-align: center;
                background: white;
                border-radius: 24px;
                padding: 3rem 2rem;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
                animation: slideUp 0.6s ease-out;
            }

            @keyframes slideUp {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            .error-code {
                font-size: 8rem;
                font-weight: 700;
                background: linear-gradient(135deg, #dc2626, #ef4444);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
                line-height: 1;
                margin-bottom: 1rem;
                animation: pulse 2s infinite;
            }

            @keyframes pulse {
                0%, 100% {
                    transform: scale(1);
                }
                50% {
                    transform: scale(1.05);
                }
            }

            .error-title {
                font-size: 2rem;
                font-weight: 700;
                color: #1e293b;
                margin-bottom: 1rem;
            }

            .error-message {
                font-size: 1.125rem;
                color: #64748b;
                margin-bottom: 2.5rem;
                line-height: 1.6;
            }

            .illustration {
                margin-bottom: 2rem;
                animation: shake 3s infinite;
            }

            @keyframes shake {
                0%, 100% {
                    transform: rotate(0deg);
                }
                25% {
                    transform: rotate(-5deg);
                }
                75% {
                    transform: rotate(5deg);
                }
            }

            .illustration svg {
                width: 200px;
                height: 200px;
            }

            .buttons {
                display: flex;
                gap: 1rem;
                justify-content: center;
                flex-wrap: wrap;
            }

            .btn {
                display: inline-flex;
                align-items: center;
                gap: 0.5rem;
                padding: 0.875rem 2rem;
                font-size: 1rem;
                font-weight: 600;
                text-decoration: none;
                border-radius: 12px;
                transition: all 0.3s ease;
                cursor: pointer;
            }

            .btn-primary {
                background: linear-gradient(135deg, #dc2626, #ef4444);
                color: white;
                box-shadow: 0 4px 14px rgba(220, 38, 38, 0.3);
            }

            .btn-primary:hover {
                box-shadow: 0 6px 20px rgba(220, 38, 38, 0.4);
                transform: translateY(-2px);
            }

            .btn-secondary {
                background: white;
                color: #dc2626;
                border: 2px solid #e2e8f0;
            }

            .btn-secondary:hover {
                border-color: #dc2626;
                background: #fef2f2;
                transform: translateY(-2px);
            }

            .warning-badge {
                display: inline-block;
                background: #fef2f2;
                color: #dc2626;
                padding: 0.5rem 1rem;
                border-radius: 8px;
                font-size: 0.875rem;
                font-weight: 600;
                margin-bottom: 1.5rem;
                border: 1px solid #fecaca;
            }

            @media (max-width: 640px) {
                .error-code {
                    font-size: 6rem;
                }
                .error-title {
                    font-size: 1.5rem;
                }
                .error-message {
                    font-size: 1rem;
                }
                .container {
                    padding: 2rem 1.5rem;
                }
                .buttons {
                    flex-direction: column;
                    width: 100%;
                }
                .btn {
                    width: 100%;
                    justify-content: center;
                }
            }
        </style>
    </head>
    <body>
        <div class="bg-circle circle-1"></div>
        <div class="bg-circle circle-2"></div>
        <div class="bg-circle circle-3"></div>

        <div class="container">
            <div class="illustration">
                <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="100" cy="100" r="80" fill="#FEE2E2" opacity="0.5"/>
                    <path d="M100 50L100 110" stroke="#DC2626" stroke-width="6" stroke-linecap="round"/>
                    <circle cx="100" cy="135" r="5" fill="#DC2626"/>
                    <path d="M60 70L80 50M140 70L120 50" stroke="#DC2626" stroke-width="4" stroke-linecap="round"/>
                    <circle cx="100" cy="100" r="90" stroke="#EF4444" stroke-width="3" stroke-dasharray="5 5" opacity="0.3"/>
                    <path d="M50 180C50 180 70 160 100 160C130 160 150 180 150 180" stroke="#DC2626" stroke-width="3" stroke-linecap="round" opacity="0.5"/>
                </svg>
            </div>
            
            <div class="warning-badge">
                <svg style="display: inline-block; width: 16px; height: 16px; margin-right: 4px; vertical-align: middle;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                    <line x1="12" y1="9" x2="12" y2="13"/>
                    <line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
                Akses Terbatas
            </div>

            <div class="error-code">403</div>
            <h1 class="error-title">Akses Ditolak</h1>
            <p class="error-message">
                Maaf, Anda tidak memiliki izin untuk mengakses halaman ini. <br>
                Silakan hubungi administrator jika Anda yakin ini adalah kesalahan.
            </p>

            <div class="buttons">
                <a href="{{ url('/') }}" class="btn btn-primary">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                        <polyline points="9 22 9 12 15 12 15 22"/>
                    </svg>
                    Kembali ke Beranda
                </a>
                <a href="javascript:history.back()" class="btn btn-secondary">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="15 18 9 12 15 6"/>
                    </svg>
                    Halaman Sebelumnya
                </a>
            </div>
        </div>
    </body>
</html>
