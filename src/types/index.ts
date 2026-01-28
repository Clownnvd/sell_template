// Re-export Prisma types
export type {
  User,
  Account,
  Session,
  Verification,
} from "@prisma/client";

// API Response types
export type ApiResponse<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
  errors?: Record<string, string[]>;
};

export type PaginatedResponse<T = unknown> = {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type PaginationParams = {
  page?: number;
  limit?: number;
};

// Session types (extends BetterAuth session)
export type SessionUser = {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type SessionData = {
  user: SessionUser;
  session: {
    id: string;
    expiresAt: Date;
    token: string;
  };
};

// Feature flags
export type FeatureFlags = {
  enableBilling: boolean;
  enableTeams: boolean;
  enableAnalytics: boolean;
  enableNotifications: boolean;
};
