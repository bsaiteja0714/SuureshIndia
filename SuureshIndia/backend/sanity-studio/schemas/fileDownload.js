export default {
  name: 'fileDownload',
  title: 'File Downloads',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Document Title',
      type: 'string',
      validation: Rule => Rule.required(),
    },
    {
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Tax Guide', value: 'Tax Guide' },
          { title: 'Circular', value: 'Circular' },
          { title: 'Compliance Document', value: 'Compliance Document' },
          { title: 'Other Download', value: 'Other' },
        ],
      },
      validation: Rule => Rule.required(),
    },
    {
      name: 'file',
      title: 'Upload File (PDF)',
      type: 'file',
      options: {
        accept: '.pdf,.doc,.docx,.xls,.xlsx',
      },
      validation: Rule => Rule.required(),
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 2,
    },
    {
      name: 'publishDate',
      title: 'Publish Date',
      type: 'date',
      initialValue: () => new Date().toISOString().split('T')[0],
    },
  ],
};
