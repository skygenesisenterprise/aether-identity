const isProduction = process.env.NODE_ENV === "production";
const isStaging = process.env.NEXT_PUBLIC_ENVIRONMENT === "staging";

const getApiBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  if (isProduction) {
    return "https://api.etheriatimes.com";
  }
  if (isStaging) {
    return "https://api-staging.etheriatimes.com";
  }
  return "http://localhost:8080";
};

const API_BASE_URL = getApiBaseUrl();

interface RequestOptions extends RequestInit {
  params?: Record<string, string>;
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { params, ...fetchOptions } = options;

    let url = `${this.baseURL}${endpoint}`;
    if (params) {
      const searchParams = new URLSearchParams(params);
      url += `?${searchParams.toString()}`;
    }

    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

    const config: RequestInit = {
      ...fetchOptions,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...fetchOptions.headers,
      },
    };

    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `Request failed with status ${response.status}`);
    }

    return data;
  }

  async get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "GET" });
  }

  async post<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  async put<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "PUT",
      body: JSON.stringify(body),
    });
  }

  async delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "DELETE" });
  }
}

export const apiClient = new ApiClient();

import type {
  AuthResponse,
  TokenResponse,
  ProfileResponse,
  ProfileData,
  PasswordListResponse,
  PasswordResponse,
  SecurityResponse,
  DevicesResponse,
  SessionsResponse,
  ActivitiesResponse,
  ThirdPartyResponse,
  ContactListResponse,
  ContactResponse,
  GroupListResponse,
  GroupResponse,
  PrivacyResponse,
  DataExportResponse,
  Article,
  ArticleListResponse,
  ArticleResponse,
  HomepageArticlesResponse,
  SectionArticlesResponse,
  Category,
  CategoryListResponse,
  CategoryResponse,
  Comment,
  CommentListResponse,
  CommentResponse,
  Bookmark,
  BookmarkListResponse,
  BookmarkResponse,
  ReadingHistory,
  HistoryListResponse,
  EtheriaNotification,
  NotificationListResponse,
  NotificationResponse,
  Subscription,
  SubscriptionResponse,
  Media,
  MediaListResponse,
  MediaResponse,
  SystemSettings,
  SettingsResponse,
  User,
  EtheriaUserResponse,
  EtheriaUserListResponse,
  PaginatedResponse,
} from "./types";

export const authApi = {
  login: (email: string, password: string) =>
    apiClient.post<AuthResponse>("/api/v1/auth/login", { email, password }),

  register: (data: { email: string; password: string; firstName?: string; lastName?: string }) =>
    apiClient.post<AuthResponse>("/api/v1/auth/register", data),

  logout: () => apiClient.post<AuthResponse>("/api/v1/auth/logout"),

  refresh: (refreshToken: string) =>
    apiClient.post<AuthResponse>("/api/v1/auth/refresh", { refresh_token: refreshToken }),

  changePassword: (currentPassword: string, newPassword: string) =>
    apiClient.post<AuthResponse>("/api/v1/auth/change-password", { currentPassword, newPassword }),

  resetPassword: (email: string) =>
    apiClient.post<AuthResponse>("/api/v1/auth/reset-password", { email }),

  getAccount: () => apiClient.get<AuthResponse>("/api/v1/account/me"),

  storeTokens: (accessToken: string, refreshToken: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken || "");
    }
  },

  clearTokens: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    }
  },

  getStoredUser: (): TokenResponse["user"] | null => {
    if (typeof window === "undefined") return null;
    const userStr = localStorage.getItem("user");
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  storeUser: (user: TokenResponse["user"]) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("user", JSON.stringify(user));
    }
  },

  clearUser: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("user");
    }
  },

  getStoredToken: (): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("accessToken");
  },
};

export const profileApi = {
  get: () => apiClient.get<ProfileResponse>("/api/v1/profile/"),

  update: (data: Partial<ProfileData>) => apiClient.put<ProfileResponse>("/api/v1/profile/", data),

  uploadAvatar: async (file: File) => {
    const formData = new FormData();
    formData.append("avatar", file);

    const token = localStorage.getItem("accessToken");
    const response = await fetch(`${API_BASE_URL}/api/v1/profile/avatar`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    return response.json();
  },
};

export const passwordApi = {
  list: () => apiClient.get<PasswordListResponse>("/api/v1/passwords/"),

  get: (id: string) => apiClient.get<PasswordResponse>(`/api/v1/passwords/${id}`),

  create: (data: {
    name: string;
    username?: string;
    password?: string;
    url?: string;
    category: string;
    notes?: string;
  }) => apiClient.post<PasswordResponse>("/api/v1/passwords/", data),

  update: (
    id: string,
    data: {
      name?: string;
      username?: string;
      password?: string;
      url?: string;
      category?: string;
      notes?: string;
      favorite?: boolean;
    }
  ) => apiClient.put<PasswordResponse>(`/api/v1/passwords/${id}`, data),

  delete: (id: string) => apiClient.delete<PasswordResponse>(`/api/v1/passwords/${id}`),
};

export const securityApi = {
  getInfo: () => apiClient.get<SecurityResponse>("/api/v1/security/"),

  getDevices: () => apiClient.get<DevicesResponse>("/api/v1/security/devices"),

  getSessions: () => apiClient.get<SessionsResponse>("/api/v1/security/sessions"),

  getActivities: () => apiClient.get<ActivitiesResponse>("/api/v1/security/activities"),

  trustDevice: (id: string) =>
    apiClient.post<DevicesResponse>(`/api/v1/security/devices/${id}/trust`),

  revokeDevice: (id: string) => apiClient.delete<DevicesResponse>(`/api/v1/security/devices/${id}`),

  revokeSession: (id: string) =>
    apiClient.delete<SessionsResponse>(`/api/v1/security/sessions/${id}`),

  enableTwoFactor: (method: string, code: string) =>
    apiClient.post<SecurityResponse>("/api/v1/security/2fa/enable", { method, code }),

  disableTwoFactor: (code: string) =>
    apiClient.post<SecurityResponse>("/api/v1/security/2fa/disable", { code }),

  verifyTwoFactor: (code: string) =>
    apiClient.post<SecurityResponse>("/api/v1/security/2fa/verify", { code }),
};

export const thirdPartyApi = {
  list: () => apiClient.get<ThirdPartyResponse>("/api/v1/third-party/"),

  connect: (appName: string, authCode: string) =>
    apiClient.post<ThirdPartyResponse>("/api/v1/third-party/", {
      app_name: appName,
      auth_code: authCode,
    }),

  revoke: (id: string) => apiClient.delete<ThirdPartyResponse>(`/api/v1/third-party/${id}`),
};

export const contactApi = {
  list: (params?: { offset?: number; limit?: number }) => {
    const queryParams: Record<string, string> = {};
    if (params?.offset !== undefined) queryParams.offset = String(params.offset);
    if (params?.limit !== undefined) queryParams.limit = String(params.limit);
    return apiClient.get<ContactListResponse>("/api/v1/contacts/", { params: queryParams });
  },

  get: (id: string) => apiClient.get<ContactResponse>(`/api/v1/contacts/${id}`),

  create: (data: {
    account_id: string;
    name: string;
    email: string;
    phone?: string;
    company?: string;
  }) => apiClient.post<ContactResponse>("/api/v1/contacts/", data),

  update: (
    id: string,
    data: {
      account_id: string;
      name?: string;
      email?: string;
      phone?: string;
      company?: string;
    }
  ) => apiClient.put<ContactResponse>(`/api/v1/contacts/${id}`, data),

  delete: (id: string) => apiClient.delete<ContactResponse>(`/api/v1/contacts/${id}`),

  listGroups: () => apiClient.get<GroupListResponse>("/api/v1/contacts/groups"),

  createGroup: (data: { account_id: string; name: string; contact_ids?: string[] }) =>
    apiClient.post<GroupResponse>("/api/v1/contacts/groups", data),
};

export const privacyApi = {
  get: () => apiClient.get<PrivacyResponse>("/api/v1/privacy/"),

  update: (data: {
    profile_visibility?: string;
    show_email?: boolean;
    show_phone?: boolean;
    show_activity?: boolean;
    data_collection?: boolean;
    personalized_ads?: boolean;
    analytics?: boolean;
    location_tracking?: boolean;
  }) => apiClient.put<PrivacyResponse>("/api/v1/privacy/", data),

  export: (format: "json" | "csv" | "pdf") =>
    apiClient.post<DataExportResponse>("/api/v1/privacy/export", { format }),

  deleteAccount: (password: string, confirm: boolean) =>
    apiClient.post<AuthResponse>("/api/v1/privacy/delete", { password, confirm }),
};

// ==================== ETHERIA API ====================

export const articlesApi = {
  list: (params?: {
    page?: number;
    pageSize?: number;
    status?: string;
    category?: string;
    search?: string;
  }) => {
    const queryParams: Record<string, string> = {};
    if (params?.page) queryParams.page = String(params.page);
    if (params?.pageSize) queryParams.pageSize = String(params.pageSize);
    if (params?.status) queryParams.status = params.status;
    if (params?.category) queryParams.category = params.category;
    if (params?.search) queryParams.search = params.search;
    return apiClient.get<ArticleListResponse>("/api/v1/articles", { params: queryParams });
  },

  get: (id: string) => apiClient.get<ArticleResponse>(`/api/v1/articles/${id}`),

  getBySlug: (slug: string) => apiClient.get<ArticleResponse>(`/api/v1/articles/slug/${slug}`),

  create: (data: {
    title: string;
    content: string;
    excerpt?: string;
    categoryId?: string;
    imageUrl?: string;
    imageAlt?: string;
    seoTitle?: string;
    seoDescription?: string;
    seoKeywords?: string;
  }) => apiClient.post<ArticleResponse>("/api/v1/articles", data),

  update: (
    id: string,
    data: {
      title?: string;
      content?: string;
      excerpt?: string;
      categoryId?: string;
      status?: string;
      imageUrl?: string;
      imageAlt?: string;
      seoTitle?: string;
      seoDescription?: string;
      seoKeywords?: string;
      featured?: boolean;
      scheduledAt?: string;
    }
  ) => apiClient.put<ArticleResponse>(`/api/v1/articles/${id}`, data),

  delete: (id: string) => apiClient.delete<ArticleResponse>(`/api/v1/articles/${id}`),

  publish: (id: string) => apiClient.post<ArticleResponse>(`/api/v1/articles/${id}/publish`),

  archive: (id: string) => apiClient.post<ArticleResponse>(`/api/v1/articles/${id}/archive`),

  toggleFeatured: (id: string) => apiClient.post<ArticleResponse>(`/api/v1/articles/${id}/feature`),

  getHomepage: (locale: string = "fr") =>
    apiClient.get<HomepageArticlesResponse>(`/api/v1/articles/homepage`, {
      params: { locale },
    }),

  getBySection: (section: string, locale: string = "fr", limit?: number) => {
    const queryParams: Record<string, string> = { locale };
    if (limit) queryParams.limit = String(limit);
    return apiClient.get<SectionArticlesResponse>(`/api/v1/articles/section/${section}`, {
      params: queryParams,
    });
  },
};

export const categoriesApi = {
  list: () => apiClient.get<CategoryListResponse>("/api/v1/categories"),

  get: (id: string) => apiClient.get<CategoryResponse>(`/api/v1/categories/${id}`),

  create: (data: { name: string; description?: string; color?: string; parentId?: string }) =>
    apiClient.post<CategoryResponse>("/api/v1/categories", data),

  update: (
    id: string,
    data: {
      name?: string;
      description?: string;
      color?: string;
      parentId?: string;
      isVisible?: boolean;
    }
  ) => apiClient.put<CategoryResponse>(`/api/v1/categories/${id}`, data),

  delete: (id: string) => apiClient.delete<CategoryResponse>(`/api/v1/categories/${id}`),
};

export const commentsApi = {
  list: (articleId: string, params?: { page?: number; pageSize?: number }) => {
    const queryParams: Record<string, string> = {};
    if (params?.page) queryParams.page = String(params.page);
    if (params?.pageSize) queryParams.pageSize = String(params.pageSize);
    return apiClient.get<CommentListResponse>(`/api/v1/comments/article/${articleId}`, {
      params: queryParams,
    });
  },

  create: (data: { content: string; articleId: string; parentId?: string }) =>
    apiClient.post<CommentResponse>("/api/v1/comments", data),

  update: (id: string, data: { content?: string; isApproved?: boolean }) =>
    apiClient.put<CommentResponse>(`/api/v1/comments/${id}`, data),

  delete: (id: string) => apiClient.delete<CommentResponse>(`/api/v1/comments/${id}`),

  flag: (id: string) => apiClient.post<CommentResponse>(`/api/v1/comments/${id}/flag`),

  approve: (id: string) => apiClient.post<CommentResponse>(`/api/v1/comments/${id}/approve`),
};

export const bookmarksApi = {
  list: () => apiClient.get<BookmarkListResponse>("/api/v1/user/bookmarks"),

  add: (articleId: string) =>
    apiClient.post<BookmarkResponse>("/api/v1/user/bookmarks", { articleId }),

  remove: (articleId: string) =>
    apiClient.delete<BookmarkResponse>(`/api/v1/user/bookmarks/${articleId}`),
};

export const historyApi = {
  list: () => apiClient.get<HistoryListResponse>("/api/v1/user/history"),

  add: (articleId: string) =>
    apiClient.post<HistoryListResponse>("/api/v1/user/history", { articleId }),

  clear: () => apiClient.delete<HistoryListResponse>("/api/v1/user/history"),

  remove: (articleId: string) =>
    apiClient.delete<HistoryListResponse>(`/api/v1/user/history/${articleId}`),
};

export const notificationsApi = {
  list: (params?: { page?: number; pageSize?: number }) => {
    const queryParams: Record<string, string> = {};
    if (params?.page) queryParams.page = String(params.page);
    if (params?.pageSize) queryParams.pageSize = String(params.pageSize);
    return apiClient.get<NotificationListResponse>("/api/v1/user/notifications", {
      params: queryParams,
    });
  },

  markRead: (id: string) =>
    apiClient.put<NotificationResponse>(`/api/v1/user/notifications/${id}/read`),

  markAllRead: () => apiClient.put<NotificationResponse>("/api/v1/user/notifications/read-all"),

  delete: (id: string) =>
    apiClient.delete<NotificationResponse>(`/api/v1/user/notifications/${id}`),
};

export const subscriptionApi = {
  get: () => apiClient.get<SubscriptionResponse>("/api/v1/user/subscription"),

  create: (plan: "ESSENTIAL" | "PREMIUM") =>
    apiClient.post<SubscriptionResponse>("/api/v1/user/subscription", { plan }),

  update: (plan: "ESSENTIAL" | "PREMIUM") =>
    apiClient.put<SubscriptionResponse>("/api/v1/user/subscription", { plan }),

  cancel: () => apiClient.post<SubscriptionResponse>("/api/v1/user/subscription/cancel"),
};

export const mediaApi = {
  list: () => apiClient.get<MediaListResponse>("/api/v1/media"),

  upload: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const token = localStorage.getItem("accessToken");
    const response = await fetch(`${API_BASE_URL}/api/v1/media`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    return response.json();
  },

  delete: (id: string) => apiClient.delete<MediaResponse>(`/api/v1/media/${id}`),
};

export const settingsApi = {
  get: () => apiClient.get<SettingsResponse>("/api/v1/settings"),

  update: (data: Partial<SystemSettings>) =>
    apiClient.put<SettingsResponse>("/api/v1/settings", data),

  testEmail: () => apiClient.post<SettingsResponse>("/api/v1/settings/test-email"),
};

export const adminUsersApi = {
  list: (params?: { page?: number; pageSize?: number; search?: string; role?: string }) => {
    const queryParams: Record<string, string> = {};
    if (params?.page) queryParams.page = String(params.page);
    if (params?.pageSize) queryParams.pageSize = String(params.pageSize);
    if (params?.search) queryParams.search = params.search;
    if (params?.role) queryParams.role = params.role;
    return apiClient.get<EtheriaUserListResponse>("/api/v1/admin/users", { params: queryParams });
  },

  get: (id: string) => apiClient.get<EtheriaUserResponse>(`/api/v1/admin/users/${id}`),

  create: (data: {
    email: string;
    firstName?: string;
    lastName?: string;
    role?: string;
    password: string;
  }) => apiClient.post<EtheriaUserResponse>("/api/v1/admin/users", data),

  update: (
    id: string,
    data: { firstName?: string; lastName?: string; role?: string; isActive?: boolean }
  ) => apiClient.put<EtheriaUserResponse>(`/api/v1/admin/users/${id}`, data),

  delete: (id: string) => apiClient.delete<EtheriaUserResponse>(`/api/v1/admin/users/${id}`),
};

export interface FooterLink {
  id: string;
  category: string;
  title: string;
  name: string;
  href: string;
  locale: string;
  position: number;
  isVisible: boolean;
}

export interface FooterLinksResponse {
  success: boolean;
  data: FooterLink[];
  error?: string;
}

export const footerLinksApi = {
  list: (params?: { locale?: string }) => {
    const queryParams: Record<string, string> = {};
    if (params?.locale) queryParams.locale = params.locale;
    return apiClient.get<FooterLinksResponse>("/api/v1/footer-links", { params: queryParams });
  },

  create: (data: Omit<FooterLink, "id">) =>
    apiClient.post<FooterLinksResponse>("/api/v1/admin/footer-links", data),

  update: (id: string, data: Partial<FooterLink>) =>
    apiClient.put<FooterLinksResponse>(`/api/v1/admin/footer-links/${id}`, data),

  delete: (id: string) => apiClient.delete<FooterLinksResponse>(`/api/v1/admin/footer-links/${id}`),
};
