(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push(["chunks/[root-of-the-server]__e07e566a._.js", {

"[externals]/node:buffer [external] (node:buffer, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("node:buffer", () => require("node:buffer"));

module.exports = mod;
}}),
"[externals]/node:async_hooks [external] (node:async_hooks, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("node:async_hooks", () => require("node:async_hooks"));

module.exports = mod;
}}),
"[project]/src/middleware.js [middleware-edge] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "config": (()=>config),
    "middleware": (()=>middleware)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$api$2f$server$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/next/dist/esm/api/server.js [middleware-edge] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/esm/server/web/spec-extension/response.js [middleware-edge] (ecmascript)");
;
function middleware(request) {
    console.log('Middleware exécuté pour:', request.nextUrl.pathname);
    // Selon les souhaits du client, les routes "/services" et "/dashboard" doivent être accessibles sans authentification
    // Seules les routes "/orders" et "/profile" doivent être protégées
    // Cependant, le tableau de bord administrateur doit être réservé aux administrateurs
    // Vérifier si l'URL demandée commence par /dashboard/admin
    // Cette route sera réservée aux administrateurs
    if (request.nextUrl.pathname.startsWith('/dashboard/admin')) {
        // Vérifier l'authentification via les cookies ou localStorage
        const token = request.cookies.get('token')?.value || request.headers.get('authorization')?.split(' ')[1];
        // Si pas de token, rediriger vers la page de connexion admin
        if (!token) {
            console.log('Pas de token, redirection vers /admin/login');
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL('/admin/login', request.url));
        }
        // Vérifier le rôle via les cookies
        const userCookie = request.cookies.get('user')?.value;
        if (userCookie) {
            try {
                const userData = JSON.parse(userCookie);
                if (userData.role !== 'admin') {
                    console.log('Utilisateur non admin, redirection vers /admin/login');
                    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL('/admin/login', request.url));
                }
            } catch (error) {
                console.log('Erreur parsing user cookie, redirection vers /admin/login');
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL('/admin/login', request.url));
            }
        }
    }
    // Vérifier si l'URL demandée commence par /orders ou /profile
    // Ces routes sont protégées pour tous les utilisateurs connectés
    if (request.nextUrl.pathname.startsWith('/orders') || request.nextUrl.pathname.startsWith('/profile')) {
        const token = request.cookies.get('token')?.value || request.headers.get('authorization')?.split(' ')[1];
        // Si pas de token, rediriger vers la page de connexion
        if (!token) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL('/auth/login', request.url));
        }
    }
    // Continuer la requête normalement pour toutes les autres routes
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next();
}
const config = {
    matcher: [
        '/dashboard/admin/:path*',
        '/orders/:path*',
        '/profile/:path*'
    ]
};
}}),
}]);

//# sourceMappingURL=%5Broot-of-the-server%5D__e07e566a._.js.map