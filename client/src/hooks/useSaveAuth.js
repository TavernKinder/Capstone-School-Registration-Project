const AUTH_TOKEN_KEY = "auth_token";

export default function useSaveAuth() {
	return function saveAuthToken(token) {
		document.cookie = `${AUTH_TOKEN_KEY}=${encodeURIComponent(token)}; path=/; SameSite=Lax`;
	};
}
