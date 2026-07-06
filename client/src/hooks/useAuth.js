import { useCallback, useEffect, useMemo, useState } from "react";

const AUTH_TOKEN_KEY = "auth_token";

function getStoredToken() {
	return window.localStorage.getItem(AUTH_TOKEN_KEY);
}

function storeToken(token) {
	if (!token) return;
	window.localStorage.setItem(AUTH_TOKEN_KEY, token);
}

function clearStoredToken() {
	window.localStorage.removeItem(AUTH_TOKEN_KEY);
}

function resolveRole(payload) {
	if (!payload) return null;
	if (payload.role === "staff" || payload.staff_id != null) return "staff";
	if (payload.role === "student" || payload.student_id != null) return "student";
	return null;
}

export default function useAuth(roleRequired = null) {
	const [token, setToken] = useState(() => getStoredToken());
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const logout = useCallback(async () => {
		try {
			if (token) {
				await fetch("/api/logout", {
					method: "POST",
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});
			}
		} catch {
			// Ignore logout transport errors and clear local auth state anyway.
		} finally {
			clearStoredToken();
			setToken(null);
			setUser(null);
			setError(null);
		}
	}, [token]);

	const fetchMyInfo = useCallback(
		async (activeToken) => {
			if (!activeToken) {
				setUser(null);
				setLoading(false);
				return null;
			}

			setLoading(true);
			setError(null);

			try {
				const response = await fetch("/api/private/my-info", {
					headers: {
						Authorization: `Bearer ${activeToken}`,
					},
				});

				if (!response.ok) {
					throw new Error("Session is invalid or expired");
				}

				const data = await response.json();
				setUser(data);
				return data;
			} catch (err) {
				clearStoredToken();
				setToken(null);
				setUser(null);
				setError(err.message || "Unable to restore session");
				return null;
			} finally {
				setLoading(false);
			}
		},
		[],
	);

	const login = useCallback(
		async ({ email, password, userType }) => {
			setLoading(true);
			setError(null);

			try {
				const endpoint = userType === "staff" ? "/api/login/staff" : "/api/login/student";
				const response = await fetch(endpoint, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ email, password }),
				});

				const payload = await response.json();

				if (!response.ok) {
					throw new Error(payload?.error || "Login failed");
				}

				if (!payload?.token) {
					throw new Error("Login response missing auth token");
				}

				storeToken(payload.token);
				setToken(payload.token);
				setUser(payload);
				return { ok: true, data: payload };
			} catch (err) {
				clearStoredToken();
				setToken(null);
				setUser(null);
				setError(err.message || "Login failed");
				return { ok: false, error: err.message || "Login failed" };
			} finally {
				setLoading(false);
			}
		},
		[],
	);

	useEffect(() => {
		let isMounted = true;

		const restoreSession = async () => {
			if (!isMounted) return;
			await fetchMyInfo(token);
		};

		void restoreSession();

		return () => {
			isMounted = false;
		};
	}, [token, fetchMyInfo]);

	const role = useMemo(() => resolveRole(user), [user]);
	const isAuthenticated = !!token && !!user;
	const isAuthorized = !roleRequired || role === roleRequired;

	return {
		token,
		user,
		role,
		error,
		loading,
		isAuthenticated,
		isAuthorized,
		login,
		logout,
		refresh: () => fetchMyInfo(token),
	};
}