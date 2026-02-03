'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getUser, getAuthToken, logout } from '@/lib/auth-utils';
import { toast } from 'sonner';
import { Car, CalendarCheck, Envelope, Star, MapPin } from '@phosphor-icons/react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { bookingCreateSchema } from '@/lib/validations/booking.schema';
import { CAR_BRANDS, getModelsForBrand, getFuelTypesForModel, calculateServicePrice, SERVICE_BASE_PRICES } from '@/lib/data/cars';

interface Vehicle {
    id: number;
    make: string;
    model: string;
    year?: number;
    fuelType: string;
}

function BookingForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [user, setUser] = useState<any>(null);
    const [isGuest, setIsGuest] = useState(false);
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [selectedVehicle, setSelectedVehicle] = useState<string>('');

    // Form fields
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneCode, setPhoneCode] = useState('+91');
    const [phone, setPhone] = useState('');
    const [service, setService] = useState('');

    // Car selection (dropdown-based)
    const [selectedBrand, setSelectedBrand] = useState('');
    const [selectedModel, setSelectedModel] = useState('');
    const [availableModels, setAvailableModels] = useState<any[]>([]);
    const [availableFuelTypes, setAvailableFuelTypes] = useState<string[]>([]);
    const [fuelType, setFuelType] = useState('');

    const [appointmentDate, setAppointmentDate] = useState('');
    const [address, setAddress] = useState('');

    // Dynamic pricing
    const [estimatedPrice, setEstimatedPrice] = useState<number | null>(null);

    useEffect(() => {
        const userData = getUser();
        if (userData) {
            setUser(userData);
            setIsGuest(false);
            setName(userData.name || '');
            setEmail(userData.email || '');
            fetchVehicles();
        } else {
            setIsGuest(true);
        }

        const serviceParam = searchParams.get('service');
        if (serviceParam) {
            if (serviceParam === 'preventive-maintenance') {
                setService('Preventive Maintenance Service');
            } else if (serviceParam === 'body-repair') {
                setService('Body Repair Service');
            } else if (serviceParam === 'car-care') {
                setService('Car Care Service');
            }
        }
    }, [searchParams]);

    // Update models when brand changes
    useEffect(() => {
        if (selectedBrand) {
            const models = getModelsForBrand(selectedBrand);
            setAvailableModels(models);
            setSelectedModel('');
            setFuelType('');
            setAvailableFuelTypes([]);
        }
    }, [selectedBrand]);

    // Update fuel types when model changes
    useEffect(() => {
        if (selectedBrand && selectedModel) {
            const fuelTypes = getFuelTypesForModel(selectedBrand, selectedModel);
            setAvailableFuelTypes(fuelTypes);
            setFuelType(fuelTypes[0] || '');
        }
    }, [selectedBrand, selectedModel]);

    // Calculate estimated price when selections change
    useEffect(() => {
        if (selectedBrand && selectedModel && service) {
            const price = calculateServicePrice(selectedBrand, selectedModel, service);
            setEstimatedPrice(price);
        } else if (service) {
            setEstimatedPrice(SERVICE_BASE_PRICES[service] || null);
        } else {
            setEstimatedPrice(null);
        }
    }, [selectedBrand, selectedModel, service]);

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
        }
    };

    const handleVehicleSelect = (vehicleId: string) => {
        setSelectedVehicle(vehicleId);
        if (vehicleId && vehicleId !== 'new') {
            const vehicle = vehicles.find(v => v.id === parseInt(vehicleId));
            if (vehicle) {
                // Try to find matching brand and model
                const brand = CAR_BRANDS.find(b => b.name.toLowerCase().includes(vehicle.make.toLowerCase()) || vehicle.make.toLowerCase().includes(b.name.toLowerCase().split(' ')[0]));
                if (brand) {
                    setSelectedBrand(brand.name);
                    const model = brand.models.find(m => m.name.toLowerCase() === vehicle.model.toLowerCase());
                    if (model) {
                        setSelectedModel(model.name);
                        setFuelType(vehicle.fuelType);
                    }
                } else {
                    // If not found in our list, use custom entry
                    setSelectedBrand('');
                    setSelectedModel('');
                    setFuelType(vehicle.fuelType);
                }
            }
        } else if (vehicleId === 'new') {
            setSelectedBrand('');
            setSelectedModel('');
            setFuelType('');
        }
    };

    const handleLogout = () => {
        logout();
        toast.success('Logged out successfully');
        router.push('/');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedBrand || !selectedModel) {
            toast.error('Please select your car brand and model');
            return;
        }

        if (!fuelType) {
            toast.error('Please select fuel type');
            return;
        }

        const formData = {
            customerName: name,
            customerEmail: email,
            customerPhone: `${phoneCode}${phone}`,
            serviceName: service,
            carMake: selectedBrand,
            carModel: selectedModel,
            fuelType,
            appointmentDate,
            address,
        };

        const validation = bookingCreateSchema.safeParse(formData);

        if (!validation.success) {
            const firstError = validation.error.issues[0];
            toast.error(firstError.message);
            return;
        }

        try {
            const response = await fetch('/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...validation.data,
                    userId: user?.id || null,
                    vehicleId: selectedVehicle && selectedVehicle !== 'new' ? parseInt(selectedVehicle) : null,
                    estimatedPrice,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success('Booking submitted successfully!');
                router.push(`/payment/${data.booking.id}`);
            } else {
                if (data.errors && Array.isArray(data.errors)) {
                    data.errors.forEach((err: { field: string; message: string }) => {
                        toast.error(`${err.field}: ${err.message}`);
                    });
                } else {
                    toast.error(data.message || 'Failed to submit booking');
                }
            }
        } catch (error) {
            console.error('Booking error:', error);
            toast.error('Something went wrong. Please try again.');
        }
    };

    // Get minimum date (tomorrow)
    const getMinDate = () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow.toISOString().split('T')[0];
    };

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <Navbar user={user} onLogout={handleLogout} isLoggedIn={!!user} />

            <main className="container mx-auto py-16 px-6 flex-grow">
                <h2 className="text-3xl font-bold mb-2 text-center text-black">Book Your Service</h2>
                {isGuest && (
                    <p className="text-center text-gray-600 mb-6">
                        Booking as guest. <a href="/login" className="text-blue-600 hover:underline">Login</a> to save vehicles and earn reward points!
                    </p>
                )}
                {!isGuest && (
                    <p className="text-center text-green-600 mb-6 flex items-center justify-center gap-2">
                        <Star size={18} weight="fill" className="text-yellow-500" />
                        Book now and earn 100 reward points!
                    </p>
                )}

                <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-6">
                    {/* Name */}
                    <div>
                        <label htmlFor="name" className="block font-medium mb-2 text-black">Name:</label>
                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400 text-black"
                            placeholder="John Doe"
                            readOnly={!isGuest}
                            required
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label htmlFor="email" className="block font-medium mb-2 text-black">Email:</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400 text-black"
                            placeholder="john@email.com"
                            readOnly={!isGuest}
                            required
                        />
                        <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                            <Envelope size={12} />
                            Booking invoice will be sent to this email
                        </p>
                    </div>

                    {/* Phone */}
                    <div>
                        <label htmlFor="phone" className="block font-medium mb-2 text-black">Phone Number:</label>
                        <div className="flex gap-2">
                            <select
                                value={phoneCode}
                                onChange={(e) => setPhoneCode(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                            >
                                <option value="+91">+91</option>
                                <option value="+1">+1</option>
                                <option value="+44">+44</option>
                            </select>
                            <input
                                id="phone"
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400 text-black"
                                placeholder="9876543210"
                                required
                            />
                        </div>
                    </div>

                    {/* Service Selection */}
                    <div>
                        <label htmlFor="service" className="block font-medium mb-2 text-black">Select Service:</label>
                        <select
                            id="service"
                            value={service}
                            onChange={(e) => setService(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                            required
                        >
                            <option value="">--Select Service--</option>
                            <option value="Preventive Maintenance Service">Preventive Maintenance Service (from ₹3,500)</option>
                            <option value="Body Repair Service">Body Repair Service (from ₹5,000)</option>
                            <option value="Car Care Service">Car Care Service (from ₹2,500)</option>
                        </select>
                    </div>

                    {/* Saved Vehicles (for logged-in users) */}
                    {!isGuest && vehicles.length > 0 && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <label htmlFor="vehicle" className="font-medium mb-2 text-black flex items-center gap-2">
                                <Car size={20} weight="duotone" className="text-blue-600" />
                                Choose from your cars:
                            </label>
                            <select
                                id="vehicle"
                                value={selectedVehicle}
                                onChange={(e) => handleVehicleSelect(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                            >
                                <option value="">--Select or enter new--</option>
                                {vehicles.map((vehicle) => (
                                    <option key={vehicle.id} value={vehicle.id.toString()}>
                                        {vehicle.make} {vehicle.model} ({vehicle.fuelType})
                                    </option>
                                ))}
                                <option value="new">+ Enter New Car</option>
                            </select>
                        </div>
                    )}

                    {/* Car Brand Dropdown */}
                    <div>
                        <label htmlFor="brand" className="block font-medium mb-2 text-black">Car Brand:</label>
                        <select
                            id="brand"
                            value={selectedBrand}
                            onChange={(e) => setSelectedBrand(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                            required
                            disabled={!!(selectedVehicle && selectedVehicle !== 'new')}
                        >
                            <option value="">--Select Brand--</option>
                            {CAR_BRANDS.map((brand) => (
                                <option key={brand.name} value={brand.name}>
                                    {brand.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Car Model Dropdown */}
                    <div>
                        <label htmlFor="model" className="block font-medium mb-2 text-black">Car Model:</label>
                        <select
                            id="model"
                            value={selectedModel}
                            onChange={(e) => setSelectedModel(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                            required
                            disabled={!selectedBrand || !!(selectedVehicle && selectedVehicle !== 'new')}
                        >
                            <option value="">--Select Model--</option>
                            {availableModels.map((model) => (
                                <option key={model.name} value={model.name}>
                                    {model.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Fuel Type */}
                    {availableFuelTypes.length > 0 && (
                        <div>
                            <label className="block font-medium mb-2 text-black">Fuel Type:</label>
                            <div className="flex gap-4 flex-wrap">
                                {availableFuelTypes.map((fuel) => (
                                    <label key={fuel} className="flex items-center text-black">
                                        <input
                                            type="radio"
                                            name="fuelType"
                                            value={fuel}
                                            checked={fuelType === fuel}
                                            onChange={(e) => setFuelType(e.target.value)}
                                            className="mr-2"
                                            disabled={!!(selectedVehicle && selectedVehicle !== 'new')}
                                        />
                                        {fuel}
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Estimated Price Display */}
                    {estimatedPrice && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <div className="flex justify-between items-center">
                                <span className="text-green-800 font-medium">Estimated Service Cost:</span>
                                <span className="text-2xl font-bold text-green-600">₹{estimatedPrice.toLocaleString('en-IN')}</span>
                            </div>
                            <p className="text-xs text-green-600 mt-1">*Final price may vary based on inspection</p>
                        </div>
                    )}

                    {/* Appointment Date */}
                    <div>
                        <label htmlFor="appointmentDate" className="block font-medium mb-2 text-black">Appointment Date:</label>
                        <input
                            id="appointmentDate"
                            type="date"
                            value={appointmentDate}
                            onChange={(e) => setAppointmentDate(e.target.value)}
                            min={getMinDate()}
                            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                            required
                        />
                    </div>

                    {/* Address */}
                    <div>
                        <label htmlFor="address" className="block font-medium mb-2 text-black">Service Address:</label>
                        <textarea
                            id="address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            rows={3}
                            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400 text-black"
                            placeholder="Enter your complete address where service is needed..."
                            required
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg"
                    >
                        {isGuest ? 'Book as Guest' : 'Book & Earn Points'} →
                    </button>
                </form>
            </main>

            <Footer />
        </div>
    );
}

export default function BookingPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <BookingForm />
        </Suspense>
    );
}
