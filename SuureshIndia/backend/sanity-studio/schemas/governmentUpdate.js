export default {
  name: 'governmentUpdate',
  title: 'Government Updates',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required(),
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      validation: Rule => Rule.required(),
    },
    {
      name: 'source',
      title: 'Source / Department',
      type: 'string',
      options: {
        list: [
          { title: 'GST Council / CBIC', value: 'GST' },
          { title: 'Income Tax Department', value: 'Income Tax' },
          { title: 'Ministry of Corporate Affairs (MCA)', value: 'MCA' },
          { title: 'Reserve Bank of India (RBI)', value: 'RBI' },
          { title: 'Securities and Exchange Board of India (SEBI)', value: 'SEBI' },
          { title: 'Other Board/Official Source', value: 'Other' },
        ],
      },
      validation: Rule => Rule.required(),
    },
    {
      name: 'link',
      title: 'Reference / Source Link',
      type: 'url',
    },
    {
      name: 'pinned',
      title: 'Pinned',
      type: 'boolean',
      initialValue: false,
    },
    {
      name: 'archived',
      title: 'Archived',
      type: 'boolean',
      initialValue: false,
    },
    {
      name: 'publishDate',
      title: 'Publish Date',
      type: 'date',
      initialValue: () => new Date().toISOString().split('T')[0],
      validation: Rule => Rule.required(),
    },
  ],
};
