# LiderGarant Frontend - Copilot Instructions

## Architecture Overview

**ЛидерГарант** is a financial marketplace Next.js app for managing financing applications across three user roles: clients, agents, and banking partners.

### Core Stack
- **Next.js 16** (App Router) with TypeScript and Tailwind CSS
- **API Base**: `https://xushnudbek0808.pythonanywhere.com/api/v1`
- **Auth**: Token-based (access/refresh) stored in localStorage via `AuthProvider` context
- **UI Components**: shadcn/ui + Radix UI primitives with custom styling
- **Forms**: react-hook-form for validation and state management
- **Notifications**: Sonner toast library
- **Icons**: Lucide React

### Role-Based Dashboard Structure
Three distinct dashboard branches at `/dashboard/{role}`:
- **Client** (`/dashboard/client`): Manage applications, company profile, documents, wins, calculator, chat, news
- **Agent** (`/dashboard/agent`): Manage clients, create/approve applications, company settings, news
- **Partner** (`/dashboard/partner`): Bank/MFO dashboard for application review

Each role has identical UI patterns (sidebar + header) but different navigation menus and data permissions.

---

## Key Files Reference

| File | Purpose | Key Exports |
|------|---------|-------------|
| `lib/api.ts` | All API interactions with typed responses | `authApi`, `applicationsApi`, `companiesApi`, `companyManagementApi`, `companyFoundersApi`, `companyContactsApi`, `banksApi`, `documentsApi`, `messagesApi`, `newsApi` |
| `lib/auth-context.tsx` | Global auth state, role-based redirects | `AuthProvider`, `useAuth()` hook |
| `app/layout.tsx` | Root layout with theme provider and auth wrapper | Sets up `<AuthProvider>` + `<Toaster />` |
| `app/dashboard/[role]/layout.tsx` | Sidebar + header wrapper for each role | Dynamic sidebar based on user role |
| `components/dashboard/sidebar.tsx` | Role-specific navigation menus | `menuItems` Record mapping roles to page links |
| `app/auth/login/page.tsx` | Login with token storage and role redirect | Manual form state, `authApi.login()` |
| `app/auth/register/page.tsx` | Registration with role selection | Manual state, `authApi.register()` |

---

## Company Management APIs (Complete Reference)

### Main Company Data Endpoints

#### `companiesApi.getMyCompany()`
Fetch current user's company with all 8 data sections:

```typescript
// Returns full Company object with:
// - Basic info: name, short_name, full_name, inn, kpp, ogrn, okpo, okved, addresses, contact
// - Registration: registration_date, registration_authority, registration_number, certificate
// - Activity: activity_type, licenses (JSON array)
// - Management: management[] array of CompanyManagement objects
// - Founders: founders[] array of CompanyFounder objects
// - Bank details: bank_name, bank_bik, bank_account, correspondent_account
// - ETP accounts: etp_accounts (JSON array)
// - Contact persons: contact_persons[] array of CompanyContact objects
const company = await companiesApi.getMyCompany()
```

#### `companiesApi.updateMyCompany(data)`
Update any fields of current user's company:

```typescript
await companiesApi.updateMyCompany({
  name: "ООО Пример",
  inn: "1234567890",
  kpp: "123456789",
  phone: "+7 (999) 123-45-67",
  email: "info@example.com",
  website: "https://example.com"
})
```

### Management (Form 4) - Руководство

#### `companyManagementApi.list()`
Fetch all management members for current user's company:
```typescript
const managers = await companyManagementApi.list() // CompanyManagement[]
```

#### `companyManagementApi.create(data)`
Add new management member:
```typescript
await companyManagementApi.create({
  position: "Генеральный директор",
  full_name: "Иванов Иван Иванович",
  phone: "+7 (999) 123-45-67",
  email: "director@example.com",
  passport_series: "1234",
  passport_number: "567890",
  passport_issued_by: "УФМС России",
  passport_issued_date: "2010-01-01"
})
```

#### `companyManagementApi.update(id, data)` / `delete(id)`
Update or remove a manager by ID

### Founders (Form 5) - Учредители

#### `companyFoundersApi.create(data)`
Add founder (individual):
```typescript
await companyFoundersApi.create({
  founder_type: "individual",
  full_name: "Петров Петр Петрович",
  inn: "123456789012",
  share_percentage: 50.00,
  share_amount: 1000000.00,
  passport_series: "5678",
  passport_number: "901234",
  passport_issued_by: "УФМС России",
  passport_issued_date: "2015-01-01",
  address: "г. Москва, ул. Примерная, д. 2"
})
```

Add founder (legal entity):
```typescript
await companyFoundersApi.create({
  founder_type: "legal",
  company_name: "ООО Учредитель",
  inn: "9876543210",
  share_percentage: 50.00,
  share_amount: 1000000.00
})
```

#### `companyFoundersApi.list()` / `update(id, data)` / `delete(id)`
List, update, or remove founders

### Contact Persons (Form 8) - Контактные лица

#### `companyContactsApi.create(data)`
Add contact person:
```typescript
await companyContactsApi.create({
  full_name: "Сидоров Сидор Сидорович",
  position: "Менеджер по работе с клиентами",
  phone: "+7 (999) 987-65-43",
  email: "contact@example.com",
  is_main_contact: true
})
```

#### `companyContactsApi.list()` / `update(id, data)` / `delete(id)`
List, update, or remove contact persons

---

## Form Patterns & Conventions

### Using React Hook Form (Dashboard Pages)
```typescript
"use client"
import { useForm } from "react-hook-form"
import { useAuth } from "@/lib/auth-context"
import { companiesApi } from "@/lib/api"
import { toast } from "sonner"

export default function MyPage() {
  const { user } = useAuth()
  const [isSaving, setIsSaving] = useState(false)
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: {
      name: "",
      email: ""
    }
  })

  const onSubmit = async (data) => {
    try {
      setIsSaving(true)
      await companiesApi.updateMyCompany(data)
      toast.success("Данные сохранены")
      reset(data)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Ошибка сохранения")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Название</Label>
        <Input
          id="name"
          {...register("name", { required: "Название обязательно" })}
          className="bg-background border-border text-foreground"
        />
        {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
      </div>
      <Button type="submit" disabled={isSaving}>Сохранить</Button>
    </form>
  )
}
```

### Validation Rules
- Email: `pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: "Неверный формат email" }`
- Required: `required: "Поле обязательно"`
- Inline error display below each field: `{errors.fieldName && <p className="text-sm text-destructive">{errors.fieldName.message}</p>}`

### Managing Collections (Management/Founders/Contacts)
```typescript
const [items, setItems] = useState<CompanyManagement[]>([])
const [isAdding, setIsAdding] = useState(false)

useEffect(() => {
  const fetch = async () => {
    const data = await companyManagementApi.list()
    setItems(data)
  }
  fetch()
}, [])

const handleAdd = async (formData) => {
  try {
    setIsAdding(true)
    const newItem = await companyManagementApi.create(formData)
    setItems([...items, newItem])
    toast.success("Добавлено")
    reset()
  } catch (error) {
    toast.error(error.message)
  } finally {
    setIsAdding(false)
  }
}

const handleDelete = async (id) => {
  try {
    await companyManagementApi.delete(id)
    setItems(items.filter(item => item.id !== id))
    toast.success("Удалено")
  } catch (error) {
    toast.error(error.message)
  }
}
```

---

## API Client Pattern & Error Handling

### Standard Endpoint Structure
All API methods follow this pattern:
```typescript
export const exampleApi = {
  list: async (): Promise<Type[]> => {
    const response = await fetch(`${API_BASE_URL}/endpoint/`, {
      headers: { ...getAuthHeaders() }
    })
    return handleResponse<Type[]>(response)
  },
  
  create: async (data: CreatePayload): Promise<Type> => {
    const response = await fetch(`${API_BASE_URL}/endpoint/`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...getAuthHeaders() },
      body: JSON.stringify(data)
    })
    return handleResponse<Type>(response)
  }
}
```

### Bearer Token Injection
The `getAuthHeaders()` function automatically adds `Authorization: Bearer <token>` from localStorage:
```typescript
function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem("access_token")
  return token ? { Authorization: `Bearer ${token}` } : {}
}
```

### Error Handling
- API errors throw `ApiError(status, message)` caught in try/catch
- Display user-facing messages with `toast.error(message)` from sonner
- Fallback message if response lacks error details: "Произошла ошибка"
- Don't expose sensitive data in error messages

```typescript
try {
  const data = await companiesApi.getMyCompany()
} catch (error) {
  if (error instanceof Error) {
    toast.error(error.message) // API error message or fallback
  }
}
```

---

## Authentication Flow

### Login
```typescript
const { login } = useAuth()
const role = await login("username", "password")
// Tokens stored in localStorage, user profile fetched and stored
// Router redirects to /dashboard/{role}
```

### Protected Routes
Currently no middleware guards - manually check `useAuth()` in pages:
```typescript
const { user, isLoading } = useAuth()
if (isLoading) return <Spinner />
if (!user) return null // Will redirect on next render via AuthProvider
```

### Role Routing
After login, user is redirected based on their role:
- Client → `/dashboard/client`
- Agent → `/dashboard/agent`
- Partner → `/dashboard/partner`

The sidebar navigation (from `components/dashboard/sidebar.tsx`) displays role-specific menu items.

---

## Styling & Theme

### CSS Variables
Tailwind uses CSS variable-based theming (neutral base color):
- `bg-background`, `border-border`, `text-foreground` - main palette
- `text-destructive` - error/alert color
- `text-muted-foreground` - secondary text
- `bg-primary`, `text-primary-foreground` - action buttons

### Always Apply to Form Inputs
```tsx
<Input className="bg-background border-border text-foreground" />
<Textarea className="bg-background border-border text-foreground" />
<Select>
  <SelectTrigger className="bg-background border-border text-foreground" />
</Select>
```

### Icons
Use Lucide React (`lucide-react`) - all icons available:
```tsx
import { Building2, Users, Settings, Save, Loader2 } from "lucide-react"
```

---

## Common Development Tasks

### Add New Company Info Tab
1. Update `Company` interface in `lib/api.ts` with new fields
2. Add form fields using `register()` in company page component
3. Map API response fields to form defaults in `reset()`
4. Call `companiesApi.updateMyCompany()` on submit

### Create List with Add/Edit/Delete
1. Fetch items with `useEffect` + API list method
2. Create modal/form with `useForm` for input
3. Call `api.create()` on submit → update local state
4. Provide delete button → call `api.delete(id)` → filter from state
5. Show `toast.success()` or `toast.error()` for feedback

### Add New Page to Dashboard
1. Create file: `app/dashboard/{role}/{section}/page.tsx`
2. Add menu item to `menuItems[role]` in `components/dashboard/sidebar.tsx`
3. Fetch data in `useEffect`, handle loading/error states
4. Build UI with Card/Table/Form components from `components/ui/`

### Handle Missing/Null Data
```typescript
const displayValue = data.field || "—"
// or
{data.field ? data.field : "—"}
```

---

## JSON Fields (Special Handling)

### Licenses (Form 3)
Stored as JSON array, example structure:
```json
[
  {
    "license_number": "12345",
    "license_type": "Лицензия на строительство",
    "issued_date": "2020-01-01",
    "expiry_date": "2025-01-01",
    "issued_by": "Ростехнадзор"
  }
]
```

### ETP Accounts (Form 7)
Stored as JSON array, example structure:
```json
[
  {
    "platform_name": "Сбербанк-АСТ",
    "account_number": "12345678901234567890",
    "bik": "044525225"
  }
]
```

For editing JSON fields, either:
- Store as stringified JSON in textarea + `JSON.parse()` on submit
- Create separate CRUD endpoints (not yet implemented)

---

## Build & Run Commands

```bash
pnpm dev      # Start dev server (http://localhost:3000)
pnpm build    # TypeScript + Next.js build (ignores TS errors)
pnpm lint     # ESLint check
pnpm start    # Production server
```

---

## Language & Localization
- **Primary language**: Russian
- All UI text, labels, validation messages, placeholders in Russian
- Date format: ISO strings from API (format with `date-fns` if display needed)
- Some legacy Uzbek fallback messages in auth errors (maintain consistency with Russian)

---

## Notes for Implementation

- TypeScript strict mode enabled in `tsconfig.json`
- Next.js configured to ignore build-time TS errors (check at runtime)
- Images unoptimized (development setting in `next.config.mjs`)
- API URL hardcoded (no environment file setup documented yet)
- Recommend adding `.env.local` in future for flexible API_BASE_URL
