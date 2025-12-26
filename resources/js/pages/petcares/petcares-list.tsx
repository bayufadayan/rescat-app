import React, { useState, useEffect, useCallback } from 'react';
import { router, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { MapPin, Phone, Navigation, ChevronRight, Stethoscope } from 'lucide-react';
import axios from 'axios';

type Petcare = {
    id: number;
    name: string;
    address: string;
    phone: string;
    latitude: string;
    longitude: string;
    vet_name?: string;
    vet_specialization?: string;
    vet_phone?: string;
    distance?: number;
};

type PetcaresListProps = {
    petcares: Petcare[];
};

export default function PetcaresList() {
    const { petcares: initialPetcares } = usePage<PetcaresListProps>().props;
    const [petcares, setPetcares] = useState<Petcare[]>(Array.isArray(initialPetcares) ? initialPetcares : []);
    const [isLoadingLocation, setIsLoadingLocation] = useState(false);
    const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

    const fetchPetcaresByLocation = useCallback(async (lat: number, lng: number) => {
        try {
            const response = await axios.get('/api/petcares', {
                params: { latitude: lat, longitude: lng }
            });
            
            // Pastikan data adalah array
            const data = response.data?.data || response.data || [];
            setPetcares(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching petcares:', error);
            setPetcares([]); // Set empty array on error
        } finally {
            setIsLoadingLocation(false);
        }
    }, []);

    const getCurrentLocation = useCallback(() => {
        if (!navigator.geolocation) {
            return;
        }

        setIsLoadingLocation(true);

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setUserLocation({ lat: latitude, lng: longitude });
                fetchPetcaresByLocation(latitude, longitude);
            },
            (error) => {
                console.error('Error getting location:', error);
                setIsLoadingLocation(false);
            }
        );
    }, [fetchPetcaresByLocation]);

    useEffect(() => {
        getCurrentLocation();
    }, [getCurrentLocation]);

    const handlePetcareClick = (id: number) => {
        router.visit(`/petcares/${id}`);
    };

    const openMaps = (lat: string, lng: string, name: string) => {
        const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}&query_place_id=${encodeURIComponent(name)}`;
        window.open(url, '_blank');
    };

    return (
        <AppLayout>
            <div className="flex flex-col bg-white w-full min-h-screen relative pb-20">
                {/* Header */}
                <div className="bg-gradient-to-r from-[#0D99FF] to-[#0066cc] px-6 pt-24 pb-8 text-white">
                    <h1 className="text-2xl font-bold mb-2">Petcare Terdekat</h1>
                    <p className="text-sm opacity-90">Temukan layanan perawatan kucing terbaik di sekitar Anda</p>
                </div>

                {/* Location Status */}
                {isLoadingLocation && (
                    <div className="bg-blue-50 border-l-4 border-[#0D99FF] px-6 py-4 flex items-center gap-3">
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-[#0D99FF] border-t-transparent"></div>
                        <p className="text-sm text-gray-700">Mencari lokasi Anda...</p>
                    </div>
                )}

                {userLocation && !isLoadingLocation && (
                    <div className="bg-green-50 border-l-4 border-green-500 px-6 py-4 flex items-center gap-3">
                        <Navigation className="w-5 h-5 text-green-600" />
                        <div>
                            <p className="text-sm font-medium text-gray-900">Lokasi terdeteksi</p>
                            <p className="text-xs text-gray-600">Menampilkan petcare terdekat dari Anda</p>
                        </div>
                    </div>
                )}

                {/* Petcare List */}
                <div className="px-4 py-6">
                    <div className="flex flex-col gap-4">
                        {!Array.isArray(petcares) || petcares.length === 0 ? (
                            <div className="text-center py-12">
                                <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <p className="text-gray-500">Tidak ada petcare ditemukan</p>
                            </div>
                        ) : (
                            petcares.map((petcare, index) => (
                                <div
                                    key={petcare.id}
                                    className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
                                >
                                    <div className="p-5">
                                        {/* Header dengan nomor urut dan jarak */}
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex items-start gap-3 flex-1">
                                                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-[#0D99FF] to-[#0066cc] rounded-full flex items-center justify-center text-white font-bold">
                                                    {index + 1}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-2">
                                                        {petcare.name}
                                                    </h3>
                                                    {petcare.distance !== undefined && (
                                                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-[#0D99FF] text-xs font-medium rounded-full">
                                                            <Navigation className="w-3 h-3" />
                                                            {petcare.distance.toFixed(1)} km
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Address */}
                                        <div className="flex items-start gap-2 mb-3 text-sm text-gray-600">
                                            <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-gray-400" />
                                            <p className="line-clamp-2">{petcare.address}</p>
                                        </div>

                                        {/* Phone */}
                                        <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
                                            <Phone className="w-4 h-4 flex-shrink-0 text-gray-400" />
                                            <a href={`tel:${petcare.phone}`} className="text-[#0D99FF] hover:underline">
                                                {petcare.phone}
                                            </a>
                                        </div>

                                        {/* Vet Info */}
                                        {petcare.vet_name && (
                                            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-3 mb-4">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Stethoscope className="w-4 h-4 text-purple-600" />
                                                    <span className="text-sm font-semibold text-purple-900">
                                                        Dokter Hewan
                                                    </span>
                                                </div>
                                                <p className="text-sm font-medium text-gray-900 mb-1">
                                                    {petcare.vet_name}
                                                </p>
                                                {petcare.vet_specialization && (
                                                    <p className="text-xs text-gray-600 mb-1">
                                                        {petcare.vet_specialization}
                                                    </p>
                                                )}
                                                {petcare.vet_phone && (
                                                    <a
                                                        href={`tel:${petcare.vet_phone}`}
                                                        className="text-xs text-purple-600 hover:underline"
                                                    >
                                                        📞 {petcare.vet_phone}
                                                    </a>
                                                )}
                                            </div>
                                        )}

                                        {/* Action Buttons */}
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => openMaps(petcare.latitude, petcare.longitude, petcare.name)}
                                                className="flex-1 bg-gradient-to-r from-[#0D99FF] to-[#0066cc] text-white px-4 py-2.5 rounded-xl font-medium text-sm hover:shadow-lg transition-shadow duration-200 flex items-center justify-center gap-2"
                                            >
                                                <MapPin className="w-4 h-4" />
                                                Buka Maps
                                            </button>
                                            <button
                                                onClick={() => handlePetcareClick(petcare.id)}
                                                className="flex-1 bg-white border-2 border-[#0D99FF] text-[#0D99FF] px-4 py-2.5 rounded-xl font-medium text-sm hover:bg-blue-50 transition-colors duration-200 flex items-center justify-center gap-2"
                                            >
                                                Lihat Detail
                                                <ChevronRight className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
