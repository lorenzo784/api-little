export const validate =
  (schema, source = 'body') =>
  (req, res, next) => {
    try {
      const parsed = schema.parse(req[source]);
      req[source] = parsed;
      next();
    } catch (e) {
      const issues = e?.issues?.map((i) => ({ path: i.path, message: i.message })) || [];
      res.status(400).json({ message: 'Validation error', issues });
    }
  };
