export default {
  name: 'service',
  title: 'Services',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Service Title',
      type: 'string',
      validation: Rule => Rule.required(),
    },
    {
      name: 'slug',
      title: 'URL Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: Rule => Rule.required(),
    },
    {
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Lower numbers appear first (e.g., 1, 2, 3...)',
    },
    {
      name: 'iconEmoji',
      title: 'Icon Emoji',
      type: 'string',
      description: 'Single emoji character used as service icon (e.g., 📋, 🧾, 🔍)',
    },
    {
      name: 'icon',
      title: 'Icon Name',
      type: 'string',
      description: 'Name of the react-icon (e.g. FaPercent, FaClipboardCheck, FaRegBuilding)',
    },
    {
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: { hotspot: true },
    },
    {
      name: 'description',
      title: 'Short Description',
      type: 'text',
      rows: 3,
      validation: Rule => Rule.required(),
    },
    {
      name: 'fullDescription',
      title: 'Full Description',
      type: 'text',
      rows: 8,
      description: 'Detailed service description shown in the expanded "Learn More" section.',
    },
    {
      name: 'benefits',
      title: 'Key Benefits',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'List each benefit as a single line.',
    },
    {
      name: 'processFlow',
      title: 'Process Flow Steps',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'step', title: 'Step Number', type: 'number', validation: Rule => Rule.required() },
            { name: 'title', title: 'Step Title', type: 'string', validation: Rule => Rule.required() },
            { name: 'description', title: 'Step Description', type: 'text', rows: 2 },
          ],
          preview: {
            select: { title: 'title', step: 'step' },
            prepare({ title, step }) { return { title: `Step ${step}: ${title}` }; },
          },
        },
      ],
    },
    {
      name: 'faqs',
      title: 'Frequently Asked Questions',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'question', title: 'Question', type: 'string', validation: Rule => Rule.required() },
            { name: 'answer', title: 'Answer', type: 'text', rows: 3, validation: Rule => Rule.required() },
          ],
          preview: {
            select: { title: 'question' },
          },
        },
      ],
    },
    {
      name: 'published',
      title: 'Published',
      type: 'boolean',
      initialValue: true,
    },
  ],
  orderings: [
    {
      title: 'Display Order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
  preview: {
    select: { title: 'title', subtitle: 'description', media: 'coverImage' },
  },
};
