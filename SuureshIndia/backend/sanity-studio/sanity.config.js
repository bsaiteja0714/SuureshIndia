import { defineConfig } from 'sanity';
import { deskTool } from 'sanity/desk';
import { schemaTypes } from './schemas';

const projectId = process.env.SANITY_STUDIO_PROJECT_ID;
const dataset = process.env.SANITY_STUDIO_DATASET || 'production';
const studioTitle = process.env.SANITY_STUDIO_TITLE || 'SuureshIndia CMS Studio';

if (!projectId) {
  throw new Error(
    'Missing SANITY_STUDIO_PROJECT_ID. Copy sanity-studio/.env.example to sanity-studio/.env and add your Sanity project details.'
  );
}

export default defineConfig({
  name: 'default',
  title: studioTitle,
  projectId,
  dataset,

  plugins: [deskTool()],

  schema: {
    types: schemaTypes,
  },
});
