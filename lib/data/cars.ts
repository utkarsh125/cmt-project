// Car brands and models database for Indian market
// Each brand has 5 popular models with fuel type and segment info

export interface CarModel {
    name: string;
    fuelTypes: ('Petrol' | 'Diesel' | 'CNG' | 'Electric')[];
    segment: 'economy' | 'midsize' | 'premium' | 'luxury';
    priceMultiplier: number; // For dynamic service pricing
}

export interface CarBrand {
    name: string;
    models: CarModel[];
}

export const CAR_BRANDS: CarBrand[] = [
    {
        name: 'Maruti Suzuki',
        models: [
            { name: 'Swift', fuelTypes: ['Petrol', 'CNG'], segment: 'economy', priceMultiplier: 1.0 },
            { name: 'Baleno', fuelTypes: ['Petrol', 'CNG'], segment: 'economy', priceMultiplier: 1.1 },
            { name: 'Brezza', fuelTypes: ['Petrol', 'CNG'], segment: 'midsize', priceMultiplier: 1.2 },
            { name: 'Ertiga', fuelTypes: ['Petrol', 'CNG'], segment: 'midsize', priceMultiplier: 1.3 },
            { name: 'Grand Vitara', fuelTypes: ['Petrol', 'Diesel'], segment: 'premium', priceMultiplier: 1.5 },
        ],
    },
    {
        name: 'Hyundai',
        models: [
            { name: 'i20', fuelTypes: ['Petrol'], segment: 'economy', priceMultiplier: 1.1 },
            { name: 'Venue', fuelTypes: ['Petrol', 'Diesel'], segment: 'midsize', priceMultiplier: 1.2 },
            { name: 'Creta', fuelTypes: ['Petrol', 'Diesel'], segment: 'midsize', priceMultiplier: 1.4 },
            { name: 'Verna', fuelTypes: ['Petrol', 'Diesel'], segment: 'premium', priceMultiplier: 1.3 },
            { name: 'Tucson', fuelTypes: ['Petrol', 'Diesel'], segment: 'luxury', priceMultiplier: 1.8 },
        ],
    },
    {
        name: 'Tata Motors',
        models: [
            { name: 'Tiago', fuelTypes: ['Petrol', 'CNG', 'Electric'], segment: 'economy', priceMultiplier: 1.0 },
            { name: 'Altroz', fuelTypes: ['Petrol', 'Diesel'], segment: 'economy', priceMultiplier: 1.1 },
            { name: 'Nexon', fuelTypes: ['Petrol', 'Diesel', 'Electric'], segment: 'midsize', priceMultiplier: 1.3 },
            { name: 'Harrier', fuelTypes: ['Diesel'], segment: 'premium', priceMultiplier: 1.5 },
            { name: 'Safari', fuelTypes: ['Diesel'], segment: 'premium', priceMultiplier: 1.6 },
        ],
    },
    {
        name: 'Mahindra',
        models: [
            { name: 'XUV300', fuelTypes: ['Petrol', 'Diesel'], segment: 'midsize', priceMultiplier: 1.2 },
            { name: 'XUV400', fuelTypes: ['Electric'], segment: 'midsize', priceMultiplier: 1.4 },
            { name: 'Scorpio-N', fuelTypes: ['Petrol', 'Diesel'], segment: 'premium', priceMultiplier: 1.5 },
            { name: 'XUV700', fuelTypes: ['Petrol', 'Diesel'], segment: 'premium', priceMultiplier: 1.6 },
            { name: 'Thar', fuelTypes: ['Petrol', 'Diesel'], segment: 'premium', priceMultiplier: 1.4 },
        ],
    },
    {
        name: 'Honda',
        models: [
            { name: 'Amaze', fuelTypes: ['Petrol'], segment: 'economy', priceMultiplier: 1.1 },
            { name: 'City', fuelTypes: ['Petrol', 'Diesel'], segment: 'midsize', priceMultiplier: 1.3 },
            { name: 'City e:HEV', fuelTypes: ['Petrol'], segment: 'premium', priceMultiplier: 1.5 },
            { name: 'Elevate', fuelTypes: ['Petrol'], segment: 'midsize', priceMultiplier: 1.4 },
            { name: 'CR-V', fuelTypes: ['Petrol'], segment: 'luxury', priceMultiplier: 1.8 },
        ],
    },
];

// Helper function to get models for a brand
export function getModelsForBrand(brandName: string): CarModel[] {
    const brand = CAR_BRANDS.find(b => b.name === brandName);
    return brand?.models || [];
}

// Helper function to get fuel types for a specific model
export function getFuelTypesForModel(brandName: string, modelName: string): string[] {
    const models = getModelsForBrand(brandName);
    const model = models.find(m => m.name === modelName);
    return model?.fuelTypes || ['Petrol'];
}

// Helper function to get price multiplier for dynamic pricing
export function getPriceMultiplier(brandName: string, modelName: string): number {
    const models = getModelsForBrand(brandName);
    const model = models.find(m => m.name === modelName);
    return model?.priceMultiplier || 1.0;
}

// Base prices for services (in INR)
export const SERVICE_BASE_PRICES: Record<string, number> = {
    'Preventive Maintenance Service': 3500,
    'Body Repair Service': 5000,
    'Car Care Service': 2500,
};

// Calculate dynamic price based on car and service
export function calculateServicePrice(
    brandName: string,
    modelName: string,
    serviceName: string
): number {
    const basePrice = SERVICE_BASE_PRICES[serviceName] || 3500;
    const multiplier = getPriceMultiplier(brandName, modelName);
    return Math.round(basePrice * multiplier);
}
