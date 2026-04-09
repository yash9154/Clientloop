/**
 * Zod validation middleware factory
 * @param {import('zod').ZodSchema} schema - Zod schema to validate against
 */
const validate = (schema) => (req, res, next) => {
    try {
        schema.parse(req.body);
        next();
    } catch (error) {
        const messages = error.errors.map(e => `${e.path.join('.')}: ${e.message}`);
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: messages
        });
    }
};

export default validate;
