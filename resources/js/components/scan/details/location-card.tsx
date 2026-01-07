import React, { useEffect } from "react";
import { MapPin, Clock, Copy, Trash2, RefreshCcw } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import type { GeoStatus, Coords, Address } from "@/types/geo";

type Props = {
    status: GeoStatus;
    coords: Coords | null;
    address: Address | null;
    updatedAt: Date | null;
    onRefresh: () => void;
    onCopy: () => void;
    onClear: () => void;
};

function FlyTo({ coords }: { coords: Coords | null }) {
    const map = useMap();
    useEffect(() => {
        if (!coords) return;
        map.setView([coords.lat, coords.lon], 15, { animate: true });
    }, [coords, map]);
    return null;
}

const LocationCard: React.FC<Props> = ({
    status,
    coords,
    address,
    updatedAt,
    onRefresh,
    onCopy,
    onClear,
}) => {
    const timeStr = updatedAt
        ? updatedAt.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })
        : "--:--";
    const fallbackCenter: [number, number] = [-6.1754, 106.8272];

    return (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="h-40 w-full">
                <MapContainer
                    center={coords ? [coords.lat, coords.lon] : fallbackCenter}
                    zoom={13}
                    scrollWheelZoom={false}
                    style={{ height: "100%", width: "100%" }}
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
                    />
                    {coords && (
                        <>
                            <Marker position={[coords.lat, coords.lon]}>
                                <Popup>
                                    {address?.display ?? `${coords.lat.toFixed(5)}, ${coords.lon.toFixed(5)}`}
                                </Popup>
                            </Marker>
                            <FlyTo coords={coords} />
                        </>
                    )}
                </MapContainer>
            </div>

            <div className="space-y-2 p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-emerald-600">
                        <MapPin className="h-4 w-4" />
                        <span className="text-sm font-semibold">Lokasimu</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{timeStr} WIB</span>
                    </div>
                </div>

                <div className="rounded-xl bg-slate-50 p-3 text-sm text-slate-700">
                    {status === "locating" && <span>Mencari lokasi…</span>}
                    {status === "error" && <span className="text-red-600">Gagal membaca lokasi. Coba izinkan GPS.</span>}
                    {status === "ready" && (
                        <>
                            <div className="line-clamp-2">
                                {address?.display || (coords ? `${coords.lat}, ${coords.lon}` : "—")}
                            </div>
                            <div className="mt-2 inline-flex items-center gap-2">
                                <span className="rounded-full bg-sky-100 px-3 py-1 text-xs text-sky-700">
                                    {address?.city || "Kota"}
                                </span>
                                {address?.state && (
                                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">
                                        {address.state}
                                    </span>
                                )}
                            </div>
                        </>
                    )}
                </div>

                <div className="flex items-center justify-between">
                    <button
                        type="button"
                        onClick={onRefresh}
                        className="rounded-full bg-sky-600 px-4 py-1.5 text-sm font-semibold text-white shadow active:scale-95"
                    >
                        {address?.city || "--"}
                    </button>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={onRefresh}
                            className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 hover:bg-slate-50"
                            title="Refresh address"
                        >
                            <RefreshCcw className="h-4 w-4" />
                        </button>
                        <button
                            type="button"
                            onClick={onCopy}
                            className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 hover:bg-slate-50"
                            title="Copy address"
                        >
                            <Copy className="h-4 w-4" />
                        </button>
                        <button
                            type="button"
                            onClick={onClear}
                            className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 hover:bg-slate-50"
                            title="Clear"
                        >
                            <Trash2 className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LocationCard;
