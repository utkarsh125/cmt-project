import { NextResponse } from 'next/server';
import { ZodSchema, ZodError } from 'zod';

/**
 * Validation middleware helper for API routes
 * @param schema - Zod schema to validate against
 * @param data - Data to validate
 * @returns Validated data or error response
 */
export function validateData<T>(schema: ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; error: NextResponse } {
    try {
        const validatedData = schema.parse(data);
        return { success: true, data: validatedData };
    } catch (error) {
        if (error instanceof ZodError) {
            const formattedErrors = error.issues.map((err) => ({
                field: err.path.join('.'),
                message: err.message,
            }));

            return {
                success: false,
                error: NextResponse.json(
                    {
                        message: 'Validation failed',
                        errors: formattedErrors,
                    },
                    { status: 400 }
                ),
            };
        }

        return {
            success: false,
            error: NextResponse.json(
                { message: 'Invalid request data' },
                { status: 400 }
            ),
        };
    }
}

/**
 * Safe parse helper that returns validation result without throwing
 * @param schema - Zod schema to validate against
 * @param data - Data to validate
 * @returns Zod safe parse result
 */
export function safeValidate<T>(schema: ZodSchema<T>, data: unknown) {
    return schema.safeParse(data);
}
