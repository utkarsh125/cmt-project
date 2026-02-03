import { Resend } from 'resend';

// Initialize Resend only if API key is available
const resend = process.env.RESEND_API_KEY
    ? new Resend(process.env.RESEND_API_KEY)
    : null;

interface BookingInvoiceData {
    customerName: string;
    customerEmail: string;
    bookingId: number;
    serviceName: string;
    carBrand: string;
    carModel: string;
    fuelType: string;
    appointmentDate: string;
    address: string;
    amount: number;
    transactionId?: string;
    rewardPoints?: number;
}

export async function sendBookingInvoice(data: BookingInvoiceData) {
    // Skip if Resend is not configured
    if (!resend) {
        console.log('Email service not configured (RESEND_API_KEY missing). Skipping invoice email.');
        return { success: false, error: 'Email service not configured' };
    }
    const formattedDate = new Date(data.appointmentDate).toLocaleDateString('en-IN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Booking Confirmation - AutoMob-Mechanic</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4;">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
            <!-- Header -->
            <tr>
                <td style="background-color: #2563eb; padding: 30px; text-align: center;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 28px;">AutoMob-Mechanic</h1>
                    <p style="color: #bfdbfe; margin: 10px 0 0 0; font-size: 14px;">Your Trusted Car Service Partner</p>
                </td>
            </tr>
            
            <!-- Success Badge -->
            <tr>
                <td style="padding: 30px; text-align: center; background-color: #f0fdf4;">
                    <div style="font-size: 48px; margin-bottom: 10px;">✅</div>
                    <h2 style="color: #166534; margin: 0; font-size: 24px;">Booking Confirmed!</h2>
                    <p style="color: #15803d; margin: 10px 0 0 0;">Your service has been scheduled successfully</p>
                </td>
            </tr>
            
            <!-- Booking Details -->
            <tr>
                <td style="padding: 30px;">
                    <h3 style="color: #1f2937; margin: 0 0 20px 0; font-size: 18px; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">Booking Details</h3>
                    
                    <table width="100%" cellpadding="8" cellspacing="0">
                        <tr>
                            <td style="color: #6b7280; width: 40%;">Booking ID</td>
                            <td style="color: #1f2937; font-weight: bold;">#${data.bookingId}</td>
                        </tr>
                        <tr style="background-color: #f9fafb;">
                            <td style="color: #6b7280;">Customer Name</td>
                            <td style="color: #1f2937;">${data.customerName}</td>
                        </tr>
                        <tr>
                            <td style="color: #6b7280;">Service</td>
                            <td style="color: #1f2937; font-weight: bold;">${data.serviceName}</td>
                        </tr>
                        <tr style="background-color: #f9fafb;">
                            <td style="color: #6b7280;">Vehicle</td>
                            <td style="color: #1f2937;">${data.carBrand} ${data.carModel} (${data.fuelType})</td>
                        </tr>
                        <tr>
                            <td style="color: #6b7280;">Appointment Date</td>
                            <td style="color: #1f2937;">${formattedDate}</td>
                        </tr>
                        <tr style="background-color: #f9fafb;">
                            <td style="color: #6b7280;">Service Address</td>
                            <td style="color: #1f2937;">${data.address}</td>
                        </tr>
                    </table>
                </td>
            </tr>
            
            <!-- Payment Details -->
            <tr>
                <td style="padding: 0 30px 30px 30px;">
                    <div style="background-color: #eff6ff; border-radius: 8px; padding: 20px;">
                        <h3 style="color: #1e40af; margin: 0 0 15px 0; font-size: 16px;">Payment Summary</h3>
                        <table width="100%" cellpadding="5" cellspacing="0">
                            <tr>
                                <td style="color: #3b82f6;">Amount Paid</td>
                                <td style="color: #1e40af; font-weight: bold; font-size: 20px; text-align: right;">₹${data.amount.toLocaleString('en-IN')}</td>
                            </tr>
                            ${data.transactionId ? `
                            <tr>
                                <td style="color: #6b7280; font-size: 12px;">Transaction ID</td>
                                <td style="color: #6b7280; font-size: 12px; text-align: right;">${data.transactionId}</td>
                            </tr>
                            ` : ''}
                            ${data.rewardPoints && data.rewardPoints > 0 ? `
                            <tr>
                                <td style="color: #059669; font-size: 14px;">🌟 Reward Points Earned</td>
                                <td style="color: #059669; font-weight: bold; text-align: right;">+${data.rewardPoints}</td>
                            </tr>
                            ` : ''}
                        </table>
                    </div>
                </td>
            </tr>
            
            <!-- What's Next -->
            <tr>
                <td style="padding: 0 30px 30px 30px;">
                    <h3 style="color: #1f2937; margin: 0 0 15px 0; font-size: 16px;">What's Next?</h3>
                    <ol style="color: #4b5563; margin: 0; padding-left: 20px; line-height: 1.8;">
                        <li>Our technician will arrive at your location on the scheduled date</li>
                        <li>They will carry all necessary tools and equipment</li>
                        <li>Service typically takes 2-4 hours depending on the type</li>
                        <li>You'll receive a completion notification via email</li>
                    </ol>
                </td>
            </tr>
            
            <!-- Contact -->
            <tr>
                <td style="padding: 0 30px 30px 30px; text-align: center;">
                    <p style="color: #6b7280; margin: 0 0 10px 0; font-size: 14px;">Need help? Contact us:</p>
                    <p style="margin: 0;">
                        <a href="mailto:contact@automob.co.in" style="color: #2563eb; text-decoration: none;">contact@automob.co.in</a>
                        <span style="color: #d1d5db; margin: 0 10px;">|</span>
                        <span style="color: #4b5563;">999-999-9999</span>
                    </p>
                </td>
            </tr>
            
            <!-- Footer -->
            <tr>
                <td style="background-color: #1f2937; padding: 25px; text-align: center;">
                    <p style="color: #9ca3af; margin: 0; font-size: 12px;">
                        © ${new Date().getFullYear()} AutoMob-Mechanic. All rights reserved.
                    </p>
                    <p style="color: #6b7280; margin: 10px 0 0 0; font-size: 11px;">
                        This is an automated confirmation email. Please do not reply directly.
                    </p>
                </td>
            </tr>
        </table>
    </body>
    </html>
    `;

    try {
        const { data: emailData, error } = await resend.emails.send({
            from: 'AutoMob-Mechanic <onboarding@resend.dev>', // Use your verified domain
            to: data.customerEmail,
            subject: `Booking Confirmed #${data.bookingId} - ${data.serviceName}`,
            html: emailHtml,
        });

        if (error) {
            console.error('Error sending email:', error);
            return { success: false, error };
        }

        console.log('Email sent successfully:', emailData);
        return { success: true, data: emailData };
    } catch (error) {
        console.error('Email service error:', error);
        return { success: false, error };
    }
}

interface CancellationEmailData {
    customerName: string;
    customerEmail: string;
    bookingId: number;
    serviceName: string;
    carBrand: string;
    carModel: string;
    appointmentDate: string;
    wasPrepaid: boolean;
    refundAmount?: number;
}

export async function sendCancellationEmail(data: CancellationEmailData) {
    if (!resend) {
        console.log('Email service not configured. Skipping cancellation email.');
        return { success: false, error: 'Email service not configured' };
    }

    const formattedDate = new Date(data.appointmentDate).toLocaleDateString('en-IN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    const refundMessage = data.wasPrepaid && data.refundAmount
        ? `
        <tr>
            <td style="padding: 20px; background-color: #fef3c7; border-radius: 8px;">
                <h3 style="color: #92400e; margin: 0 0 10px 0; font-size: 16px;">Refund Information</h3>
                <p style="color: #78350f; margin: 0;">
                    Your refund of <strong>₹${data.refundAmount.toLocaleString('en-IN')}</strong> will be processed within 
                    <strong>1-2 weeks</strong> to your original payment method.
                </p>
                <p style="color: #92400e; margin: 10px 0 0 0; font-size: 12px;">
                    If you don't receive the refund within 2 weeks, please contact our support team.
                </p>
            </td>
        </tr>
        `
        : '';

    const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Booking Cancelled - AutoMob-Mechanic</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4;">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
            <!-- Header -->
            <tr>
                <td style="background-color: #2563eb; padding: 30px; text-align: center;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 28px;">AutoMob-Mechanic</h1>
                    <p style="color: #bfdbfe; margin: 10px 0 0 0; font-size: 14px;">Your Trusted Car Service Partner</p>
                </td>
            </tr>
            
            <!-- Cancellation Badge -->
            <tr>
                <td style="padding: 30px; text-align: center; background-color: #fef2f2;">
                    <div style="font-size: 48px; margin-bottom: 10px;">❌</div>
                    <h2 style="color: #991b1b; margin: 0; font-size: 24px;">Booking Cancelled</h2>
                    <p style="color: #dc2626; margin: 10px 0 0 0;">Your booking has been cancelled as requested</p>
                </td>
            </tr>
            
            <!-- Booking Details -->
            <tr>
                <td style="padding: 30px;">
                    <h3 style="color: #1f2937; margin: 0 0 20px 0; font-size: 18px; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">Cancelled Booking Details</h3>
                    
                    <table width="100%" cellpadding="8" cellspacing="0">
                        <tr>
                            <td style="color: #6b7280; width: 40%;">Booking ID</td>
                            <td style="color: #1f2937; font-weight: bold;">#${data.bookingId}</td>
                        </tr>
                        <tr style="background-color: #f9fafb;">
                            <td style="color: #6b7280;">Customer Name</td>
                            <td style="color: #1f2937;">${data.customerName}</td>
                        </tr>
                        <tr>
                            <td style="color: #6b7280;">Service</td>
                            <td style="color: #1f2937;">${data.serviceName}</td>
                        </tr>
                        <tr style="background-color: #f9fafb;">
                            <td style="color: #6b7280;">Vehicle</td>
                            <td style="color: #1f2937;">${data.carBrand} ${data.carModel}</td>
                        </tr>
                        <tr>
                            <td style="color: #6b7280;">Scheduled Date</td>
                            <td style="color: #1f2937;">${formattedDate}</td>
                        </tr>
                    </table>
                </td>
            </tr>
            
            ${refundMessage}
            
            <!-- Rebook CTA -->
            <tr>
                <td style="padding: 20px 30px 30px 30px; text-align: center;">
                    <p style="color: #4b5563; margin: 0 0 15px 0;">Changed your mind? Book again anytime!</p>
                    <a href="https://automob.co.in/booking" style="display: inline-block; background-color: #2563eb; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">Book New Service</a>
                </td>
            </tr>
            
            <!-- Footer -->
            <tr>
                <td style="background-color: #1f2937; padding: 25px; text-align: center;">
                    <p style="color: #9ca3af; margin: 0; font-size: 12px;">
                        © ${new Date().getFullYear()} AutoMob-Mechanic. All rights reserved.
                    </p>
                    <p style="color: #6b7280; margin: 10px 0 0 0; font-size: 11px;">
                        Need help? Contact us at contact@automob.co.in
                    </p>
                </td>
            </tr>
        </table>
    </body>
    </html>
    `;

    try {
        const { data: emailData, error } = await resend.emails.send({
            from: 'AutoMob-Mechanic <onboarding@resend.dev>',
            to: data.customerEmail,
            subject: `Booking Cancelled #${data.bookingId} - ${data.serviceName}`,
            html: emailHtml,
        });

        if (error) {
            console.error('Error sending cancellation email:', error);
            return { success: false, error };
        }

        console.log('Cancellation email sent successfully:', emailData);
        return { success: true, data: emailData };
    } catch (error) {
        console.error('Cancellation email service error:', error);
        return { success: false, error };
    }
}

interface ServiceCompletionData {
    customerName: string;
    customerEmail: string;
    bookingId: number;
    serviceName: string;
    carBrand: string;
    carModel: string;
    completedDate: string;
    rewardPoints?: number;
}

export async function sendServiceCompletionEmail(data: ServiceCompletionData) {
    if (!resend) {
        console.log('Email service not configured. Skipping completion email.');
        return { success: false, error: 'Email service not configured' };
    }

    const formattedDate = new Date(data.completedDate).toLocaleDateString('en-IN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    const rewardSection = data.rewardPoints && data.rewardPoints > 0
        ? `
        <tr>
            <td style="padding: 20px; background-color: #ecfdf5; border-radius: 8px; text-align: center;">
                <p style="color: #059669; margin: 0; font-size: 16px;">
                    You earned <strong>${data.rewardPoints} reward points</strong> from this service!
                </p>
            </td>
        </tr>
        `
        : '';

    const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Service Completed - AutoMob-Mechanic</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4;">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
            <!-- Header -->
            <tr>
                <td style="background-color: #2563eb; padding: 30px; text-align: center;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 28px;">AutoMob-Mechanic</h1>
                    <p style="color: #bfdbfe; margin: 10px 0 0 0; font-size: 14px;">Your Trusted Car Service Partner</p>
                </td>
            </tr>
            
            <!-- Completion Badge -->
            <tr>
                <td style="padding: 30px; text-align: center; background-color: #f0fdf4;">
                    <div style="font-size: 48px; margin-bottom: 10px;">✅</div>
                    <h2 style="color: #166534; margin: 0; font-size: 24px;">Service Completed!</h2>
                    <p style="color: #15803d; margin: 10px 0 0 0;">Your vehicle has been serviced successfully</p>
                </td>
            </tr>
            
            <!-- Service Details -->
            <tr>
                <td style="padding: 30px;">
                    <h3 style="color: #1f2937; margin: 0 0 20px 0; font-size: 18px; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">Service Summary</h3>
                    
                    <table width="100%" cellpadding="8" cellspacing="0">
                        <tr>
                            <td style="color: #6b7280; width: 40%;">Booking ID</td>
                            <td style="color: #1f2937; font-weight: bold;">#${data.bookingId}</td>
                        </tr>
                        <tr style="background-color: #f9fafb;">
                            <td style="color: #6b7280;">Customer Name</td>
                            <td style="color: #1f2937;">${data.customerName}</td>
                        </tr>
                        <tr>
                            <td style="color: #6b7280;">Service</td>
                            <td style="color: #1f2937; font-weight: bold;">${data.serviceName}</td>
                        </tr>
                        <tr style="background-color: #f9fafb;">
                            <td style="color: #6b7280;">Vehicle</td>
                            <td style="color: #1f2937;">${data.carBrand} ${data.carModel}</td>
                        </tr>
                        <tr>
                            <td style="color: #6b7280;">Completed On</td>
                            <td style="color: #1f2937;">${formattedDate}</td>
                        </tr>
                    </table>
                </td>
            </tr>
            
            ${rewardSection}
            
            <!-- Feedback CTA -->
            <tr>
                <td style="padding: 20px 30px 30px 30px; text-align: center;">
                    <p style="color: #4b5563; margin: 0 0 15px 0;">We hope you're satisfied with our service!</p>
                    <p style="color: #6b7280; margin: 0; font-size: 14px;">
                        If you have any concerns, please contact us at contact@automob.co.in
                    </p>
                </td>
            </tr>
            
            <!-- Book Again -->
            <tr>
                <td style="padding: 0 30px 30px 30px; text-align: center;">
                    <a href="https://automob.co.in/booking" style="display: inline-block; background-color: #2563eb; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">Book Another Service</a>
                </td>
            </tr>
            
            <!-- Footer -->
            <tr>
                <td style="background-color: #1f2937; padding: 25px; text-align: center;">
                    <p style="color: #9ca3af; margin: 0; font-size: 12px;">
                        © ${new Date().getFullYear()} AutoMob-Mechanic. All rights reserved.
                    </p>
                    <p style="color: #6b7280; margin: 10px 0 0 0; font-size: 11px;">
                        Thank you for choosing AutoMob-Mechanic!
                    </p>
                </td>
            </tr>
        </table>
    </body>
    </html>
    `;

    try {
        const { data: emailData, error } = await resend.emails.send({
            from: 'AutoMob-Mechanic <onboarding@resend.dev>',
            to: data.customerEmail,
            subject: `Service Completed #${data.bookingId} - ${data.serviceName}`,
            html: emailHtml,
        });

        if (error) {
            console.error('Error sending completion email:', error);
            return { success: false, error };
        }

        console.log('Completion email sent successfully:', emailData);
        return { success: true, data: emailData };
    } catch (error) {
        console.error('Completion email service error:', error);
        return { success: false, error };
    }
}

