export default {
  name: 'organizationSettings',
  title: 'Organization Settings',
  type: 'document',
  __experimental_actions: ['update', 'publish'],
  fields: [
    {
      name: 'companyName',
      title: 'Company Name',
      type: 'string',
      validation: Rule => Rule.required(),
    },
    {
      name: 'tagline',
      title: 'Tagline / Sub-Headline',
      type: 'string',
    },
    {
      name: 'description',
      title: 'Company Description',
      type: 'text',
      rows: 4,
    },
    {
      name: 'logoUrl',
      title: 'Logo URL',
      type: 'url',
    },
    {
      name: 'established',
      title: 'Established Year',
      type: 'string',
    },
    {
      name: 'emails',
      title: 'Email Addresses',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'label', title: 'Label (e.g., General, Support)', type: 'string' },
            { name: 'address', title: 'Email Address', type: 'string' },
          ],
        },
      ],
    },
    {
      name: 'phones',
      title: 'Phone Numbers',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'label', title: 'Label (e.g., Main, WhatsApp)', type: 'string' },
            { name: 'number', title: 'Phone Number', type: 'string' },
          ],
        },
      ],
    },
    {
      name: 'workingHours',
      title: 'Working Hours',
      type: 'string',
    },
    {
      name: 'offices',
      title: 'Global Offices',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'heading', title: 'Office Name', type: 'string', validation: Rule => Rule.required() },
            { name: 'address', title: 'Full Address', type: 'text' },
            { name: 'phone', title: 'Phone', type: 'string' },
            { name: 'email', title: 'Email', type: 'string' },
            { name: 'hours', title: 'Working Hours', type: 'string' },
            { name: 'mapUrl', title: 'Google Maps URL', type: 'url' },
            { name: 'mapEmbedUrl', title: 'Google Maps Embed URL (iframe src)', type: 'url' },
          ],
        },
      ],
    },
    {
      name: 'googleMapsEmbedUrl',
      title: 'Primary Office Google Maps Embed URL',
      type: 'url',
      description: 'The Google Maps embed URL (from maps.google.com → Share → Embed) for the Contact page map.',
    },
    {
      name: 'registrationDetails',
      title: 'Registration / Regulatory Details',
      type: 'text',
      rows: 3,
      description: 'e.g., ICAI Registration No., GSTIN, etc.',
    },
  ],
};
