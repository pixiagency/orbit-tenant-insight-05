
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'super-admin' | 'admin' | 'user' | 'viewer';
  status: 'active' | 'inactive' | 'pending' | 'suspended';
  clientId?: string;
  clientName?: string;
  clientIds?: string[]; // New field for multi-client support
  lastLogin?: string;
  loginCount: number;
  permissions: string[];
  avatar?: string;
  phone?: string;
  department?: string;
  jobTitle?: string;
  isEmailVerified: boolean;
  isTwoFactorEnabled: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  notes?: string;
}

export interface UserFormData {
  name: string;
  email: string;
  role: 'super-admin' | 'admin' | 'user' | 'viewer';
  status: 'active' | 'inactive' | 'pending' | 'suspended';
  clientId?: string;
  clientIds?: string[]; // New field for multi-client support
  phone?: string;
  department?: string;
  jobTitle?: string;
  permissions: string[];
  sendInviteEmail: boolean;
  temporaryPassword?: string;
  notes?: string;
}

export interface UserFilters {
  search: string;
  role: string;
  status: string;
  clientId: string;
  department: string;
  isEmailVerified: string;
  isTwoFactorEnabled: string;
  lastLoginRange: string;
  dateRange: { from?: string; to?: string };
}

// New interface for task assignments
export interface TaskUser {
  id: string;
  name: string;
  email: string;
  role: string;
  department?: string;
  avatar?: string;
}
