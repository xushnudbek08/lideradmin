module.exports = [
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[project]/lib/api.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "applicationsApi",
    ()=>applicationsApi,
    "authApi",
    ()=>authApi,
    "banksApi",
    ()=>banksApi,
    "companiesApi",
    ()=>companiesApi,
    "companyContactsApi",
    ()=>companyContactsApi,
    "companyFoundersApi",
    ()=>companyFoundersApi,
    "companyManagementApi",
    ()=>companyManagementApi,
    "documentsApi",
    ()=>documentsApi,
    "messagesApi",
    ()=>messagesApi,
    "newsApi",
    ()=>newsApi
]);
const API_BASE_URL = "https://xushnudbek0808.pythonanywhere.com/api/v1";
// Helper to get auth headers
function getAuthHeaders() {
    if ("TURBOPACK compile-time truthy", 1) return {};
    //TURBOPACK unreachable
    ;
    const token = undefined;
}
// API Error handler
class ApiError extends Error {
    status;
    constructor(status, message){
        super(message), this.status = status;
        this.name = "ApiError";
    }
}
async function handleResponse(response) {
    if (!response.ok) {
        const errorData = await response.json().catch(()=>({}));
        const message = errorData.detail || errorData.message || Object.values(errorData).flat().join(", ") || "Произошла ошибка";
        throw new ApiError(response.status, message);
    }
    if (response.status === 204) return {};
    return response.json();
}
const authApi = {
    login: async (username, password)=>{
        const response = await fetch(`${API_BASE_URL}/auth/login/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username,
                password
            })
        });
        return handleResponse(response);
    },
    register: async (data)=>{
        const response = await fetch(`${API_BASE_URL}/auth/register/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });
        return handleResponse(response);
    },
    refreshToken: async (refresh)=>{
        const response = await fetch(`${API_BASE_URL}/auth/refresh/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                refresh
            })
        });
        return handleResponse(response);
    },
    getProfile: async ()=>{
        const response = await fetch(`${API_BASE_URL}/auth/profile/`, {
            headers: {
                ...getAuthHeaders()
            }
        });
        return handleResponse(response);
    },
    updateProfile: async (data)=>{
        const response = await fetch(`${API_BASE_URL}/auth/profile/`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                ...getAuthHeaders()
            },
            body: JSON.stringify(data)
        });
        return handleResponse(response);
    }
};
const applicationsApi = {
    list: async (limit = 10, offset = 0)=>{
        const response = await fetch(`${API_BASE_URL}/applications/?limit=${limit}&offset=${offset}`, {
            headers: {
                ...getAuthHeaders()
            }
        });
        return handleResponse(response);
    },
    get: async (id)=>{
        const response = await fetch(`${API_BASE_URL}/applications/${id}/`, {
            headers: {
                ...getAuthHeaders()
            }
        });
        return handleResponse(response);
    },
    create: async (data)=>{
        const response = await fetch(`${API_BASE_URL}/applications/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...getAuthHeaders()
            },
            body: JSON.stringify(data)
        });
        return handleResponse(response);
    },
    update: async (id, data)=>{
        const response = await fetch(`${API_BASE_URL}/applications/${id}/`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                ...getAuthHeaders()
            },
            body: JSON.stringify(data)
        });
        return handleResponse(response);
    },
    delete: async (id)=>{
        const response = await fetch(`${API_BASE_URL}/applications/${id}/`, {
            method: "DELETE",
            headers: {
                ...getAuthHeaders()
            }
        });
        return handleResponse(response);
    },
    submit: async (id)=>{
        const response = await fetch(`${API_BASE_URL}/applications/${id}/submit/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...getAuthHeaders()
            },
            body: JSON.stringify({})
        });
        return handleResponse(response);
    },
    approve: async (id)=>{
        const response = await fetch(`${API_BASE_URL}/applications/${id}/approve/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...getAuthHeaders()
            },
            body: JSON.stringify({})
        });
        return handleResponse(response);
    },
    reject: async (id)=>{
        const response = await fetch(`${API_BASE_URL}/applications/${id}/reject/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...getAuthHeaders()
            },
            body: JSON.stringify({})
        });
        return handleResponse(response);
    },
    getMyApplications: async ()=>{
        const response = await fetch(`${API_BASE_URL}/applications/my_applications/`, {
            headers: {
                ...getAuthHeaders()
            }
        });
        return handleResponse(response);
    },
    getMyWins: async ()=>{
        const response = await fetch(`${API_BASE_URL}/applications/my_wins/`, {
            headers: {
                ...getAuthHeaders()
            }
        });
        return handleResponse(response);
    },
    getAgents: async ()=>{
        const response = await fetch(`${API_BASE_URL}/applications/agents/`, {
            headers: {
                ...getAuthHeaders()
            }
        });
        return handleResponse(response);
    },
    getClients: async ()=>{
        const response = await fetch(`${API_BASE_URL}/applications/clients/`, {
            headers: {
                ...getAuthHeaders()
            }
        });
        return handleResponse(response);
    }
};
const banksApi = {
    list: async (limit = 100, offset = 0)=>{
        const response = await fetch(`${API_BASE_URL}/banks/?limit=${limit}&offset=${offset}`, {
            headers: {
                ...getAuthHeaders()
            }
        });
        return handleResponse(response);
    },
    get: async (id)=>{
        const response = await fetch(`${API_BASE_URL}/banks/${id}/`, {
            headers: {
                ...getAuthHeaders()
            }
        });
        return handleResponse(response);
    }
};
const companiesApi = {
    list: async (limit = 100, offset = 0)=>{
        const response = await fetch(`${API_BASE_URL}/companies/?limit=${limit}&offset=${offset}`, {
            headers: {
                ...getAuthHeaders()
            }
        });
        return handleResponse(response);
    },
    get: async (id)=>{
        const response = await fetch(`${API_BASE_URL}/companies/${id}/`, {
            headers: {
                ...getAuthHeaders()
            }
        });
        return handleResponse(response);
    },
    getMyCompany: async ()=>{
        const response = await fetch(`${API_BASE_URL}/companies/my_company/`, {
            headers: {
                ...getAuthHeaders()
            }
        });
        return handleResponse(response);
    },
    create: async (data)=>{
        const response = await fetch(`${API_BASE_URL}/companies/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...getAuthHeaders()
            },
            body: JSON.stringify(data)
        });
        return handleResponse(response);
    },
    update: async (id, data)=>{
        const response = await fetch(`${API_BASE_URL}/companies/${id}/`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                ...getAuthHeaders()
            },
            body: JSON.stringify(data)
        });
        return handleResponse(response);
    },
    updateMyCompany: async (data)=>{
        const response = await fetch(`${API_BASE_URL}/companies/my_company/`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                ...getAuthHeaders()
            },
            body: JSON.stringify(data)
        });
        return handleResponse(response);
    }
};
const companyManagementApi = {
    list: async ()=>{
        const response = await fetch(`${API_BASE_URL}/company-management/`, {
            headers: {
                ...getAuthHeaders()
            }
        });
        return handleResponse(response);
    },
    get: async (id)=>{
        const response = await fetch(`${API_BASE_URL}/company-management/${id}/`, {
            headers: {
                ...getAuthHeaders()
            }
        });
        return handleResponse(response);
    },
    create: async (data)=>{
        const response = await fetch(`${API_BASE_URL}/company-management/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...getAuthHeaders()
            },
            body: JSON.stringify(data)
        });
        return handleResponse(response);
    },
    update: async (id, data)=>{
        const response = await fetch(`${API_BASE_URL}/company-management/${id}/`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                ...getAuthHeaders()
            },
            body: JSON.stringify(data)
        });
        return handleResponse(response);
    },
    delete: async (id)=>{
        const response = await fetch(`${API_BASE_URL}/company-management/${id}/`, {
            method: "DELETE",
            headers: {
                ...getAuthHeaders()
            }
        });
        return handleResponse(response);
    }
};
const companyFoundersApi = {
    list: async ()=>{
        const response = await fetch(`${API_BASE_URL}/company-founders/`, {
            headers: {
                ...getAuthHeaders()
            }
        });
        return handleResponse(response);
    },
    get: async (id)=>{
        const response = await fetch(`${API_BASE_URL}/company-founders/${id}/`, {
            headers: {
                ...getAuthHeaders()
            }
        });
        return handleResponse(response);
    },
    create: async (data)=>{
        const response = await fetch(`${API_BASE_URL}/company-founders/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...getAuthHeaders()
            },
            body: JSON.stringify(data)
        });
        return handleResponse(response);
    },
    update: async (id, data)=>{
        const response = await fetch(`${API_BASE_URL}/company-founders/${id}/`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                ...getAuthHeaders()
            },
            body: JSON.stringify(data)
        });
        return handleResponse(response);
    },
    delete: async (id)=>{
        const response = await fetch(`${API_BASE_URL}/company-founders/${id}/`, {
            method: "DELETE",
            headers: {
                ...getAuthHeaders()
            }
        });
        return handleResponse(response);
    }
};
const companyContactsApi = {
    list: async ()=>{
        const response = await fetch(`${API_BASE_URL}/company-contacts/`, {
            headers: {
                ...getAuthHeaders()
            }
        });
        return handleResponse(response);
    },
    get: async (id)=>{
        const response = await fetch(`${API_BASE_URL}/company-contacts/${id}/`, {
            headers: {
                ...getAuthHeaders()
            }
        });
        return handleResponse(response);
    },
    create: async (data)=>{
        const response = await fetch(`${API_BASE_URL}/company-contacts/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...getAuthHeaders()
            },
            body: JSON.stringify(data)
        });
        return handleResponse(response);
    },
    update: async (id, data)=>{
        const response = await fetch(`${API_BASE_URL}/company-contacts/${id}/`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                ...getAuthHeaders()
            },
            body: JSON.stringify(data)
        });
        return handleResponse(response);
    },
    delete: async (id)=>{
        const response = await fetch(`${API_BASE_URL}/company-contacts/${id}/`, {
            method: "DELETE",
            headers: {
                ...getAuthHeaders()
            }
        });
        return handleResponse(response);
    }
};
const documentsApi = {
    upload: async (file, docType, applicationId)=>{
        const formData = new FormData();
        formData.append("file", file);
        formData.append("doc_type", docType);
        if (applicationId) formData.append("application", String(applicationId));
        const response = await fetch(`${API_BASE_URL}/documents/upload/`, {
            method: "POST",
            headers: {
                ...getAuthHeaders()
            },
            body: formData
        });
        return handleResponse(response);
    }
};
const messagesApi = {
    list: async (limit = 50, offset = 0)=>{
        const response = await fetch(`${API_BASE_URL}/messages/?limit=${limit}&offset=${offset}`, {
            headers: {
                ...getAuthHeaders()
            }
        });
        return handleResponse(response);
    },
    getApplicationMessages: async (applicationId)=>{
        const response = await fetch(`${API_BASE_URL}/messages/application_messages/?application=${applicationId}`, {
            headers: {
                ...getAuthHeaders()
            }
        });
        return handleResponse(response);
    },
    send: async (text, applicationId, attachment)=>{
        const formData = new FormData();
        formData.append("text", text);
        if (applicationId) formData.append("application", String(applicationId));
        if (attachment) formData.append("attachment", attachment);
        const response = await fetch(`${API_BASE_URL}/messages/`, {
            method: "POST",
            headers: {
                ...getAuthHeaders()
            },
            body: formData
        });
        return handleResponse(response);
    },
    markAsRead: async (id)=>{
        const response = await fetch(`${API_BASE_URL}/messages/${id}/mark_as_read/`, {
            method: "POST",
            headers: {
                ...getAuthHeaders()
            }
        });
        return handleResponse(response);
    }
};
const newsApi = {
    list: async ()=>{
        const response = await fetch(`${API_BASE_URL}/news/`, {
            headers: {
                ...getAuthHeaders()
            }
        });
        return handleResponse(response);
    },
    get: async (id)=>{
        const response = await fetch(`${API_BASE_URL}/news/${id}/`, {
            headers: {
                ...getAuthHeaders()
            }
        });
        return handleResponse(response);
    },
    getLatest: async ()=>{
        const response = await fetch(`${API_BASE_URL}/news/latest/`, {
            headers: {
                ...getAuthHeaders()
            }
        });
        return handleResponse(response);
    },
    getCbr: async ()=>{
        const response = await fetch(`${API_BASE_URL}/news/cbr/`, {
            headers: {
                ...getAuthHeaders()
            }
        });
        return handleResponse(response);
    }
};
}),
"[project]/lib/auth-context.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthProvider",
    ()=>AuthProvider,
    "useAuth",
    ()=>useAuth
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
const AuthContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function AuthProvider({ children }) {
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const refreshProfile = async ()=>{
        try {
            const profile = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["authApi"].getProfile();
            setUser(profile);
        } catch  {
            setUser(null);
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
        }
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const initAuth = async ()=>{
            const token = localStorage.getItem("access_token");
            if (token) {
                await refreshProfile();
            }
            setIsLoading(false);
        };
        initAuth();
    }, []);
    const login = async (username, password)=>{
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["authApi"].login(username, password);
        localStorage.setItem("access_token", response.access);
        localStorage.setItem("refresh_token", response.refresh);
        const profile = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["authApi"].getProfile();
        setUser(profile);
        return profile.role;
    };
    const logout = ()=>{
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        setUser(null);
        router.push("/auth/login");
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(AuthContext.Provider, {
        value: {
            user,
            isLoading,
            isAuthenticated: !!user,
            login,
            logout,
            refreshProfile
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/lib/auth-context.tsx",
        lineNumber: 64,
        columnNumber: 5
    }, this);
}
function useAuth() {
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
}),
"[project]/components/ui/sonner.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Toaster",
    ()=>Toaster
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$themes$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next-themes/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/sonner/dist/index.mjs [app-ssr] (ecmascript)");
'use client';
;
;
;
const Toaster = ({ ...props })=>{
    const { theme = 'system' } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$themes$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useTheme"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Toaster"], {
        theme: theme,
        className: "toaster group",
        style: {
            '--normal-bg': 'var(--popover)',
            '--normal-text': 'var(--popover-foreground)',
            '--normal-border': 'var(--border)'
        },
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/sonner.tsx",
        lineNumber: 10,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/dynamic-access-async-storage.external.js [external] (next/dist/server/app-render/dynamic-access-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/dynamic-access-async-storage.external.js", () => require("next/dist/server/app-render/dynamic-access-async-storage.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__6687b7a5._.js.map