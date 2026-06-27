export default {
  name: 'legalPage',
  title: 'Legal Pages',
  type: 'document',
  fields: [
    {
      name: 'pageType',
      title: 'Page Type',
      type: 'string',
      options: {
        list: [
          { title: 'Terms & Conditions', value: 'terms' },
          { title: 'Privacy Policy', value: 'privacy' },
          { title: 'Disclaimer', value: 'disclaimer' },
          { title: 'Sitemap', value: 'sitemap' },
        ],
        layout: 'radio',
      },
      validation: Rule => Rule.required(),
    },
    {
      name: 'title',
      title: 'Page Title',
      type: 'string',
      validation: Rule => Rule.required(),
    },
    {
      name: 'subtitle',
      title: 'Page Subtitle',
      type: 'string',
    },
    {
      name: 'lastUpdated',
      title: 'Last Updated Date',
      type: 'date',
    },
    {
      name: 'contactEmail',
      title: 'Contact Email (shown at bottom)',
      type: 'string',
    },
    {
      name: 'sections',
      title: 'Content Sections',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'title', title: 'Section Title', type: 'string', validation: Rule => Rule.required() },
            {
              name: 'content',
              title: 'Section Content',
              type: 'array',
              of: [{ type: 'block' }],
              description: 'Use the rich text editor to add paragraphs, lists, and bold text.',
            },
          ],
          preview: {
            select: { title: 'title' },
          },
        },
      ],
    },
  ],
  preview: {
    select: { title: 'title', pageType: 'pageType' },
    prepare({ title, pageType }) {
      return { title: title || pageType, subtitle: `Legal Page — ${pageType}` };
    },
  },
};
