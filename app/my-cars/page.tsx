'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUser, getAuthToken, logout } from '@/lib/auth-utils';
import { toast } from 'sonner';
import { Car, Plus, Trash, GasPump, X } from '@phosphor-icons/react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

interface Vehicle {
    id: number;
    make: string;
    model: string;
    year?: number;
    fuelType: string;
}

export default function MyCarsPage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);

    // Form fields
    const [make, setMake] = useState('');
    const [model, setModel] = useState('');
    const [year, setYear] = useState('');
    const [fuelType, setFuelType] = useState('Petrol');

    useEffect(() => {
        const userData = getUser();
        if (!userData) {
            router.push('/login');
            return;
        }
        setUser(userData);
        fetchVehicles();
    }, [router]);

    const fetchVehicles = async () => {
        try {
            const token = getAuthToken();
            const response = await fetch('/api/vehicles', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            const data = await response.json();
            if (response.ok) {
                setVehicles(data.vehicles || []);
            }
        } catch (error) {
            console.error('Error fetching vehicles:', error);
            toast.error('Failed to load vehicles');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        toast.success('Logged out successfully');
        router.push('/');
    };

    const handleAddVehicle = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const token = getAuthToken();
            const response = await fetch('/api/vehicles', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    make,
                    model,
                    year: year ? parseInt(year) : undefined,
                    fuelType,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success('Vehicle added successfully!');
                setMake('');
                setModel('');
                setYear('');
                setFuelType('Petrol');
                setShowAddForm(false);
                fetchVehicles();
            } else {
                if (data.errors) {
                    data.errors.forEach((err: any) => toast.error(err.message));
                } else {
                    toast.error(data.message || 'Failed to add vehicle');
                }
            }
        } catch (error) {
            console.error('Error adding vehicle:', error);
            toast.error('Something went wrong');
        }
    };

    const handleDeleteVehicle = async (id: number) => {
        if (!confirm('Are you sure you want to delete this vehicle?')) return;

        try {
            const token = getAuthToken();
            const response = await fetch(`/api/vehicles/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                toast.success('Vehicle deleted successfully');
                fetchVehicles();
            } else {
                toast.error('Failed to delete vehicle');
            }
        } catch (error) {
            console.error('Error deleting vehicle:', error);
            toast.error('Something went wrong');
        }
    };

    if (!user) return null;

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <Navbar user={user} onLogout={handleLogout} isLoggedIn={true} />

            <main className="container mx-auto py-16 px-6 flex-grow">
                <div className="max-w-4xl mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <div className="flex items-center gap-3">
                            <Car size={32} weight="duotone" className="text-blue-600" />
                            <h2 className="text-3xl font-bold text-black">My Vehicles</h2>
                        </div>
                        <button
                            onClick={() => setShowAddForm(!showAddForm)}
                            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
                        >
                            {showAddForm ? (
                                <>
                                    <X size={20} />
                                    Cancel
                                </>
                            ) : (
                                <>
                                    <Plus size={20} />
                                    Add Vehicle
                                </>
                            )}
                        </button>
                    </div>

                    {showAddForm && (
                        <form onSubmit={handleAddVehicle} className="bg-gray-50 p-6 rounded-lg mb-8 space-y-4">
                            <h3 className="text-xl font-semibold text-black mb-4">Add New Vehicle</h3>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block font-medium mb-2 text-black">Car Make:</label>
                                    <input
                                        type="text"
                                        value={make}
                                        onChange={(e) => setMake(e.target.value)}
                                        placeholder="Toyota, Honda..."
                                        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block font-medium mb-2 text-black">Car Model:</label>
                                    <input
                                        type="text"
                                        value={model}
                                        onChange={(e) => setModel(e.target.value)}
                                        placeholder="Camry, Civic..."
                                        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block font-medium mb-2 text-black">Year (Optional):</label>
                                    <input
                                        type="number"
                                        value={year}
                                        onChange={(e) => setYear(e.target.value)}
                                        placeholder="2020"
                                        min="1900"
                                        max={new Date().getFullYear() + 1}
                                        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                                    />
                                </div>

                                <div>
                                    <label className="block font-medium mb-2 text-black">Fuel Type:</label>
                                    <select
                                        value={fuelType}
                                        onChange={(e) => setFuelType(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                                    >
                                        <option value="Petrol">Petrol</option>
                                        <option value="Diesel">Diesel</option>
                                        <option value="CNG">CNG</option>
                                        <option value="Electric">Electric</option>
                                        <option value="Hybrid">Hybrid</option>
                                    </select>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition-colors"
                            >
                                Save Vehicle
                            </button>
                        </form>
                    )}

                    {loading ? (
                        <p className="text-center text-gray-600">Loading vehicles...</p>
                    ) : vehicles.length === 0 ? (
                        <div className="text-center py-12">
                            <Car size={64} weight="duotone" className="mx-auto text-gray-300 mb-4" />
                            <p className="text-gray-600 mb-2">No vehicles added yet.</p>
                            <p className="text-sm text-gray-500">Add your vehicles for faster booking experience!</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {vehicles.map((vehicle) => (
                                <div
                                    key={vehicle.id}
                                    className="border border-gray-300 rounded-lg p-6 hover:shadow-md transition-shadow"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-start gap-3">
                                            <Car size={24} weight="duotone" className="text-blue-600 mt-1" />
                                            <div>
                                                <h3 className="text-xl font-semibold text-black">
                                                    {vehicle.make} {vehicle.model}
                                                </h3>
                                                {vehicle.year && (
                                                    <p className="text-gray-600">{vehicle.year}</p>
                                                )}
                                            </div>
                                        </div>
                                        <span className="flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                                            <GasPump size={14} />
                                            {vehicle.fuelType}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => handleDeleteVehicle(vehicle.id)}
                                        className="flex items-center gap-1 text-red-600 hover:text-red-800 text-sm font-medium"
                                    >
                                        <Trash size={16} />
                                        Delete
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
