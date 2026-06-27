export default {
  name: "homePageContent",
  title: "Home Page Content",
  type: "document",
  fields: [
    {
      name: "heroTitle",
      title: "Hero Title",
      type: "string",
    },
    {
      name: "heroSubtitle",
      title: "Hero Subtitle",
      type: "text",
    },
    {
      name: "heroImage",
      title: "Hero Background Image",
      type: "image",
      options: { hotspot: true },
    },

    {
      name: "aboutTitle",
      title: "About Section Title",
      type: "string",
    },
    {
      name: "aboutDescription",
      title: "About Section Description",
      type: "text",
    },

    // ADD THESE TWO FIELDS
    {
      name: "aboutCardTitle",
      title: "About Card Title",
      type: "string",
    },
    {
      name: "aboutCardDescription",
      title: "About Card Description",
      type: "text",
    },

    {
      name: "stats",
      title: "Statistics",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "label",
              title: "Label",
              type: "string",
            },
            {
              name: "value",
              title: "Value",
              type: "string",
            },
            {
              name: "sub",
              title: "Sub-label",
              type: "string",
            },
          ],
        },
      ],
    },
  ],
};
