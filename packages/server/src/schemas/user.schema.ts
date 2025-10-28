export const createUserSchema = {
   body: {
      type: 'object',
      required: ['name', 'email'],
      properties: {
         name: { type: 'string', minLength: 2, maxLength: 100 },
         email: { type: 'string', format: 'email' },
         role: {
            type: 'string',
            enum: ['admin', 'recruiter', 'candidate'],
            default: 'candidate',
         },
      },
   },
} as const;

export const getUserByIdSchema = {
   params: {
      type: 'object',
      required: ['id'],
      properties: {
         id: { type: 'string' },
      },
   },
} as const;

export const getUsersSchema = {
   querystring: {
      type: 'object',
      properties: {
         page: { type: 'number', default: 1 },
         limit: { type: 'number', default: 10 },
         role: { type: 'string', enum: ['admin', 'recruiter', 'candidate'] },
      },
   },
} as const;
