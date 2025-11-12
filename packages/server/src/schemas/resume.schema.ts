export const uploadResumeSchema = {
   consumes: ['multipart/form-data'],
   body: {
      type: 'object',
      required: ['title', 'file'],
      properties: {
         title: { type: 'string' },
         file: { type: 'object' },
      },
   },
} as const;

export const createResumeSchema = {
   body: {
      type: 'object',
      required: ['title'],
      properties: {
         title: { type: 'string', minLength: 1, maxLength: 200 },
         personal_info: {
            type: 'object',
            properties: {
               image: { type: 'string' },
               full_name: { type: 'string' },
               email: { type: 'string', format: 'email' },
               phone: { type: 'string' },
               location: { type: 'string' },
               profession: { type: 'string' },
               linkedin: { type: 'string' },
               github: { type: 'string' },
               website: { type: 'string' },
            },
         },
         professional_summary: { type: 'string' },
         experience: {
            type: 'array',
            items: {
               type: 'object',
               required: ['position', 'company', 'start_date'],
               properties: {
                  position: { type: 'string' },
                  company: { type: 'string' },
                  start_date: { type: 'string' },
                  end_date: { type: 'string' },
                  is_current: { type: 'boolean' },
                  description: { type: 'string' },
               },
            },
         },
         education: {
            type: 'array',
            items: {
               type: 'object',
               required: ['degree', 'field', 'institution'],
               properties: {
                  degree: { type: 'string' },
                  field: { type: 'string' },
                  institution: { type: 'string' },
                  gpa: { type: 'string' },
                  graduation_date: { type: 'string' },
               },
            },
         },
         project: {
            type: 'array',
            items: {
               type: 'object',
               required: ['name', 'type'],
               properties: {
                  name: { type: 'string' },
                  type: { type: 'string' },
                  description: { type: 'string' },
               },
            },
         },
         skills: {
            type: 'array',
            items: { type: 'string' },
         },
         template: { type: 'string' },
         accent_color: { type: 'string', pattern: '^#[0-9A-Fa-f]{6}$' },
         public: { type: 'boolean' },
      },
   },
} as const;

export const updateResumeSchema = {
   params: {
      type: 'object',
      required: ['id'],
      properties: {
         id: { type: 'string' },
      },
   },
   body: {
      type: 'object',
      properties: {
         title: { type: 'string', minLength: 1, maxLength: 200 },
         personal_info: {
            type: 'object',
            properties: {
               image: { type: 'string' },
               full_name: { type: 'string' },
               email: { type: 'string', format: 'email' },
               phone: { type: 'string' },
               location: { type: 'string' },
               profession: { type: 'string' },
               linkedin: { type: 'string' },
               github: { type: 'string' },
               website: { type: 'string' },
            },
         },
         professional_summary: { type: 'string' },
         experience: {
            type: 'array',
            items: {
               type: 'object',
               required: ['position', 'company', 'start_date'],
               properties: {
                  position: { type: 'string' },
                  company: { type: 'string' },
                  start_date: { type: 'string' },
                  end_date: { type: 'string' },
                  is_current: { type: 'boolean' },
                  description: { type: 'string' },
               },
            },
         },
         education: {
            type: 'array',
            items: {
               type: 'object',
               required: ['degree', 'field', 'institution'],
               properties: {
                  degree: { type: 'string' },
                  field: { type: 'string' },
                  institution: { type: 'string' },
                  gpa: { type: 'string' },
                  graduation_date: { type: 'string' },
               },
            },
         },
         project: {
            type: 'array',
            items: {
               type: 'object',
               required: ['name', 'type'],
               properties: {
                  name: { type: 'string' },
                  type: { type: 'string' },
                  description: { type: 'string' },
               },
            },
         },
         skills: {
            type: 'array',
            items: { type: 'string' },
         },
         template: { type: 'string' },
         accent_color: { type: 'string', pattern: '^#[0-9A-Fa-f]{6}$' },
         public: { type: 'boolean' },
      },
   },
} as const;

export const getResumeByIdSchema = {
   params: {
      type: 'object',
      required: ['id'],
      properties: {
         id: { type: 'string' },
      },
   },
} as const;

export const getResumesSchema = {
   querystring: {
      type: 'object',
      properties: {
         page: { type: 'number', default: 1 },
         limit: { type: 'number', default: 10 },
         public: { type: 'boolean' },
      },
   },
} as const;
