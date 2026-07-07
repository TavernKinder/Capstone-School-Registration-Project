const AUTH_TOKEN_KEY = "auth_token";

function readCookieValue(key) {
	if (typeof document === "undefined") return null;

	const cookies = document.cookie ? document.cookie.split("; ") : [];
	const prefix = `${key}=`;
	const cookie = cookies.find((entry) => entry.startsWith(prefix));

	if (!cookie) return null;

	const rawValue = cookie.slice(prefix.length);
	return decodeURIComponent(rawValue);
}

function decodeJwtPayload(token) {
	if (!token) return null;

	const segments = token.split(".");
	if (segments.length < 2) return null;

	try {
		const base64 = segments[1].replace(/-/g, "+").replace(/_/g, "/");
		const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
		const json = atob(padded);
		return JSON.parse(json);
	} catch {
		return null;
	}
}

export default function useReadAuthKeyAndRole(requiredRole = null) {
	const token = readCookieValue(AUTH_TOKEN_KEY);
	const payload = decodeJwtPayload(token);
	const role = payload?.role ?? null;
	const roleMatches = requiredRole ? role === requiredRole : true;

	return {
		token,
		role,
		roleMatches,
		isAuthenticated: Boolean(token),
	};
}