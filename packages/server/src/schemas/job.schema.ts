export const createJobSchema = {
   description: 'Create a new job',
   tags: ['jobs'],
   body: {
      type: 'object',
      required: ['title', 'companyName', 'jobTitle', 'jobDescription'],
      properties: {
         title: { type: 'string', minLength: 1 },
         companyName: { type: 'string', minLength: 1 },
         jobTitle: { type: 'string', minLength: 1 },
         location: { type: 'string' },
         jobDescription: { type: 'string', minLength: 1 },
      },
   },
   response: {
      201: {
         description: 'Job created successfully',
         type: 'object',
         properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            data: {
               type: 'object',
               properties: {
                  _id: { type: 'string' },
                  userId: { type: 'string' },
                  title: { type: 'string' },
                  companyName: { type: 'string' },
                  jobTitle: { type: 'string' },
                  location: { type: 'string' },
                  jobDescription: { type: 'string' },
                  createdAt: { type: 'string' },
                  updatedAt: { type: 'string' },
               },
            },
         },
      },
   },
};

export const updateJobSchema = {
   description: 'Update an existing job',
   tags: ['jobs'],
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
         title: { type: 'string', minLength: 1 },
         companyName: { type: 'string', minLength: 1 },
         jobTitle: { type: 'string', minLength: 1 },
         location: { type: 'string' },
         jobDescription: { type: 'string', minLength: 1 },
      },
   },
   response: {
      200: {
         description: 'Job updated successfully',
         type: 'object',
         properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            data: {
               type: 'object',
               properties: {
                  _id: { type: 'string' },
                  userId: { type: 'string' },
                  title: { type: 'string' },
                  companyName: { type: 'string' },
                  jobTitle: { type: 'string' },
                  location: { type: 'string' },
                  jobDescription: { type: 'string' },
                  createdAt: { type: 'string' },
                  updatedAt: { type: 'string' },
               },
            },
         },
      },
   },
};

export const getJobByIdSchema = {
   description: 'Get a job by ID',
   tags: ['jobs'],
   params: {
      type: 'object',
      required: ['id'],
      properties: {
         id: { type: 'string' },
      },
   },
   response: {
      200: {
         description: 'Job retrieved successfully',
         type: 'object',
         properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            data: {
               type: 'object',
               properties: {
                  _id: { type: 'string' },
                  userId: { type: 'string' },
                  title: { type: 'string' },
                  companyName: { type: 'string' },
                  jobTitle: { type: 'string' },
                  location: { type: 'string' },
                  jobDescription: { type: 'string' },
                  createdAt: { type: 'string' },
                  updatedAt: { type: 'string' },
               },
            },
         },
      },
   },
};

export const getJobsSchema = {
   description: 'Get all jobs for the user',
   tags: ['jobs'],
   querystring: {
      type: 'object',
      properties: {
         page: { type: 'integer', minimum: 1, default: 1 },
         limit: { type: 'integer', minimum: 1, maximum: 100, default: 10 },
      },
   },
   response: {
      200: {
         description: 'Jobs retrieved successfully',
         type: 'object',
         properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            data: {
               type: 'object',
               properties: {
                  jobs: {
                     type: 'array',
                     items: {
                        type: 'object',
                        properties: {
                           _id: { type: 'string' },
                           userId: { type: 'string' },
                           title: { type: 'string' },
                           companyName: { type: 'string' },
                           jobTitle: { type: 'string' },
                           location: { type: 'string' },
                           jobDescription: { type: 'string' },
                           createdAt: { type: 'string' },
                           updatedAt: { type: 'string' },
                        },
                     },
                  },
                  pagination: {
                     type: 'object',
                     properties: {
                        page: { type: 'integer' },
                        limit: { type: 'integer' },
                        total: { type: 'integer' },
                        pages: { type: 'integer' },
                     },
                  },
               },
            },
         },
      },
   },
};
