const { createClient } = require('@sanity/client');

const projectId = process.env.SANITY_PROJECT_ID;
const dataset = process.env.SANITY_DATASET || 'production';
const token = process.env.SANITY_TOKEN;

function requireEnv(name, value) {
  if (!value || value.startsWith('your_')) {
    throw new Error(
      `Missing valid environment variable: ${name}. Update backend/.env with your real Sanity project credentials.`
    );
  }
}

requireEnv('SANITY_PROJECT_ID', projectId);
requireEnv('SANITY_TOKEN', token);

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2023-05-03',
  token,
  useCdn: false,
});

module.exports = {
  client,
};
