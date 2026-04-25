
const API_BASE_URL = '/api'; // Since it's proxied by Vite in dev

export interface MCPPost {
  id: number;
  title: string;
  description: string;
  slug: string;
  content: string;
  category: { id: number; name: string; slug: string };
  author: { id: number; name: string; slug: string };
  category_details?: { id: number; name: string; slug: string; project?: number };
  author_details?: {
    id: number;
    name: string;
    slug: string;
    bio?: string | null;
    description?: string | null;
    profile_picture?: string | null;
    project?: number;
  };
  status: string;
  created_at: string;
  published_at: string | null;
  image_url: string | null;
  reviewer_notes?: string | null;
  project_id?: number;
  author_id?: number;
  category_id?: number;
  meta_title?: string;
  meta_description?: string;
}

export interface MCPCategory {
  id: number;
  name: string;
  slug: string;
  project: number;
  created_at: string;
}

export interface MCPAuthor {
  id: number;
  name: string;
  slug: string;
  bio: string | null;
  description: string | null;
  profile_picture: string | null;
  created_at: string;
}

export const mcpApi = {
  async listPosts(project?: string): Promise<{ success: boolean; data: MCPPost[] }> {
    const url = new URL(`${window.location.origin}${API_BASE_URL}/posts`);
    if (project) url.searchParams.set('project', project);
    const res = await fetch(url.toString());
    return res.json();
  },

  async getPost(slug: string): Promise<{ success: boolean; data: MCPPost }> {
    const res = await fetch(`${API_BASE_URL}/posts/${slug}`);
    return res.json();
  },

  async listCategories(): Promise<{ success: boolean; data: MCPCategory[] }> {
    const res = await fetch(`${API_BASE_URL}/categories`);
    return res.json();
  },

  async createCategory(data: { name: string; project_id: number }): Promise<{ success: boolean; data: MCPCategory }> {
    const res = await fetch(`${API_BASE_URL}/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async deleteCategory(slug: string): Promise<{ success: boolean }> {
    const res = await fetch(`${API_BASE_URL}/categories/${slug}`, {
      method: 'DELETE'
    });
    return res.json();
  },

  async createPost(data: Partial<MCPPost>): Promise<{ success: boolean; data: MCPPost }> {
    const res = await fetch(`${API_BASE_URL}/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async updatePost(slug: string, data: Partial<MCPPost>): Promise<{ success: boolean; data: MCPPost }> {
    const res = await fetch(`${API_BASE_URL}/posts/${slug}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async deletePost(slug: string): Promise<{ success: boolean }> {
    const res = await fetch(`${API_BASE_URL}/posts/${slug}`, {
      method: 'DELETE'
    });
    return res.json();
  },

  async publishPost(slug: string): Promise<{ success: boolean }> {
    const res = await fetch(`${API_BASE_URL}/posts/${slug}/publish`, {
      method: 'POST'
    });
    return res.json();
  },

  async unpublishPost(slug: string): Promise<{ success: boolean }> {
    const res = await fetch(`${API_BASE_URL}/posts/${slug}/unpublish`, {
      method: 'POST'
    });
    return res.json();
  },

  async listAuthors(): Promise<{ success: boolean; data: MCPAuthor[] }> {
    const res = await fetch(`${API_BASE_URL}/authors`);
    return res.json();
  },

  async createAuthor(data: Partial<MCPAuthor> & { project_id: number }): Promise<{ success: boolean; data: MCPAuthor }> {
    const res = await fetch(`${API_BASE_URL}/authors`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async deleteAuthor(slug: string): Promise<{ success: boolean }> {
    const res = await fetch(`${API_BASE_URL}/authors/${slug}`, {
      method: 'DELETE'
    });
    return res.json();
  }
};
