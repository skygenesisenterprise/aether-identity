export interface User {
  id: string;
  email: string;
  name: string;
  username?: string;
  avatarUrl?: string;
  role?: string;
  active?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  user: User;
}

export interface AuthResponse {
  success: boolean;
  data?: TokenResponse;
  error?: string;
  message?: string;
}

export interface ProfileData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  phone: string;
  birthDate: string;
  language: string;
  avatarUrl: string;
  aetherId: string;
  accountType: string;
  addresses: Address[];
  createdAt: string;
}

export interface Address {
  id: string;
  label: string;
  value: string;
  isPrimary: boolean;
}

export interface ProfileResponse {
  success: boolean;
  data?: ProfileData;
  error?: string;
}

export interface Password {
  id: string;
  name: string;
  username: string;
  password: string;
  url?: string;
  favorite: boolean;
  category: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PasswordListResponse {
  success: boolean;
  data?: Password[];
  error?: string;
}

export interface PasswordResponse {
  success: boolean;
  data?: Password;
  error?: string;
}

export interface Device {
  id: string;
  name: string;
  type: string;
  os?: string;
  browser?: string;
  lastSeen?: string;
  isTrusted: boolean;
}

export interface Session {
  id: string;
  token?: string;
  deviceId?: string;
  ipAddress?: string;
  userAgent?: string;
  expiresAt?: string;
  createdAt?: string;
}

export interface SecurityActivity {
  id: string;
  type: string;
  title: string;
  description?: string;
  device?: string;
  ipAddress?: string;
  time?: string;
}

export interface TwoFactorConfig {
  enabled: boolean;
  method?: string;
}

export interface SecurityData {
  devices: Device[];
  sessions: Session[];
  activities: SecurityActivity[];
  twoFactor: TwoFactorConfig;
  passkeyEnabled: boolean;
  secureNavigation: boolean;
}

export interface SecurityResponse {
  success: boolean;
  data?: SecurityData;
  error?: string;
}

export interface DevicesResponse {
  success: boolean;
  data?: Device[];
  error?: string;
}

export interface SessionsResponse {
  success: boolean;
  data?: Session[];
  error?: string;
}

export interface ActivitiesResponse {
  success: boolean;
  data?: SecurityActivity[];
  error?: string;
}

export interface ThirdPartyApp {
  id: string;
  name: string;
  accessLevel: string;
  connectedAt?: string;
}

export interface ThirdPartyResponse {
  success: boolean;
  data?: ThirdPartyApp[];
  error?: string;
}

export interface Contact {
  id: string;
  accountId?: string;
  name: string;
  firstName?: string;
  lastName?: string;
  email: string;
  nickname?: string;
  company?: string;
  jobTitle?: string;
  department?: string;
  phone?: string;
  mobile?: string;
  address?: string;
  avatarUrl?: string;
  starred?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ContactGroup {
  id: string;
  accountId?: string;
  name: string;
  description?: string;
  totalContacts?: number;
  createdAt?: string;
}

export interface ContactList {
  accountId: string;
  totalContacts: number;
  contacts: Contact[];
  hasMore: boolean;
  offset: number;
  limit: number;
}

export interface ContactListResponse {
  success: boolean;
  data?: ContactList;
  error?: string;
}

export interface ContactResponse {
  success: boolean;
  data?: Contact;
  error?: string;
}

export interface GroupListResponse {
  success: boolean;
  data?: {
    accountId: string;
    groups: ContactGroup[];
    total: number;
  };
  error?: string;
}

export interface GroupResponse {
  success: boolean;
  data?: ContactGroup;
  error?: string;
}

export interface AccountPrivacySettings {
  profileVisibility: string;
  showEmail: boolean;
  showPhone: boolean;
  showActivity: boolean;
  dataCollection: boolean;
  personalizedAds: boolean;
  analytics: boolean;
  locationTracking: boolean;
}

export interface PrivacyResponse {
  success: boolean;
  data?: AccountPrivacySettings;
  error?: string;
}

export interface DataExportResponse {
  success: boolean;
  message?: string;
  dataUrl?: string;
  error?: string;
}

// ==================== ETHERIA TYPES ====================

export type ArticleStatus = "DRAFT" | "REVIEW" | "PUBLISHED" | "ARCHIVED";
export type SubscriptionPlan = "ESSENTIAL" | "PREMIUM";
export type SubscriptionStatus = "ACTIVE" | "CANCELLED" | "EXPIRED" | "PAST_DUE";
export type NotificationType = "ARTICLE" | "BOOKMARK" | "SYSTEM" | "ACCOUNT" | "COMMENT";

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  contentHtml?: string;
  status: ArticleStatus;
  featured: boolean;
  publishedAt?: string;
  scheduledAt?: string;
  viewCount: number;
  readTime: number;
  imageUrl?: string;
  imageAlt?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  authorId: string;
  categoryId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  isVisible: boolean;
  parentId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  content: string;
  isApproved: boolean;
  isFlagged: boolean;
  flagReason?: string;
  parentId?: string;
  articleId: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Bookmark {
  id: string;
  userId: string;
  articleId: string;
  createdAt: string;
}

export interface ReadingHistory {
  id: string;
  userId: string;
  articleId: string;
  readAt: string;
}

export interface EtheriaNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
  priority: string;
  userId: string;
  createdAt: string;
}

export interface Media {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  alt?: string;
  width?: number;
  height?: number;
  articleId?: string;
  categoryId?: string;
  createdAt: string;
}

export interface Subscription {
  id: string;
  userId: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  startedAt: string;
  expiresAt?: string;
  lastPaymentDate?: string;
  nextPaymentDate?: string;
  paymentMethod?: string;
  paymentLast4?: string;
  cancelAtPeriodEnd: boolean;
}

export interface SystemSettings {
  id: string;
  siteName: string;
  siteDescription?: string;
  siteUrl?: string;
  logoUrl?: string;
  faviconUrl?: string;
  email?: string;
  smtpHost?: string;
  smtpPort?: number;
  smtpUser?: string;
  fromName?: string;
  fromEmail?: string;
  maintenanceMode: boolean;
  registrationOpen: boolean;
  commentsEnabled: boolean;
  newsletterEnabled: boolean;
  analyticsEnabled: boolean;
  sslEnforced: boolean;
  dockerImage: string;
  version: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiResponse {
  success: boolean;
  data?: unknown;
  message?: string;
  error?: string;
}

export interface ArticleListResponse extends ApiResponse {
  data?: Article[];
  total?: number;
  page?: number;
  pageSize?: number;
  totalPages?: number;
}
export interface ArticleResponse extends ApiResponse {
  data?: Article;
}

export interface HomepageArticlesResponse extends ApiResponse {
  data?: {
    featured: Article;
    topArticles: Article[];
    mostRead: Article[];
    sections: Record<string, Article[]>;
  };
}

export interface SectionArticlesResponse extends ApiResponse {
  data?: Article[];
}

export interface CategoryListResponse extends ApiResponse {
  data?: Category[];
  total?: number;
}
export interface CategoryResponse extends ApiResponse {
  data?: Category;
}
export interface CommentListResponse extends ApiResponse {
  data?: Comment[];
  total?: number;
  page?: number;
  pageSize?: number;
  totalPages?: number;
}
export interface CommentResponse extends ApiResponse {
  data?: Comment;
}
export interface BookmarkListResponse extends ApiResponse {
  data?: Bookmark[];
}
export interface BookmarkResponse extends ApiResponse {
  data?: Bookmark;
}
export interface HistoryListResponse extends ApiResponse {
  data?: ReadingHistory[];
}
export interface NotificationListResponse extends ApiResponse {
  data?: EtheriaNotification[];
  total?: number;
  page?: number;
  pageSize?: number;
  totalPages?: number;
}
export interface NotificationResponse extends ApiResponse {}
export interface SubscriptionResponse extends ApiResponse {}
export interface MediaListResponse extends ApiResponse {
  data?: Media[];
}
export interface MediaResponse extends ApiResponse {}
export interface SettingsResponse extends ApiResponse {
  data?: SystemSettings;
}
export interface EtheriaUserResponse extends ApiResponse {}
export interface EtheriaUserListResponse {
  success?: boolean;
  data?: AdminUser[];
  total?: number;
  page?: number;
  pageSize?: number;
  totalPages?: number;
  error?: string;
}

export interface AdminUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  role?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
