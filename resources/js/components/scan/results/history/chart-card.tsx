import React, { useMemo } from "react";
import { usePage, Link } from '@inertiajs/react';
import { useRoute } from 'ziggy-js';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Area,
} from "recharts";
import type { Auth } from '@/types';

type HistoryScan = {
    date: string;
    normalCount: number;
    totalCount: number;
    percentage: number;
};

type ChartCardProps = {
    catId?: string | null;
    historyData?: HistoryScan[];
};

export default function ChartCard({ catId, historyData = [] }: ChartCardProps) {
    const route = useRoute();
    const { auth } = usePage<{ auth: Auth }>().props;
    const isLoggedIn = !!auth?.user;
    const hasCatRelation = !!catId && historyData.length > 0;

    const chartData = useMemo(() => {
        return historyData.map(item => ({
            label: new Date(item.date).toLocaleDateString('id-ID', { 
                day: '2-digit',
                month: 'short' 
            }),
            value: Math.round(item.percentage),
            tooltip: `${item.normalCount}/${item.totalCount} area (${Math.round(item.percentage)}%)`
        }));
    }, [historyData]);

    // Jika belum login, tampilkan auth prompt
    if (!isLoggedIn) {
        return (
            <div className="w-full bg-gradient-to-br from-sky-50 to-blue-50 rounded-2xl shadow-sm border border-sky-200 p-8">
                <div className="flex flex-col items-center text-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-sky-100 flex items-center justify-center">
                        <svg className="w-8 h-8 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-slate-800 font-bold text-lg mb-2">Silakan Login untuk Mengaktifkan Fitur Ini</h3>
                        <p className="text-slate-600 text-sm">Lacak riwayat kesehatan kucing Anda dengan grafik history scan</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto mt-2">
                        <Link
                            href={route('login')}
                            className="px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-lg transition-all shadow-md hover:shadow-lg"
                        >
                            Login
                        </Link>
                        <Link
                            href={route('register')}
                            className="px-6 py-2.5 bg-white hover:bg-slate-50 text-sky-600 font-semibold rounded-lg border-2 border-sky-600 transition-all"
                        >
                            Register
                        </Link>
                        <Link
                            href={route('google.redirect')}
                            className="px-6 py-2.5 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-lg border-2 border-slate-300 transition-all flex items-center gap-2 justify-center"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                            </svg>
                            Sign in With Google
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // Jika sudah login tapi belum ada relasi cat
    if (!hasCatRelation) {
        return (
            <div className="w-full bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl shadow-sm border border-amber-200 p-8">
                <div className="flex flex-col items-center text-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center">
                        <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-slate-800 font-bold text-lg mb-2">Belum Ada Data History</h3>
                        <p className="text-slate-600 text-sm">Hubungkan scan dengan kucing Anda untuk mulai melacak riwayat kesehatan</p>
                    </div>
                </div>
            </div>
        );
    }

    // Tampilkan grafik jika sudah login dan ada data
    return (
        <div className="w-full bg-white rounded-2xl shadow-sm border border-slate-200 p-4">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-slate-800 font-semibold">History Scan</h3>
                <span className="text-xs text-slate-500">{historyData.length} scan terakhir</span>
            </div>

            <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 6, right: 8, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#38BDF8" stopOpacity={0.35} />
                                <stop offset="100%" stopColor="#38BDF8" stopOpacity={0} />
                            </linearGradient>
                        </defs>

                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis
                            dataKey="label"
                            tickLine={false}
                            axisLine={false}
                            tick={{ fill: "#64748b", fontSize: 12 }}
                        />
                        <YAxis
                            width={32}
                            tickLine={false}
                            axisLine={false}
                            tick={{ fill: "#64748b", fontSize: 12 }}
                            domain={[0, 100]}
                            ticks={[0, 25, 50, 75, 100]}
                            tickFormatter={(value) => `${value}%`}
                        />
                        <Tooltip
                            cursor={{ stroke: "#94a3b8", strokeDasharray: "3 3" }}
                            contentStyle={{
                                borderRadius: 12,
                                border: "1px solid #e2e8f0",
                                boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
                            }}
                            labelStyle={{ color: "#334155", fontWeight: 600 }}
                            formatter={(value: number, name: string, props: any) => [
                                props.payload.tooltip,
                                'Area Normal'
                            ]}
                        />

                        <Area
                            type="monotone"
                            dataKey="value"
                            stroke="none"
                            fill="url(#areaFill)"
                        />
                        <Line
                            type="monotone"
                            dataKey="value"
                            stroke="#0891B2"
                            strokeWidth={3}
                            dot={{ r: 3, fill: "#0891B2", strokeWidth: 0 }}
                            activeDot={{ r: 5 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-200">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Rata-rata kesehatan:</span>
                    <span className="font-semibold text-sky-600">
                        {Math.round(chartData.reduce((acc, curr) => acc + curr.value, 0) / chartData.length)}%
                    </span>
                </div>
            </div>
        </div>
    );
}
