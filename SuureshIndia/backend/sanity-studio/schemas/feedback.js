export default {
  name: 'feedback',
  title: 'Client Feedback',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Client Name',
      type: 'string',
      validation: Rule => Rule.required(),
    },
    {
      name: 'rating',
      title: 'Rating (1 to 5)',
      type: 'number',
      validation: Rule => Rule.required().min(1).max(5),
    },
    {
      name: 'message',
      title: 'Feedback Message',
      type: 'text',
      validation: Rule => Rule.required(),
    },
    {
      name: 'approved',
      title: 'Approved by Admin',
      type: 'boolean',
      initialValue: false,
    },
    {
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    },
  ],
};
