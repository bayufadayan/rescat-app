import React from 'react';
import { router, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { MapPin, Phone, Navigation, ArrowLeft, Stethoscope, Building2 } from 'lucide-react';

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
    created_at: string;
};

type PetcareDetailProps = {
    petcare: Petcare;
};

export default function PetcareDetail() {
    const { petcare } = usePage<PetcareDetailProps>().props;

    const openMaps = () => {
        const url = `https://www.google.com/maps/search/?api=1&query=${petcare.latitude},${petcare.longitude}&query_place_id=${encodeURIComponent(petcare.name)}`;
        window.open(url, '_blank');
    };

    const callPhone = (phone: string) => {
        window.location.href = `tel:${phone}`;
    };

    const goBack = () => {
        router.visit('/petcares');
    };

    return (
        <AppLayout>
            <div className="flex flex-col bg-white w-full min-h-screen relative pb-20">
                {/* Header */}
                <div className="bg-gradient-to-r from-[#0D99FF] to-[#0066cc] px-6 pt-20 pb-6 text-white relative">
                    <button
                        onClick={goBack}
                        className="absolute left-4 top-20 p-2 hover:bg-white/10 rounded-full transition-colors"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <div className="text-center pt-8">
                        <h1 className="text-xl font-bold mb-1">Detail Petcare</h1>
                        <p className="text-sm opacity-90">Informasi lengkap layanan perawatan</p>
                    </div>
                </div>

                <div className="px-4 py-6">
                    {/* Main Info Card */}
                    <div className="bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden mb-4">
                        {/* Nama Petcare */}
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 px-6 py-8 text-center border-b border-gray-100">
                            <div className="w-20 h-20 bg-gradient-to-br from-[#0D99FF] to-[#0066cc] rounded-full flex items-center justify-center mx-auto mb-4">
                                <Building2 className="w-10 h-10 text-white" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                {petcare.name}
                            </h2>
                            <div className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                Buka Sekarang
                            </div>
                        </div>

                        {/* Contact Info */}
                        <div className="p-6 space-y-4">
                            {/* Address */}
                            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                                <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                    <MapPin className="w-5 h-5 text-[#0D99FF]" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Alamat</p>
                                    <p className="text-sm text-gray-900">{petcare.address}</p>
                                </div>
                            </div>

                            {/* Phone */}
                            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                                <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                    <Phone className="w-5 h-5 text-green-600" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Telepon</p>
                                    <a
                                        href={`tel:${petcare.phone}`}
                                        className="text-sm font-medium text-[#0D99FF] hover:underline"
                                    >
                                        {petcare.phone}
                                    </a>
                                </div>
                            </div>

                            {/* Coordinates */}
                            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                                <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                                    <Navigation className="w-5 h-5 text-purple-600" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Koordinat</p>
                                    <p className="text-sm text-gray-900">
                                        {petcare.latitude}, {petcare.longitude}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Vet Info Card */}
                    {petcare.vet_name && (
                        <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-2xl shadow-lg overflow-hidden mb-4">
                            <div className="px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                                        <Stethoscope className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold">Dokter Hewan</h3>
                                        <p className="text-sm opacity-90">Informasi dokter yang bertugas</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 space-y-4">
                                {/* Vet Name */}
                                <div>
                                    <p className="text-xs font-semibold text-purple-600 uppercase mb-1">Nama Dokter</p>
                                    <p className="text-lg font-bold text-gray-900">{petcare.vet_name}</p>
                                </div>

                                {/* Specialization */}
                                {petcare.vet_specialization && (
                                    <div>
                                        <p className="text-xs font-semibold text-purple-600 uppercase mb-1">
                                            Spesialisasi
                                        </p>
                                        <p className="text-sm text-gray-900">{petcare.vet_specialization}</p>
                                    </div>
                                )}

                                {/* Vet Phone */}
                                {petcare.vet_phone && (
                                    <div>
                                        <p className="text-xs font-semibold text-purple-600 uppercase mb-1">
                                            Telepon Dokter
                                        </p>
                                        <a
                                            href={`tel:${petcare.vet_phone}`}
                                            className="text-sm font-medium text-purple-600 hover:underline flex items-center gap-2"
                                        >
                                            <Phone className="w-4 h-4" />
                                            {petcare.vet_phone}
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-3">
                        <button
                            onClick={openMaps}
                            className="w-full bg-gradient-to-r from-[#0D99FF] to-[#0066cc] text-white px-6 py-4 rounded-xl font-semibold text-base hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-3"
                        >
                            <MapPin className="w-5 h-5" />
                            Buka di Google Maps
                        </button>

                        <button
                            onClick={() => callPhone(petcare.phone)}
                            className="w-full bg-green-500 text-white px-6 py-4 rounded-xl font-semibold text-base hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-3"
                        >
                            <Phone className="w-5 h-5" />
                            Hubungi Sekarang
                        </button>

                        {petcare.vet_phone && (
                            <button
                                onClick={() => callPhone(petcare.vet_phone!)}
                                className="w-full bg-purple-500 text-white px-6 py-4 rounded-xl font-semibold text-base hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-3"
                            >
                                <Stethoscope className="w-5 h-5" />
                                Hubungi Dokter Hewan
                            </button>
                        )}
                    </div>

                    {/* Info Box */}
                    <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                        <p className="text-xs text-yellow-800">
                            <span className="font-semibold">💡 Tips:</span> Hubungi terlebih dahulu untuk memastikan
                            ketersediaan layanan dan jadwal operasional.
                        </p>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
