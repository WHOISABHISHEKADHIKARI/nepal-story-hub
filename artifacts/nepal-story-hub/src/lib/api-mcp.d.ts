export interface MCPPost {
    id: number;
    title: string;
    description: string;
    slug: string;
    content: string;
    category: {
        id: number;
        name: string;
        slug: string;
    };
    author: {
        id: number;
        name: string;
        slug: string;
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
export declare const mcpApi: {
    listPosts(project?: string): Promise<{
        success: boolean;
        data: MCPPost[];
    }>;
    getPost(slug: string): Promise<{
        success: boolean;
        data: MCPPost;
    }>;
    listCategories(): Promise<{
        success: boolean;
        data: MCPCategory[];
    }>;
    createCategory(data: {
        name: string;
        project_id: number;
    }): Promise<{
        success: boolean;
        data: MCPCategory;
    }>;
    deleteCategory(slug: string): Promise<{
        success: boolean;
    }>;
    createPost(data: Partial<MCPPost>): Promise<{
        success: boolean;
        data: MCPPost;
    }>;
    updatePost(slug: string, data: Partial<MCPPost>): Promise<{
        success: boolean;
        data: MCPPost;
    }>;
    deletePost(slug: string): Promise<{
        success: boolean;
    }>;
    publishPost(slug: string): Promise<{
        success: boolean;
    }>;
    unpublishPost(slug: string): Promise<{
        success: boolean;
    }>;
    listAuthors(): Promise<{
        success: boolean;
        data: MCPAuthor[];
    }>;
    createAuthor(data: Partial<MCPAuthor> & {
        project_id: number;
    }): Promise<{
        success: boolean;
        data: MCPAuthor;
    }>;
    deleteAuthor(slug: string): Promise<{
        success: boolean;
    }>;
};
