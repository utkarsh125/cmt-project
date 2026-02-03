import { z } from 'zod';

// Vehicle creation schema
export const vehicleCreateSchema = z.object({
    make: z.string().min(2, 'Car make must be at least 2 characters').max(50, 'Car make is too long'),
    model: z.string().min(1, 'Car model is required').max(50, 'Car model is too long'),
    year: z.number().int().min(1900).max(new Date().getFullYear() + 1).optional(),
    fuelType: z.enum(['Petrol', 'Diesel', 'LPG', 'Electric', 'Hybrid', 'Others'], {
        message: 'Please select a valid fuel type'
    }),
});

// Vehicle update schema
export const vehicleUpdateSchema = vehicleCreateSchema.partial();

// Export types
export type VehicleCreateInput = z.infer<typeof vehicleCreateSchema>;
export type VehicleUpdateInput = z.infer<typeof vehicleUpdateSchema>;
