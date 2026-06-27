export default {
  name: 'complianceDeadline',
  title: 'Compliance Deadlines',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title / Compliance Name',
      type: 'string',
      validation: Rule => Rule.required(),
    },
    {
      name: 'dueDate',
      title: 'Due Date',
      type: 'date',
      validation: Rule => Rule.required(),
    },
    {
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'GST Returns', value: 'GST' },
          { title: 'TDS Filing', value: 'TDS' },
          { title: 'Income Tax Deadlines', value: 'Income Tax' },
          { title: 'ROC / MCA Filing', value: 'ROC' },
          { title: 'Other statutory filings', value: 'Other' },
        ],
      },
      validation: Rule => Rule.required(),
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
    },
  ],
};
