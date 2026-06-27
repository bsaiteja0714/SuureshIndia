export default {
  name: 'contactInquiry',
  title: 'Contact Inquiries',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: Rule => Rule.required(),
    },
    {
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: Rule => Rule.required().email(),
    },
    {
      name: 'phone',
      title: 'Phone Number',
      type: 'string',
    },
    {
      name: 'companyName',
      title: 'Company Name',
      type: 'string',
    },
    {
      name: 'serviceType',
      title: 'Service Type',
      type: 'string',
    },
    {
      name: 'message',
      title: 'Message',
      type: 'text',
      validation: Rule => Rule.required(),
    },
    {
      name: 'read',
      title: 'Mark as Read',
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
