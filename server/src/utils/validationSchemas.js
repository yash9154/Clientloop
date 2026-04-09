/**
 * Zod Validation Schemas for API endpoints
 * Ensures all inputs are validated before processing
 */

import { z } from 'zod';
import { validatePasswordStrength } from './passwordValidator.js';

/**
 * Custom refinement functions
 */
const passwordValidation = z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .refine(
        (password) => validatePasswordStrength(password).isStrong,
        (password) => ({
            message: validatePasswordStrength(password).errors.join('; ')
        })
    );

const emailValidation = z
    .string()
    .email('Invalid email address')
    .toLowerCase();

/**
 * AUTH SCHEMAS
 */
export const authSchemas = {
    signup: z.object({
        body: z.object({
            name: z.string().min(2, 'Name must be at least 2 characters').max(100),
            email: emailValidation,
            password: passwordValidation,
            role: z.enum(['agency', 'client']).default('agency'),
            company: z.string().max(100).optional()
        })
    }),

    login: z.object({
        body: z.object({
            email: emailValidation,
            password: z.string().min(1, 'Password is required'),
            isClientLogin: z.boolean().default(false)
        })
    }),

    updateProfile: z.object({
        body: z.object({
            name: z.string().min(2).max(100).optional(),
            company: z.string().max(100).optional(),
            avatar: z.string().url().optional()
        })
    }),

    changePassword: z.object({
        body: z.object({
            currentPassword: z.string().min(1, 'Current password is required'),
            newPassword: passwordValidation
        })
    }),

    forgotPassword: z.object({
        body: z.object({
            email: emailValidation
        })
    }),

    resetPassword: z.object({
        body: z.object({
            token: z.string().min(1, 'Reset token is required'),
            newPassword: passwordValidation
        })
    })
};

/**
 * CLIENT SCHEMAS
 */
export const clientSchemas = {
    createClient: z.object({
        body: z.object({
            name: z.string().min(2, 'Client name is required').max(100),
            email: emailValidation,
            contactName: z.string().max(100).optional(),
            phone: z.string().regex(/^[\d\s\-\+\(\)]+$/, 'Invalid phone number').optional(),
            company: z.string().max(100).optional(),
            industry: z.string().max(100).optional(),
            password: z.string().min(8).optional()
        })
    }),

    updateClient: z.object({
        body: z.object({
            name: z.string().min(2).max(100).optional(),
            email: emailValidation.optional(),
            contactName: z.string().max(100).optional(),
            phone: z.string().regex(/^[\d\s\-\+\(\)]+$/, 'Invalid phone number').optional(),
            company: z.string().max(100).optional(),
            industry: z.string().max(100).optional()
        })
    })
};

/**
 * PROJECT SCHEMAS
 */
export const projectSchemas = {
    createProject: z.object({
        body: z.object({
            name: z.string().min(2, 'Project name is required').max(200),
            description: z.string().max(1000).optional(),
            clientId: z.string().regex(/^[0-9a-f]{24}$/, 'Invalid client ID'),
            status: z.enum(['active', 'completed', 'on-hold']).default('active')
        })
    }),

    updateProject: z.object({
        body: z.object({
            name: z.string().min(2).max(200).optional(),
            description: z.string().max(1000).optional(),
            status: z.enum(['active', 'completed', 'on-hold']).optional()
        })
    })
};

/**
 * UPDATE SCHEMAS
 */
export const updateSchemas = {
    createUpdate: z.object({
        body: z.object({
            title: z.string().min(2, 'Title is required').max(200),
            description: z.string().min(1, 'Description is required').max(5000),
            projectId: z.string().regex(/^[0-9a-f]{24}$/, 'Invalid project ID'),
            requestApproval: z.boolean().default(false),
            status: z.enum(['draft', 'published']).default('published')
        })
    })
};

/**
 * COMMENT SCHEMAS
 */
export const commentSchemas = {
    createComment: z.object({
        body: z.object({
            content: z.string().min(1, 'Comment cannot be empty').max(5000),
            updateId: z.string().regex(/^[0-9a-f]{24}$/, 'Invalid update ID'),
            parentId: z.string().regex(/^[0-9a-f]{24}$/, 'Invalid parent ID').optional()
        })
    }),

    updateComment: z.object({
        body: z.object({
            content: z.string().min(1, 'Comment cannot be empty').max(5000)
        })
    })
};

/**
 * PAGINATION SCHEMA
 */
export const paginationSchema = z.object({
    query: z.object({
        page: z.string().regex(/^\d+$/, 'Page must be a number').transform(Number).default('1'),
        limit: z.string().regex(/^\d+$/, 'Limit must be a number').transform(Number).default('10').refine(n => n <= 100, 'Limit cannot exceed 100')
    })
});

/**
 * Middleware: Validate request using schema
 */
export const validateRequest = (schema) => (req, res, next) => {
    try {
        const data = {
            body: req.body,
            query: req.query,
            params: req.params
        };

        const result = schema.parse(data);
        req.body = result.body;
        req.query = result.query;
        req.params = result.params;
        next();
    } catch (error) {
        if (error.errors) {
            const fieldErrors = error.errors.reduce((acc, err) => {
                const path = err.path.slice(1).join('.');
                acc[path] = err.message;
                return acc;
            }, {});

            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: fieldErrors
            });
        }

        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * Safe validation (returns { success, data, errors } instead of throwing)
 */
export const safeValidate = async (schema, data) => {
    try {
        const result = await schema.parseAsync(data);
        return { success: true, data: result, errors: null };
    } catch (error) {
        const fieldErrors = error.errors.reduce((acc, err) => {
            const path = err.path.join('.');
            acc[path] = err.message;
            return acc;
        }, {});

        return { success: false, data: null, errors: fieldErrors };
    }
};
