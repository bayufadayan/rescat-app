import React, { useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { ArrowLeft, Cat } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

export default function CreateCat() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        breed: '',
        gender: '',
        birth_date: '',
        avatar: null as File | null,
    });

    const [previewAvatar, setPreviewAvatar] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/cats', {
            forceFormData: true,
        });
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('avatar', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewAvatar(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <AppLayout>
            <Head title="Add New Cat" />
            
            <div className="flex flex-col w-full min-h-screen bg-[#EAF2F9] pb-24">
                {/* Header */}
                <div className="bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-600 px-4 pt-6 pb-8 shadow-lg">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => router.visit('/cats')}
                            className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <h1 className="text-xl font-bold text-white">Add New Cat</h1>
                    </div>
                </div>

                {/* Form */}
                <div className="px-4 py-6">
                    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-md p-6 space-y-6">
                        {/* Avatar Upload */}
                        <div className="space-y-2">
                            <Label htmlFor="avatar">Photo (Optional)</Label>
                            <div className="flex items-center gap-4">
                                <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                                    {previewAvatar ? (
                                        <img
                                            src={previewAvatar}
                                            alt="Preview"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <Cat className="w-12 h-12 text-white" />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <Input
                                        id="avatar"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleAvatarChange}
                                        className="cursor-pointer"
                                    />
                                    {errors.avatar && (
                                        <p className="text-sm text-red-600 mt-1">{errors.avatar}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Name */}
                        <div className="space-y-2">
                            <Label htmlFor="name">Name *</Label>
                            <Input
                                id="name"
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="Enter cat name"
                                className={errors.name ? 'border-red-500' : ''}
                                required
                            />
                            {errors.name && (
                                <p className="text-sm text-red-600">{errors.name}</p>
                            )}
                        </div>

                        {/* Breed */}
                        <div className="space-y-2">
                            <Label htmlFor="breed">Breed (Optional)</Label>
                            <Input
                                id="breed"
                                type="text"
                                value={data.breed}
                                onChange={(e) => setData('breed', e.target.value)}
                                placeholder="e.g., Persian, Siamese, etc."
                            />
                            {errors.breed && (
                                <p className="text-sm text-red-600">{errors.breed}</p>
                            )}
                        </div>

                        {/* Gender */}
                        <div className="space-y-2">
                            <Label htmlFor="gender">Gender (Optional)</Label>
                            <Select
                                value={data.gender}
                                onValueChange={(value) => setData('gender', value)}
                            >
                                <SelectTrigger className={errors.gender ? 'border-red-500' : ''}>
                                    <SelectValue placeholder="Select gender" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="male">Male</SelectItem>
                                    <SelectItem value="female">Female</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.gender && (
                                <p className="text-sm text-red-600">{errors.gender}</p>
                            )}
                        </div>

                        {/* Birth Date */}
                        <div className="space-y-2">
                            <Label htmlFor="birth_date">Birth Date (Optional)</Label>
                            <Input
                                id="birth_date"
                                type="date"
                                value={data.birth_date}
                                onChange={(e) => setData('birth_date', e.target.value)}
                                max={new Date().toISOString().split('T')[0]}
                            />
                            {errors.birth_date && (
                                <p className="text-sm text-red-600">{errors.birth_date}</p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <div className="flex gap-3 pt-4">
                            <Button
                                type="button"
                                onClick={() => router.visit('/cats')}
                                variant="outline"
                                className="flex-1 rounded-full"
                                disabled={processing}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="flex-1 bg-gradient-to-r from-[#0D99FF] to-[#0066cc] text-white rounded-full hover:shadow-lg transition-all"
                                disabled={processing}
                            >
                                {processing ? 'Saving...' : 'Add Cat'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
