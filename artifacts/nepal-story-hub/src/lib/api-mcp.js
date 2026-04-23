const API_BASE_URL = '/api'; // Since it's proxied by Vite in dev
export const mcpApi = {
    async listPosts(project) {
        const url = new URL(`${window.location.origin}${API_BASE_URL}/posts`);
        if (project)
            url.searchParams.set('project', project);
        const res = await fetch(url.toString());
        return res.json();
    },
    async getPost(slug) {
        const res = await fetch(`${API_BASE_URL}/posts/${slug}`);
        return res.json();
    },
    async listCategories() {
        const res = await fetch(`${API_BASE_URL}/categories`);
        return res.json();
    },
    async createCategory(data) {
        const res = await fetch(`${API_BASE_URL}/categories`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return res.json();
    },
    async deleteCategory(slug) {
        const res = await fetch(`${API_BASE_URL}/categories/${slug}`, {
            method: 'DELETE'
        });
        return res.json();
    },
    async createPost(data) {
        const res = await fetch(`${API_BASE_URL}/posts`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return res.json();
    },
    async updatePost(slug, data) {
        const res = await fetch(`${API_BASE_URL}/posts/${slug}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return res.json();
    },
    async deletePost(slug) {
        const res = await fetch(`${API_BASE_URL}/posts/${slug}`, {
            method: 'DELETE'
        });
        return res.json();
    },
    async publishPost(slug) {
        const res = await fetch(`${API_BASE_URL}/posts/${slug}/publish`, {
            method: 'POST'
        });
        return res.json();
    },
    async unpublishPost(slug) {
        const res = await fetch(`${API_BASE_URL}/posts/${slug}/unpublish`, {
            method: 'POST'
        });
        return res.json();
    },
    async listAuthors() {
        const res = await fetch(`${API_BASE_URL}/authors`);
        return res.json();
    },
    async createAuthor(data) {
        const res = await fetch(`${API_BASE_URL}/authors`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return res.json();
    },
    async deleteAuthor(slug) {
        const res = await fetch(`${API_BASE_URL}/authors/${slug}`, {
            method: 'DELETE'
        });
        return res.json();
    }
};
