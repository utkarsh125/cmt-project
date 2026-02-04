import { ZodError, ZodSchema } from 'zod';

import { NextResponse } from 'next/server';

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


export function safeValidate<T>(schema: ZodSchema<T>, data: unknown) {
    return schema.safeParse(data);
}
