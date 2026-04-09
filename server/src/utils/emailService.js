/**
 * Email Service Utility
 * Supports: Mailgun, Resend, SendGrid, SMTP
 */

/**
 * Send email via configured email service
 */
export const sendEmail = async ({
    to,
    subject,
    htmlContent,
    textContent = null
}) => {
    const emailService = process.env.EMAIL_SERVICE || 'mailgun';

    switch (emailService) {
        case 'mailgun':
            return sendMailgunEmail({ to, subject, htmlContent, textContent });
        case 'resend':
            return sendResendEmail({ to, subject, htmlContent, textContent });
        case 'sendgrid':
            return sendSendGridEmail({ to, subject, htmlContent, textContent });
        case 'smtp':
            return sendSmtpEmail({ to, subject, htmlContent, textContent });
        default:
            throw new Error(`Unsupported email service: ${emailService}`);
    }
};

/**
 * Mailgun email sender
 */
const sendMailgunEmail = async ({ to, subject, htmlContent, textContent }) => {
    try {
        const FormData = (await import('form-data')).default;
        const Mailgun = (await import('mailgun.js')).default;

        const mailgun = new Mailgun(FormData);
        const client = mailgun.client({
            username: 'api',
            key: process.env.MAILGUN_API_KEY
        });

        const messageData = {
            from: process.env.MAILGUN_FROM_EMAIL || 'noreply@yourdomain.com',
            to,
            subject,
            html: htmlContent,
            text: textContent || htmlContent.replace(/<[^>]*>/g, '')
        };

        const result = await client.messages.create(
            process.env.MAILGUN_DOMAIN,
            messageData
        );

        return {
            success: true,
            messageId: result.id,
            provider: 'mailgun'
        };
    } catch (error) {
        console.error('Mailgun email error:', error);
        throw new Error(`Failed to send email via Mailgun: ${error.message}`);
    }
};

/**
 * Resend email sender
 */
const sendResendEmail = async ({ to, subject, htmlContent, textContent }) => {
    try {
        const { Resend } = await import('resend');
        const resend = new Resend(process.env.RESEND_API_KEY);

        const result = await resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL || 'noreply@yourdomain.com',
            to,
            subject,
            html: htmlContent,
            text: textContent || htmlContent.replace(/<[^>]*>/g, '')
        });

        if (result.error) {
            throw new Error(result.error.message);
        }

        return {
            success: true,
            messageId: result.data.id,
            provider: 'resend'
        };
    } catch (error) {
        console.error('Resend email error:', error);
        throw new Error(`Failed to send email via Resend: ${error.message}`);
    }
};

/**
 * SendGrid email sender
 */
const sendSendGridEmail = async ({ to, subject, htmlContent, textContent }) => {
    try {
        const sgMail = (await import('@sendgrid/mail')).default;
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);

        const result = await sgMail.send({
            from: process.env.SENDGRID_FROM_EMAIL || 'noreply@yourdomain.com',
            to,
            subject,
            html: htmlContent,
            text: textContent || htmlContent.replace(/<[^>]*>/g, '')
        });

        return {
            success: true,
            messageId: result[0].headers['x-message-id'],
            provider: 'sendgrid'
        };
    } catch (error) {
        console.error('SendGrid email error:', error);
        throw new Error(`Failed to send email via SendGrid: ${error.message}`);
    }
};

/**
 * SMTP email sender (Gmail, custom servers, etc)
 */
const sendSmtpEmail = async ({ to, subject, htmlContent, textContent }) => {
    try {
        const nodemailer = (await import('nodemailer')).default;

        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: process.env.SMTP_PORT === '465',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD
            }
        });

        const result = await transporter.sendMail({
            from: process.env.SMTP_FROM_EMAIL || 'noreply@yourdomain.com',
            to,
            subject,
            html: htmlContent,
            text: textContent || htmlContent.replace(/<[^>]*>/g, '')
        });

        return {
            success: true,
            messageId: result.messageId,
            provider: 'smtp'
        };
    } catch (error) {
        console.error('SMTP email error:', error);
        throw new Error(`Failed to send email via SMTP: ${error.message}`);
    }
};

/**
 * Email templates
 */
export const emailTemplates = {
    /**
     * Client account created
     */
    clientCreated: (clientName, email, password, agencyName) => ({
        subject: `Your ${agencyName} Client Portal Access`,
        htmlContent: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>Welcome to ${agencyName}!</h2>
                <p>Your client portal account has been created.</p>
                
                <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Password:</strong> ${password}</p>
                    <p><strong>Portal URL:</strong> <a href="http://localhost:3000/client-login">Login to Portal</a></p>
                </div>
                
                <p style="color: #666; font-size: 12px;">
                    Please change your password after your first login. Keep your credentials secure.
                </p>
            </div>
        `
    }),

    /**
     * Password reset request
     */
    passwordReset: (resetLink, expiryMinutes = 60) => ({
        subject: 'Reset Your ClientLoop Password',
        htmlContent: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>Password Reset Request</h2>
                <p>We received a request to reset your password. Click the link below to reset it:</p>
                
                <div style="margin: 20px 0;">
                    <a href="${resetLink}" style="background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
                        Reset Password
                    </a>
                </div>
                
                <p style="color: #666; font-size: 12px;">
                    This link will expire in ${expiryMinutes} minutes. If you didn't request this, please ignore this email.
                </p>
                
                <p style="color: #666; font-size: 12px;">
                    Or copy this link: <code>${resetLink}</code>
                </p>
            </div>
        `
    }),

    /**
     * Email verification
     */
    emailVerification: (verificationLink) => ({
        subject: 'Verify Your ClientLoop Account',
        htmlContent: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>Verify Your Email</h2>
                <p>Click the link below to verify your email address:</p>
                
                <div style="margin: 20px 0;">
                    <a href="${verificationLink}" style="background: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
                        Verify Email
                    </a>
                </div>
                
                <p style="color: #666; font-size: 12px;">
                    If you didn't create this account, please ignore this email.
                </p>
            </div>
        `
    }),

    /**
     * New project update notification
     */
    projectUpdateNotification: (clientName, projectName, updateTitle, updateLink) => ({
        subject: `New Update: ${projectName} - ${updateTitle}`,
        htmlContent: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>New Project Update</h2>
                <p>Hi ${clientName},</p>
                <p>There's a new update on <strong>${projectName}</strong>:</p>
                
                <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h3>${updateTitle}</h3>
                    <p><a href="${updateLink}" style="color: #007bff;">View Update</a></p>
                </div>
                
                <p>Log in to your portal to see details and leave feedback.</p>
            </div>
        `
    })
};
