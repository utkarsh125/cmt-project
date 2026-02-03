import { z } from 'zod';
import { emailSchema, phoneSchema, dateSchema, nameSchema, addressSchema } from './common.schema';

// Booking creation schema
export const bookingCreateSchema = z.object({
    customerName: nameSchema,
    customerEmail: emailSchema,
    customerPhone: phoneSchema,
    serviceName: z.enum(['Preventive Maintenance Service', 'Body Repair Service', 'Car Care Service'], {
        message: 'Please select a valid service'
    }),
    carMake: z.string().min(2, 'Car make must be at least 2 characters').max(50, 'Car make is too long'),
    carModel: z.string().min(1, 'Car model is required').max(50, 'Car model is too long'),
    fuelType: z.enum(['Petrol', 'Diesel', 'LPG', 'Others'], {
        message: 'Please select a valid fuel type'
    }),
    appointmentDate: dateSchema,
    address: addressSchema,
});

// Booking update schema (all fields optional)
export const bookingUpdateSchema = z.object({
    customerName: nameSchema.optional(),
    customerEmail: emailSchema.optional(),
    customerPhone: phoneSchema.optional(),
    serviceName: z.enum(['Preventive Maintenance Service', 'Body Repair Service', 'Car Care Service']).optional(),
    carMake: z.string().min(2).max(50).optional(),
    carModel: z.string().min(1).max(50).optional(),
    fuelType: z.enum(['Petrol', 'Diesel', 'LPG', 'Others']).optional(),
    appointmentDate: dateSchema.optional(),
    address: addressSchema.optional(),
    status: z.enum(['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED']).optional(),
}).refine(data => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for update'
});

// ID parameter validation
export const idParamSchema = z.object({
    id: z.string().regex(/^\d+$/, 'ID must be a valid number').transform(Number),
});

// Export types for TypeScript
export type BookingCreateInput = z.infer<typeof bookingCreateSchema>;
export type BookingUpdateInput = z.infer<typeof bookingUpdateSchema>;
export type IdParam = z.infer<typeof idParamSchema>;
