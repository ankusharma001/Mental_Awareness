/**
 * REAL API ADAPTER
 * This file fetches data from the real backend.
 */

// Helper to handle response
const handleResponse = async (res) => {
    const contentType = res.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
        const data = await res.json();
        if (!res.ok) {
            throw new Error(data.message || 'API Error');
        }
        return data;
    } else {
        // If response is not JSON (e.g. 404 HTML page), throw error
        if (!res.ok) throw new Error(res.statusText || 'API Error');
        return null;
    }
};

// Helper for headers (including auth token)
const getHeaders = () => {
    const headers = {
        'Content-Type': 'application/json',
    };
    const token = localStorage.getItem('jwtToken');
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
};

export const api = {
    auth: {
        login: async (email, password) => {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            return handleResponse(res);
        },
        register: async (userData) => {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData),
            });
            return handleResponse(res);
        },
        getCurrentUser: async () => {
            try {
                return JSON.parse(localStorage.getItem('user'));
            } catch {
                return null;
            }
        }
    },

    articles: {
        getAll: async () => {
            const res = await fetch('/api/articles', {
                headers: getHeaders()
            });
            return handleResponse(res);
        },
        getById: async (id) => {
            const res = await fetch(`/api/articles/${id}`, {
                headers: getHeaders()
            });
            return handleResponse(res);
        },
        create: async (articleData) => {
            const res = await fetch('/api/articles', {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify(articleData),
            });
            return handleResponse(res);
        },
        like: async (id) => {
            const res = await fetch(`/api/articles/${id}/like`, {
                method: 'POST',
                headers: getHeaders(),
            });
            return handleResponse(res);
        }
    },

    groups: {
        getAll: async () => {
            const res = await fetch('/api/groups', {
                headers: getHeaders()
            });
            return handleResponse(res);
        },
        getById: async (id) => {
            const res = await fetch(`/api/groups/${id}`, {
                headers: getHeaders()
            });
            return handleResponse(res);
        },
        join: async (id) => {
            const res = await fetch('/api/groups/request', {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify({ groupId: id })
            });
            return handleResponse(res);
        },
        create: async (groupData) => {
            const res = await fetch('/api/groups/create', {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify(groupData)
            });
            return handleResponse(res);
        },
        getMyGroups: async () => {
            const res = await fetch('/api/groups/my-groups', {
                headers: getHeaders()
            });
            return handleResponse(res);
        },
        adminAction: async (groupId, action, userId) => {
            const res = await fetch(`/api/groups/${groupId}/${action}`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify({ userId })
            });
            return handleResponse(res);
        },
        delete: async (groupId) => {
            const res = await fetch(`/api/groups/${groupId}`, {
                method: 'DELETE',
                headers: getHeaders()
            });
            return handleResponse(res);
        },
        getMessages: async (groupId) => {
            const res = await fetch(`/api/groups/${groupId}/messages`, {
                headers: getHeaders()
            });
            return handleResponse(res);
        },
        sendMessage: async (groupId, content) => {
            const res = await fetch(`/api/groups/${groupId}/messages`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify({ content })
            });
            return handleResponse(res);
        }
    }
};
