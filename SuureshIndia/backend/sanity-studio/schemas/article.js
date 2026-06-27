export default {
  name: 'article',
  title: 'Articles',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: Rule => Rule.required(),
    },
    {
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Taxation', value: 'Taxation' },
          { title: 'GST', value: 'GST' },
          { title: 'Audit', value: 'Audit' },
          { title: 'Compliance', value: 'Compliance' },
          { title: 'Corporate Advisory', value: 'Corporate Advisory' },
        ],
      },
      validation: Rule => Rule.required(),
    },
    {
      name: 'description',
      title: 'Short Description',
      type: 'text',
      rows: 3,
      validation: Rule => Rule.required(),
    },
    {
      name: 'content',
      title: 'Full Content',
      type: 'text',
      validation: Rule => Rule.required(),
    },
    {
      name: 'image',
      title: 'Featured Image',
      type: 'image',
      options: {
        hotspot: true,
      },
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
