export default {
  name: 'socialLinks',
  title: 'Social Media Links',
  type: 'document',
  __experimental_actions: ['update', 'publish'],
  fields: [
    {
      name: 'linkedin',
      title: 'LinkedIn URL',
      type: 'url',
    },
    {
      name: 'facebook',
      title: 'Facebook URL',
      type: 'url',
    },
    {
      name: 'instagram',
      title: 'Instagram URL',
      type: 'url',
    },
    {
      name: 'twitter',
      title: 'X / Twitter URL',
      type: 'url',
    },
    {
      name: 'youtube',
      title: 'YouTube Channel URL',
      type: 'url',
    },
    {
      name: 'whatsapp',
      title: 'WhatsApp Number (with country code, e.g., +919876543210)',
      type: 'string',
    },
    {
      name: 'whatsappMessage',
      title: 'WhatsApp Pre-filled Message',
      type: 'string',
      description: 'Default message that auto-fills when a user opens WhatsApp chat.',
    },
    {
      name: 'generalEmail',
      title: 'General Contact Email',
      type: 'string',
    },
  ],
};
