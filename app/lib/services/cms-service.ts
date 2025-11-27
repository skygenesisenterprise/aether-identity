/**
 * CMS Service
 * 
 * Service for managing CMS content (blog posts, job postings, etc.)
 * Communicates with the backend API
 */

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  coverImage?: string;
  status: 'DRAFT' | 'PUBLISHED' | 'SCHEDULED' | 'ARCHIVED';
  publishedAt?: string;
  scheduledAt?: string;
  views: number;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    firstName?: string;
    lastName?: string;
    email: string;
  };
  tags: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
  seo?: {
    title?: string;
    description?: string;
    keywords?: string;
    ogImage?: string;
  };
}

export interface JobPosting {
  id: string;
  title: string;
  slug: string;
  department: string;
  location: string;
  type: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP' | 'REMOTE';
  experience?: string;
  salary?: string;
  description: string;
  requirements?: string;
  benefits?: string;
  status: 'DRAFT' | 'ACTIVE' | 'CLOSED' | 'ARCHIVED';
  publishedAt?: string;
  closesAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Changelog {
  id: string;
  title: string;
  slug: string;
  content: string;
  version: string;
  type: 'FEATURE' | 'IMPROVEMENT' | 'BUG_FIX' | 'SECURITY' | 'BREAKING_CHANGE';
  status: 'DRAFT' | 'PUBLISHED' | 'SCHEDULED';
  publishedAt?: string;
  scheduledAt?: string;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    firstName?: string;
    lastName?: string;
    email: string;
  };
}

export interface Guide {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  category: string;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  readTime: number;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  publishedAt?: string;
  views: number;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    firstName?: string;
    lastName?: string;
    email: string;
  };
  tags: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
}

export interface Whitepaper {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  category: string;
  fileUrl?: string;
  fileSize?: number;
  downloadCount: number;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    firstName?: string;
    lastName?: string;
    email: string;
  };
  tags: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
}

export interface DashboardStats {
  totalBlogPosts: number;
  publishedBlogPosts: number;
  totalJobPostings: number;
  activeJobPostings: number;
  totalChangelogs: number;
  publishedChangelogs: number;
  totalGuides: number;
  publishedGuides: number;
  totalWhitepapers: number;
  publishedWhitepapers: number;
  totalViews: number;
  totalDownloads: number;
}

class CMSService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const defaultHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Get token from localStorage if available
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('access_token');
      if (token) {
        defaultHeaders['Authorization'] = `Bearer ${token}`;
      }
    }

    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Blog Posts
  async getAllBlogPosts(): Promise<BlogPost[]> {
    return this.request<BlogPost[]>('/api/cms/blog');
  }

  async getBlogPost(id: string): Promise<BlogPost> {
    return this.request<BlogPost>(`/api/cms/blog/${id}`);
  }

  async createBlogPost(data: Partial<BlogPost>): Promise<BlogPost> {
    return this.request<BlogPost>('/api/cms/blog', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateBlogPost(id: string, data: Partial<BlogPost>): Promise<BlogPost> {
    return this.request<BlogPost>(`/api/cms/blog/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteBlogPost(id: string): Promise<void> {
    return this.request<void>(`/api/cms/blog/${id}`, {
      method: 'DELETE',
    });
  }

  // Job Postings
  async getAllJobPostings(): Promise<JobPosting[]> {
    return this.request<JobPosting[]>('/api/cms/careers');
  }

  async getJobPosting(id: string): Promise<JobPosting> {
    return this.request<JobPosting>(`/api/cms/careers/${id}`);
  }

  async createJobPosting(data: Partial<JobPosting>): Promise<JobPosting> {
    return this.request<JobPosting>('/api/cms/careers', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateJobPosting(id: string, data: Partial<JobPosting>): Promise<JobPosting> {
    return this.request<JobPosting>(`/api/cms/careers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteJobPosting(id: string): Promise<void> {
    return this.request<void>(`/api/cms/careers/${id}`, {
      method: 'DELETE',
    });
  }

  // Changelogs
  async getAllChangelogs(): Promise<Changelog[]> {
    return this.request<Changelog[]>('/api/cms/changelog');
  }

  async getChangelog(id: string): Promise<Changelog> {
    return this.request<Changelog>(`/api/cms/changelog/${id}`);
  }

  async createChangelog(data: Partial<Changelog>): Promise<Changelog> {
    return this.request<Changelog>('/api/cms/changelog', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateChangelog(id: string, data: Partial<Changelog>): Promise<Changelog> {
    return this.request<Changelog>(`/api/cms/changelog/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteChangelog(id: string): Promise<void> {
    return this.request<void>(`/api/cms/changelog/${id}`, {
      method: 'DELETE',
    });
  }

  // Guides
  async getAllGuides(): Promise<Guide[]> {
    return this.request<Guide[]>('/api/cms/guides');
  }

  async getGuide(id: string): Promise<Guide> {
    return this.request<Guide>(`/api/cms/guides/${id}`);
  }

  async createGuide(data: Partial<Guide>): Promise<Guide> {
    return this.request<Guide>('/api/cms/guides', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateGuide(id: string, data: Partial<Guide>): Promise<Guide> {
    return this.request<Guide>(`/api/cms/guides/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteGuide(id: string): Promise<void> {
    return this.request<void>(`/api/cms/guides/${id}`, {
      method: 'DELETE',
    });
  }

  // Whitepapers
  async getAllWhitepapers(): Promise<Whitepaper[]> {
    return this.request<Whitepaper[]>('/api/cms/whitepapers');
  }

  async getWhitepaper(id: string): Promise<Whitepaper> {
    return this.request<Whitepaper>(`/api/cms/whitepapers/${id}`);
  }

  async createWhitepaper(data: Partial<Whitepaper>): Promise<Whitepaper> {
    return this.request<Whitepaper>('/api/cms/whitepapers', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateWhitepaper(id: string, data: Partial<Whitepaper>): Promise<Whitepaper> {
    return this.request<Whitepaper>(`/api/cms/whitepapers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteWhitepaper(id: string): Promise<void> {
    return this.request<void>(`/api/cms/whitepapers/${id}`, {
      method: 'DELETE',
    });
  }

  // Dashboard Stats
  async getDashboardStats(): Promise<DashboardStats> {
    return this.request<DashboardStats>('/api/cms/dashboard/stats');
  }
}

// Export singleton instance
export const blogService = new CMSService();
export const careersService = new CMSService();
export const changelogService = new CMSService();
export const guidesService = new CMSService();
export const whitepapersService = new CMSService();
export const dashboardService = new CMSService();

