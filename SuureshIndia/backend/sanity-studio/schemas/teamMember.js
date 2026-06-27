export default {
  name: 'teamMember',
  title: 'Team Members',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: Rule => Rule.required(),
    },
    {
      name: 'position',
      title: 'Position / Designation',
      type: 'string',
      validation: Rule => Rule.required(),
    },
    {
      name: 'photo',
      title: 'Photo',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'email',
      title: 'Email Address',
      type: 'string',
      validation: Rule => Rule.email(),
    },
    {
      name: 'phone',
      title: 'Phone Number',
      type: 'string',
    },
    {
      name: 'expertise',
      title: 'Expertise Areas',
      type: 'string',
    },
    {
      name: 'linkedin',
      title: 'LinkedIn URL',
      type: 'url',
    },
    {
      name: 'twitter',
      title: 'Twitter / X URL',
      type: 'url',
    },
    {
      name: 'facebook',
      title: 'Facebook URL',
      type: 'url',
    },
  ],
};
