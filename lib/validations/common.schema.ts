import { z } from 'zod';

// Common reusable schemas
export const emailSchema = z.string().email('Invalid email address');

export const phoneSchema = z.string().regex(/^\+?\d{10,15}$/, 'Invalid phone number format');

export const dateSchema = z.string().refine((date) => {
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDate >= today;
}, 'Date must be in the future');

export const nameSchema = z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name is too long');

export const addressSchema = z.string().min(10, 'Address must be at least 10 characters').max(500, 'Address is too long');
