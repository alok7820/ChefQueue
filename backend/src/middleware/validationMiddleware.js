import { z } from 'zod';

// Wraps a Zod schema into an Express middleware. Validates req.body (default) or
// whichever part of the request is specified, and replaces it with the parsed/coerced value.
export function validate(schema, part = 'body') {
  return (req, res, next) => {
    const result = schema.safeParse(req[part]);
    if (!result.success) {
      const message = result.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join('; ');
      return res.status(400).json({ success: false, message });
    }
    req[part] = result.data;
    next();
  };
}

export const numericIdParam = z.object({
  id: z.string().regex(/^\d+$/, 'id must be numeric').transform(Number),
});

export { z };
