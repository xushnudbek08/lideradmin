const API_BASE_URL = "https://xushnudbek0808.pythonanywhere.com/api/v1"

// Types
export type UserRole = "client" | "agent" | "partner" | "manager"

export interface User {
  id: number
  username: string
  email: string
  first_name: string
  last_name: string
}

export interface UserProfile {
  user: User
  role: UserRole
  phone: string | null
  company: number | null
  manager: number | null
  created_at: string
}

export interface LoginResponse {
  access: string
  refresh: string
}

export interface RegistrationData {
  username: string
  password: string
  email: string
  first_name: string
  last_name: string
  role: UserRole
  phone: string
}

export interface Application {
  id: number
  applicant: User
  documents: Document[]
  selected_banks: Bank[]
  title: string
  amount: string | null
  status: "draft" | "submitted" | "under_review" | "approved" | "rejected"
  notes: string
  created_at: string
  updated_at: string
  company: number | null
}

export interface ApplicationCreate {
  title: string
  company?: number | null
  amount?: string | null
  selected_banks?: number[]
  notes?: string
  status?: string
}

export interface Bank {
  id: number
  name: string
  bic: string | null
  is_mfo: boolean
}

export interface CompanyManagement {
  id: number
  position: string
  full_name: string
  phone: string | null
  email: string | null
  passport_series: string | null
  passport_number: string | null
  passport_issued_by: string | null
  passport_issued_date: string | null
  company: number
}

export interface CompanyFounder {
  id: number
  founder_type: "individual" | "legal"
  full_name?: string
  company_name?: string
  inn: string
  share_percentage: number
  share_amount: number
  passport_series?: string
  passport_number?: string
  passport_issued_by?: string
  passport_issued_date?: string
  address?: string
  company: number
}

export interface CompanyContact {
  id: number
  full_name: string
  position: string
  phone: string | null
  email: string | null
  is_main_contact: boolean
  company: number
}

export interface Company {
  id: number
  name: string
  short_name?: string
  full_name?: string
  inn: string | null
  kpp?: string | null
  ogrn?: string | null
  okpo?: string | null
  okved?: string | null
  address: string
  legal_address?: string
  actual_address?: string
  phone?: string | null
  email?: string | null
  website?: string | null
  registration_date?: string | null
  registration_authority?: string | null
  registration_number?: string | null
  registration_certificate?: string | null
  activity_type?: string | null
  licenses?: any[] | null
  management?: CompanyManagement[]
  founders?: CompanyFounder[]
  bank_name?: string | null
  bank_bik?: string | null
  bank_account?: string | null
  correspondent_account?: string | null
  etp_accounts?: any[] | null
  contact_persons?: CompanyContact[]
  requisites: unknown | null
  created_at: string
  created_by: number | null
}

export interface Document {
  id: number
  uploaded_by: User
  file: string
  doc_type: "statute" | "accounting" | "other"
  created_at: string
  application: number | null
}

export interface ChatMessage {
  id: number
  sender: User
  text: string
  attachment: string | null
  created_at: string
  read: boolean
  application: number | null
}

export interface News {
  id: number
  title: string
  description: string
  link: string
  published_date: string
  source: string
  image_url: string | null
  created_at: string
}

export interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

// Helper to get auth headers
function getAuthHeaders(): HeadersInit {
  if (typeof window === "undefined") return {}
  const token = localStorage.getItem("access_token")
  return token ? { Authorization: `Bearer ${token}` } : {}
}

// API Error handler
class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message)
    this.name = "ApiError"
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    const message =
      errorData.detail || errorData.message || Object.values(errorData).flat().join(", ") || "Произошла ошибка"
    throw new ApiError(response.status, message)
  }
  if (response.status === 204) return {} as T
  return response.json()
}

// Auth API
export const authApi = {
  login: async (username: string, password: string): Promise<LoginResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/login/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    })
    return handleResponse<LoginResponse>(response)
  },

  register: async (data: RegistrationData): Promise<{ id: number }> => {
    const response = await fetch(`${API_BASE_URL}/auth/register/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    return handleResponse(response)
  },

  refreshToken: async (refresh: string): Promise<{ access: string }> => {
    const response = await fetch(`${API_BASE_URL}/auth/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh }),
    })
    return handleResponse(response)
  },

  getProfile: async (): Promise<UserProfile> => {
    const response = await fetch(`${API_BASE_URL}/auth/profile/`, {
      headers: { ...getAuthHeaders() },
    })
    return handleResponse<UserProfile>(response)
  },

  updateProfile: async (data: Partial<UserProfile>): Promise<UserProfile> => {
    const response = await fetch(`${API_BASE_URL}/auth/profile/`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", ...getAuthHeaders() },
      body: JSON.stringify(data),
    })
    return handleResponse<UserProfile>(response)
  },
}

// Applications API
export const applicationsApi = {
  list: async (limit = 10, offset = 0): Promise<PaginatedResponse<Application>> => {
    const response = await fetch(`${API_BASE_URL}/applications/?limit=${limit}&offset=${offset}`, {
      headers: { ...getAuthHeaders() },
    })
    return handleResponse<PaginatedResponse<Application>>(response)
  },

  get: async (id: number): Promise<Application> => {
    const response = await fetch(`${API_BASE_URL}/applications/${id}/`, {
      headers: { ...getAuthHeaders() },
    })
    return handleResponse<Application>(response)
  },

  create: async (data: ApplicationCreate): Promise<ApplicationCreate & { id: number }> => {
    const response = await fetch(`${API_BASE_URL}/applications/`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...getAuthHeaders() },
      body: JSON.stringify(data),
    })
    return handleResponse(response)
  },

  update: async (id: number, data: Partial<ApplicationCreate>): Promise<ApplicationCreate> => {
    const response = await fetch(`${API_BASE_URL}/applications/${id}/`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", ...getAuthHeaders() },
      body: JSON.stringify(data),
    })
    return handleResponse(response)
  },

  delete: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/applications/${id}/`, {
      method: "DELETE",
      headers: { ...getAuthHeaders() },
    })
    return handleResponse(response)
  },

  submit: async (id: number): Promise<Application> => {
    const response = await fetch(`${API_BASE_URL}/applications/${id}/submit/`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...getAuthHeaders() },
      body: JSON.stringify({}),
    })
    return handleResponse<Application>(response)
  },

  approve: async (id: number): Promise<Application> => {
    const response = await fetch(`${API_BASE_URL}/applications/${id}/approve/`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...getAuthHeaders() },
      body: JSON.stringify({}),
    })
    return handleResponse<Application>(response)
  },

  reject: async (id: number): Promise<Application> => {
    const response = await fetch(`${API_BASE_URL}/applications/${id}/reject/`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...getAuthHeaders() },
      body: JSON.stringify({}),
    })
    return handleResponse<Application>(response)
  },

  getMyApplications: async (): Promise<Application[]> => {
    const response = await fetch(`${API_BASE_URL}/applications/my_applications/`, {
      headers: { ...getAuthHeaders() },
    })
    return handleResponse<Application[]>(response)
  },

  getMyWins: async (): Promise<Application[]> => {
    const response = await fetch(`${API_BASE_URL}/applications/my_wins/`, {
      headers: { ...getAuthHeaders() },
    })
    return handleResponse<Application[]>(response)
  },

  getAgents: async (): Promise<User[]> => {
    const response = await fetch(`${API_BASE_URL}/applications/agents/`, {
      headers: { ...getAuthHeaders() },
    })
    return handleResponse<User[]>(response)
  },

  getClients: async (): Promise<User[]> => {
    const response = await fetch(`${API_BASE_URL}/applications/clients/`, {
      headers: { ...getAuthHeaders() },
    })
    return handleResponse<User[]>(response)
  },
}

// Banks API
export const banksApi = {
  list: async (limit = 100, offset = 0): Promise<PaginatedResponse<Bank>> => {
    const response = await fetch(`${API_BASE_URL}/banks/?limit=${limit}&offset=${offset}`, {
      headers: { ...getAuthHeaders() },
    })
    return handleResponse<PaginatedResponse<Bank>>(response)
  },

  get: async (id: number): Promise<Bank> => {
    const response = await fetch(`${API_BASE_URL}/banks/${id}/`, {
      headers: { ...getAuthHeaders() },
    })
    return handleResponse<Bank>(response)
  },
}

// Companies API
export const companiesApi = {
  list: async (limit = 100, offset = 0): Promise<PaginatedResponse<Company>> => {
    const response = await fetch(`${API_BASE_URL}/companies/?limit=${limit}&offset=${offset}`, {
      headers: { ...getAuthHeaders() },
    })
    return handleResponse<PaginatedResponse<Company>>(response)
  },

  get: async (id: number): Promise<Company> => {
    const response = await fetch(`${API_BASE_URL}/companies/${id}/`, {
      headers: { ...getAuthHeaders() },
    })
    return handleResponse<Company>(response)
  },

  getMyCompany: async (): Promise<Company> => {
    const response = await fetch(`${API_BASE_URL}/companies/my_company/`, {
      headers: { ...getAuthHeaders() },
    })
    return handleResponse<Company>(response)
  },

  create: async (data: Omit<Company, "id" | "created_at" | "created_by">): Promise<Company> => {
    const response = await fetch(`${API_BASE_URL}/companies/`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...getAuthHeaders() },
      body: JSON.stringify(data),
    })
    return handleResponse<Company>(response)
  },

  update: async (id: number, data: Partial<Omit<Company, "id" | "created_at" | "created_by">>): Promise<Company> => {
    const response = await fetch(`${API_BASE_URL}/companies/${id}/`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", ...getAuthHeaders() },
      body: JSON.stringify(data),
    })
    return handleResponse<Company>(response)
  },

  updateMyCompany: async (data: Partial<Company>): Promise<Company> => {
    const response = await fetch(`${API_BASE_URL}/companies/my_company/`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", ...getAuthHeaders() },
      body: JSON.stringify(data),
    })
    return handleResponse<Company>(response)
  },
}

// Company Management API
export const companyManagementApi = {
  list: async (): Promise<CompanyManagement[]> => {
    const response = await fetch(`${API_BASE_URL}/company-management/`, {
      headers: { ...getAuthHeaders() },
    })
    return handleResponse<CompanyManagement[]>(response)
  },

  get: async (id: number): Promise<CompanyManagement> => {
    const response = await fetch(`${API_BASE_URL}/company-management/${id}/`, {
      headers: { ...getAuthHeaders() },
    })
    return handleResponse<CompanyManagement>(response)
  },

  create: async (data: Omit<CompanyManagement, "id" | "company">): Promise<CompanyManagement> => {
    const response = await fetch(`${API_BASE_URL}/company-management/`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...getAuthHeaders() },
      body: JSON.stringify(data),
    })
    return handleResponse<CompanyManagement>(response)
  },

  update: async (id: number, data: Partial<Omit<CompanyManagement, "id" | "company">>): Promise<CompanyManagement> => {
    const response = await fetch(`${API_BASE_URL}/company-management/${id}/`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", ...getAuthHeaders() },
      body: JSON.stringify(data),
    })
    return handleResponse<CompanyManagement>(response)
  },

  delete: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/company-management/${id}/`, {
      method: "DELETE",
      headers: { ...getAuthHeaders() },
    })
    return handleResponse<void>(response)
  },
}

// Company Founders API
export const companyFoundersApi = {
  list: async (): Promise<CompanyFounder[]> => {
    const response = await fetch(`${API_BASE_URL}/company-founders/`, {
      headers: { ...getAuthHeaders() },
    })
    return handleResponse<CompanyFounder[]>(response)
  },

  get: async (id: number): Promise<CompanyFounder> => {
    const response = await fetch(`${API_BASE_URL}/company-founders/${id}/`, {
      headers: { ...getAuthHeaders() },
    })
    return handleResponse<CompanyFounder>(response)
  },

  create: async (data: Omit<CompanyFounder, "id" | "company">): Promise<CompanyFounder> => {
    const response = await fetch(`${API_BASE_URL}/company-founders/`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...getAuthHeaders() },
      body: JSON.stringify(data),
    })
    return handleResponse<CompanyFounder>(response)
  },

  update: async (id: number, data: Partial<Omit<CompanyFounder, "id" | "company">>): Promise<CompanyFounder> => {
    const response = await fetch(`${API_BASE_URL}/company-founders/${id}/`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", ...getAuthHeaders() },
      body: JSON.stringify(data),
    })
    return handleResponse<CompanyFounder>(response)
  },

  delete: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/company-founders/${id}/`, {
      method: "DELETE",
      headers: { ...getAuthHeaders() },
    })
    return handleResponse<void>(response)
  },
}

// Company Contacts API
export const companyContactsApi = {
  list: async (): Promise<CompanyContact[]> => {
    const response = await fetch(`${API_BASE_URL}/company-contacts/`, {
      headers: { ...getAuthHeaders() },
    })
    return handleResponse<CompanyContact[]>(response)
  },

  get: async (id: number): Promise<CompanyContact> => {
    const response = await fetch(`${API_BASE_URL}/company-contacts/${id}/`, {
      headers: { ...getAuthHeaders() },
    })
    return handleResponse<CompanyContact>(response)
  },

  create: async (data: Omit<CompanyContact, "id" | "company">): Promise<CompanyContact> => {
    const response = await fetch(`${API_BASE_URL}/company-contacts/`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...getAuthHeaders() },
      body: JSON.stringify(data),
    })
    return handleResponse<CompanyContact>(response)
  },

  update: async (id: number, data: Partial<Omit<CompanyContact, "id" | "company">>): Promise<CompanyContact> => {
    const response = await fetch(`${API_BASE_URL}/company-contacts/${id}/`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", ...getAuthHeaders() },
      body: JSON.stringify(data),
    })
    return handleResponse<CompanyContact>(response)
  },

  delete: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/company-contacts/${id}/`, {
      method: "DELETE",
      headers: { ...getAuthHeaders() },
    })
    return handleResponse<void>(response)
  },
}

// Documents API
export const documentsApi = {
  upload: async (file: File, docType: string, applicationId?: number): Promise<Document> => {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("doc_type", docType)
    if (applicationId) formData.append("application", String(applicationId))

    const response = await fetch(`${API_BASE_URL}/documents/upload/`, {
      method: "POST",
      headers: { ...getAuthHeaders() },
      body: formData,
    })
    return handleResponse<Document>(response)
  },
}

// Messages API
export const messagesApi = {
  list: async (limit = 50, offset = 0): Promise<PaginatedResponse<ChatMessage>> => {
    const response = await fetch(`${API_BASE_URL}/messages/?limit=${limit}&offset=${offset}`, {
      headers: { ...getAuthHeaders() },
    })
    return handleResponse<PaginatedResponse<ChatMessage>>(response)
  },

  getApplicationMessages: async (applicationId: number): Promise<ChatMessage[]> => {
    const response = await fetch(`${API_BASE_URL}/messages/application_messages/?application=${applicationId}`, {
      headers: { ...getAuthHeaders() },
    })
    return handleResponse<ChatMessage[]>(response)
  },

  send: async (text: string, applicationId?: number, attachment?: File): Promise<ChatMessage> => {
    const formData = new FormData()
    formData.append("text", text)
    if (applicationId) formData.append("application", String(applicationId))
    if (attachment) formData.append("attachment", attachment)

    const response = await fetch(`${API_BASE_URL}/messages/`, {
      method: "POST",
      headers: { ...getAuthHeaders() },
      body: formData,
    })
    return handleResponse<ChatMessage>(response)
  },

  markAsRead: async (id: number): Promise<ChatMessage> => {
    const response = await fetch(`${API_BASE_URL}/messages/${id}/mark_as_read/`, {
      method: "POST",
      headers: { ...getAuthHeaders() },
    })
    return handleResponse<ChatMessage>(response)
  },
}

// News API
export const newsApi = {
  list: async (): Promise<News[]> => {
    const response = await fetch(`${API_BASE_URL}/news/`, {
      headers: { ...getAuthHeaders() },
    })
    return handleResponse<News[]>(response)
  },

  get: async (id: number): Promise<News> => {
    const response = await fetch(`${API_BASE_URL}/news/${id}/`, {
      headers: { ...getAuthHeaders() },
    })
    return handleResponse<News>(response)
  },

  getLatest: async (): Promise<News[]> => {
    const response = await fetch(`${API_BASE_URL}/news/latest/`, {
      headers: { ...getAuthHeaders() },
    })
    return handleResponse<News[]>(response)
  },

  getCbr: async (): Promise<News[]> => {
    const response = await fetch(`${API_BASE_URL}/news/cbr/`, {
      headers: { ...getAuthHeaders() },
    })
    return handleResponse<News[]>(response)
  },
}
