(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/lib/api.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
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
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    const token = localStorage.getItem("access_token");
    return token ? {
        Authorization: `Bearer ${token}`
    } : {};
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/auth-context.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthProvider",
    ()=>AuthProvider,
    "useAuth",
    ()=>useAuth
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
;
const AuthContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function AuthProvider({ children }) {
    _s();
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const refreshProfile = async ()=>{
        try {
            const profile = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["authApi"].getProfile();
            setUser(profile);
        } catch  {
            setUser(null);
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
        }
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AuthProvider.useEffect": ()=>{
            const initAuth = {
                "AuthProvider.useEffect.initAuth": async ()=>{
                    const token = localStorage.getItem("access_token");
                    if (token) {
                        await refreshProfile();
                    }
                    setIsLoading(false);
                }
            }["AuthProvider.useEffect.initAuth"];
            initAuth();
        }
    }["AuthProvider.useEffect"], []);
    const login = async (username, password)=>{
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["authApi"].login(username, password);
        localStorage.setItem("access_token", response.access);
        localStorage.setItem("refresh_token", response.refresh);
        const profile = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["authApi"].getProfile();
        setUser(profile);
        return profile.role;
    };
    const logout = ()=>{
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        setUser(null);
        router.push("/auth/login");
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AuthContext.Provider, {
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
_s(AuthProvider, "8WEfEbosx3NfLBPRVajZSQS3udc=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = AuthProvider;
function useAuth() {
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
_s1(useAuth, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
var _c;
__turbopack_context__.k.register(_c, "AuthProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ui/sonner.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Toaster",
    ()=>Toaster
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$themes$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next-themes/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/sonner/dist/index.mjs [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
const Toaster = ({ ...props })=>{
    _s();
    const { theme = 'system' } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$themes$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTheme"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Toaster"], {
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
_s(Toaster, "bbCbBsvL7+LiaR8ofHlkcwveh/Y=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$themes$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTheme"]
    ];
});
_c = Toaster;
;
var _c;
__turbopack_context__.k.register(_c, "Toaster");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_006562da._.js.map