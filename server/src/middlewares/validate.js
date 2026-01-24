import { ZodError } from 'zod';

export const validate =
  (schema, source = 'body') =>
  (req, res, next) => {
    try {
      const parsed = schema.parse(req[source]);
      req[source] = parsed;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          message: 'Validation error',
          issues: error.issues.map((issue) => ({
            path: issue.path,
            message: issue.message,
          })),
        });
      }

      return res.status(500).json({
        message: 'Internal server error',
      });
    }
  };
