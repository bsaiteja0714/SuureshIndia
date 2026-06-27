export default {
  name: 'adminUser',
  title: 'Admin Users',
  type: 'document',
  fields: [
    {
      name: 'email',
      title: 'Email Address',
      type: 'string',
      validation: Rule => Rule.required().email(),
    },
    {
      name: 'password',
      title: 'Hashed Password (bcrypt)',
      type: 'string',
      validation: Rule => Rule.required(),
    },
  ],
};
