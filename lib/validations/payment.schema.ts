import { z } from 'zod';

// Payment creation schema
export const paymentCreateSchema = z.object({
    bookingId: z.number().int().positive('Booking ID is required'),
    amount: z.number().positive('Amount must be greater than 0'),
    method: z.enum(['CARD', 'UPI', 'NET_BANKING', 'CASH'], {
        message: 'Please select a valid payment method'
    }),
});

// Payment update schema
export const paymentUpdateSchema = z.object({
    status: z.enum(['PENDING', 'COMPLETED', 'FAILED']),
    transactionId: z.string().optional(),
});

// Export types
export type PaymentCreateInput = z.infer<typeof paymentCreateSchema>;
export type PaymentUpdateInput = z.infer<typeof paymentUpdateSchema>;
