import nodemailer from 'nodemailer';

const createTransporter = () => nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

/**
 * Send a plain email
 */
export const sendEmail = async ({ to, subject, html }) => {
    try {
        const transporter = createTransporter();
        await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to,
            subject,
            html
        });
        console.log(`📧 Email sent to ${to}: ${subject}`);
    } catch (err) {
        // Never crash the app because of email failure
        console.error('Email send error:', err.message);
    }
};

// ── EMAIL TEMPLATES ───────────────────────────────────────────────

const baseStyle = `
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    max-width: 600px; margin: 0 auto; background: #ffffff;
`;
const headerStyle = `
    background: linear-gradient(135deg, #4f46e5, #6366f1);
    padding: 32px 40px; text-align: center;
`;
const bodyStyle = `padding: 32px 40px;`;
const footerStyle = `
    padding: 20px 40px; text-align: center;
    font-size: 12px; color: #9ca3af;
    border-top: 1px solid #e5e7eb;
`;
const btnStyle = `
    display: inline-block; background: #4f46e5; color: #ffffff !important;
    padding: 12px 28px; border-radius: 8px; text-decoration: none;
    font-weight: 600; margin-top: 20px;
`;

/**
 * Welcome email sent when agency creates a client
 */
export const sendClientWelcomeEmail = async ({ to, clientName, agencyName, loginUrl, password }) => {
    await sendEmail({
        to,
        subject: `You've been added to ${agencyName}'s client portal`,
        html: `
        <div style="${baseStyle}">
            <div style="${headerStyle}">
                <h1 style="color:white;margin:0;font-size:24px;">Welcome to ClientLoop</h1>
                <p style="color:rgba(255,255,255,0.85);margin:8px 0 0;">Your project portal is ready</p>
            </div>
            <div style="${bodyStyle}">
                <p style="color:#374151;">Hi ${clientName},</p>
                <p style="color:#374151;line-height:1.6;">
                    <strong>${agencyName}</strong> has created a portal for you to view project updates,
                    track progress, and approve deliverables.
                </p>
                <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:20px;margin:20px 0;">
                    <p style="margin:0 0 8px;font-weight:600;color:#111827;">Your login credentials:</p>
                    <p style="margin:4px 0;color:#374151;">📧 Email: <strong>${to}</strong></p>
                    <p style="margin:4px 0;color:#374151;">🔑 Password: <strong>${password}</strong></p>
                </div>
                <a href="${loginUrl}" style="${btnStyle}">Access Your Portal</a>
                <p style="color:#6b7280;font-size:13px;margin-top:20px;">
                    You can change your password after logging in from the portal settings.
                </p>
            </div>
            <div style="${footerStyle}">ClientLoop · Powered by your agency</div>
        </div>`
    });
};

/**
 * Email to client when agency posts a new update
 */
export const sendUpdatePostedEmail = async ({ to, clientName, agencyName, projectName, updateTitle, loginUrl }) => {
    await sendEmail({
        to,
        subject: `New update on ${projectName}`,
        html: `
        <div style="${baseStyle}">
            <div style="${headerStyle}">
                <h1 style="color:white;margin:0;font-size:22px;">New Project Update</h1>
            </div>
            <div style="${bodyStyle}">
                <p style="color:#374151;">Hi ${clientName},</p>
                <p style="color:#374151;line-height:1.6;">
                    <strong>${agencyName}</strong> has posted a new update on <strong>${projectName}</strong>.
                </p>
                <div style="background:#eff6ff;border-left:4px solid #4f46e5;padding:16px 20px;border-radius:4px;margin:20px 0;">
                    <p style="margin:0;font-weight:600;color:#1e40af;">${updateTitle}</p>
                </div>
                <a href="${loginUrl}" style="${btnStyle}">View Update</a>
            </div>
            <div style="${footerStyle}">ClientLoop · You received this because you are a portal client</div>
        </div>`
    });
};

/**
 * Email to agency when client approves an update
 */
export const sendApprovalEmail = async ({ to, agencyName, clientName, projectName, updateTitle, status, note, loginUrl }) => {
    const isApproved = status === 'approved';
    const accent     = isApproved ? '#059669' : '#d97706';
    const label      = isApproved ? '✅ Approved' : '🔁 Changes Requested';

    await sendEmail({
        to,
        subject: `${clientName} ${isApproved ? 'approved' : 'requested changes on'}: ${updateTitle}`,
        html: `
        <div style="${baseStyle}">
            <div style="background:${accent};padding:32px 40px;text-align:center;">
                <h1 style="color:white;margin:0;font-size:22px;">${label}</h1>
            </div>
            <div style="${bodyStyle}">
                <p style="color:#374151;">Hi ${agencyName},</p>
                <p style="color:#374151;line-height:1.6;">
                    <strong>${clientName}</strong> has ${isApproved ? 'approved' : 'requested changes on'}
                    the update <strong>"${updateTitle}"</strong> in project <strong>${projectName}</strong>.
                </p>
                ${note ? `
                <div style="background:#fffbeb;border-left:4px solid #d97706;padding:16px 20px;border-radius:4px;margin:20px 0;">
                    <p style="margin:0 0 4px;font-weight:600;color:#92400e;">Client note:</p>
                    <p style="margin:0;color:#78350f;">${note}</p>
                </div>` : ''}
                <a href="${loginUrl}" style="${btnStyle}">View in Dashboard</a>
            </div>
            <div style="${footerStyle}">ClientLoop · Agency notification</div>
        </div>`
    });
};

/**
 * Email notification for new comment
 */
export const sendCommentEmail = async ({ to, recipientName, commenterName, commenterRole, updateTitle, commentContent, loginUrl }) => {
    await sendEmail({
        to,
        subject: `New comment on "${updateTitle}"`,
        html: `
        <div style="${baseStyle}">
            <div style="${headerStyle}">
                <h1 style="color:white;margin:0;font-size:22px;">New Comment</h1>
            </div>
            <div style="${bodyStyle}">
                <p style="color:#374151;">Hi ${recipientName},</p>
                <p style="color:#374151;line-height:1.6;">
                    <strong>${commenterName}</strong> (${commenterRole}) commented on <strong>"${updateTitle}"</strong>.
                </p>
                <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:16px 20px;margin:20px 0;">
                    <p style="margin:0;color:#374151;font-style:italic;">"${commentContent}"</p>
                </div>
                <a href="${loginUrl}" style="${btnStyle}">View Comment</a>
            </div>
            <div style="${footerStyle}">ClientLoop</div>
        </div>`
    });
};