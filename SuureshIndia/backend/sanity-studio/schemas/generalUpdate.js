export default {
  name: 'generalUpdate',
  title: 'General Updates',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required(),
    },
    {
      name: 'type',
      title: 'Type',
      type: 'string',
      options: {
        list: [
          { title: 'News', value: 'News' },
          { title: 'Announcement', value: 'Announcement' },
          { title: 'Circular', value: 'Circular' },
          { title: 'Event', value: 'Event' },
          { title: 'Firm Update', value: 'Firm Update' },
        ],
      },
      validation: Rule => Rule.required(),
    },
    {
      name: 'content',
      title: 'Content Details',
      type: 'text',
      validation: Rule => Rule.required(),
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
