// ── Central API service ───────────────────────────────────────
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

async function request(method, path, body, requiresAuth = false) {
  const headers = { 'Content-Type': 'application/json' };
  if (requiresAuth) {
    const token = localStorage.getItem('admin_token');
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
}

export const authAPI = {
  login: (email, password) => request('POST', '/api/auth/login', { email, password }),
  me: () => request('GET', '/api/auth/me', null, true),
  changePassword: (cur, next) =>
    request('POST', '/api/auth/change-password', { currentPassword: cur, newPassword: next }, true),
};

export const articlesAPI = {
  getPublished: () => request('GET', '/api/articles'),
  getAll: () => request('GET', '/api/articles/all', null, true),
  getById: (id) => request('GET', `/api/articles/${id}`),
  create: (data) => request('POST', '/api/articles', data, true),
  update: (id, data) => request('PUT', `/api/articles/${id}`, data, true),
  delete: (id) => request('DELETE', `/api/articles/${id}`, null, true),
};

export const updatesAPI = {
  getPublished: () => request('GET', '/api/updates'),
  getAll: () => request('GET', '/api/updates/all', null, true),
  getById: (id) => request('GET', `/api/updates/${id}`),
  create: (data) => request('POST', '/api/updates', data, true),
  update: (id, data) => request('PUT', `/api/updates/${id}`, data, true),
  delete: (id) => request('DELETE', `/api/updates/${id}`, null, true),
};

export const teamAPI = {
  getAll: () => request('GET', '/api/team'),
  create: (data) => request('POST', '/api/team', data, true),
  update: (id, data) => request('PUT', `/api/team/${id}`, data, true),
  delete: (id) => request('DELETE', `/api/team/${id}`, null, true),
};

export const contactAPI = {
  submit: (data) => request('POST', '/api/contact', data),
  getAll: () => request('GET', '/api/contact', null, true),
  markRead: (id) => request('PUT', `/api/contact/${id}/read`, null, true),
  delete: (id) => request('DELETE', `/api/contact/${id}`, null, true),
};

export const calendarAPI = {
  getAll: () => request('GET', '/api/calendar'),
  create: (data) => request('POST', '/api/calendar', data, true),
  update: (id, data) => request('PUT', `/api/calendar/${id}`, data, true),
  delete: (id) => request('DELETE', `/api/calendar/${id}`, null, true),
};

export const feedbackAPI = {
  getApproved: () => request('GET', '/api/feedback/approved'),
  getAll: () => request('GET', '/api/feedback/all', null, true),
  submit: (data) => request('POST', '/api/feedback', data),
  approve: (id) => request('PUT', `/api/feedback/${id}/approve`, null, true),
  delete: (id) => request('DELETE', `/api/feedback/${id}`, null, true),
};

export const filesAPI = {
  getAll: () => request('GET', '/api/files'),
  upload: async (formData) => {
    const token = localStorage.getItem('admin_token');
    const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

    // Note: Do NOT set Content-Type header when uploading FormData. Browser sets it automatically with boundary.
    const res = await fetch(`${API_BASE_URL}/api/files/upload`, {
      method: 'POST',
      headers,
      body: formData,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'File upload failed');
    return data;
  },
  delete: (id) => request('DELETE', `/api/files/${id}`, null, true),
};

export const servicesAPI = {
  getAll: () => request('GET', '/api/services'),
  getById: (id) => request('GET', `/api/services/${id}`),
  create: (data) => request('POST', '/api/services', data, true),
  update: (id, data) => request('PUT', `/api/services/${id}`, data, true),
  delete: (id) => request('DELETE', `/api/services/${id}`, null, true),
};

export const searchAPI = {
  query: (q) => request('GET', `/api/search?q=${encodeURIComponent(q)}`),
};

export const orgSettingsAPI = {
  get: () => request('GET', '/api/org-settings'),
  update: (data) => request('PUT', '/api/org-settings', data, true),
};

export const socialLinksAPI = {
  get: () => request('GET', '/api/social-links'),
  update: (data) => request('PUT', '/api/social-links', data, true),
};

export const legalPagesAPI = {
  get: (type) => request('GET', `/api/legal/${type}`),
  admin: {
    get: (type) => request('GET', `/api/legal/admin/${type}`, null, true),
    update: (type, data) => request('PUT', `/api/legal/admin/${type}`, data, true),
    publish: (type) => request('POST', `/api/legal/admin/${type}/publish`, null, true),
    unpublish: (type) => request('POST', `/api/legal/admin/${type}/unpublish`, null, true),
    delete: (type) => request('DELETE', `/api/legal/admin/${type}`, null, true),
  }
};


export const homePageAPI = {
  get: () => request('GET', '/api/content/homepage'),
  update: (data) => request('PUT', '/api/content/homepage', data, true),
};

export default API_BASE_URL;
