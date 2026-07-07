import { useState } from "react";
import useSaveAuth from "../hooks/useSaveAuth.js";

export default function LoginForm({ role }) {
	const saveAuthToken = useSaveAuth();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	async function handleSubmit(event) {
		event.preventDefault();
		setError("");

		const normalizedRole = (role ?? "").toLowerCase();
		const endpoint = normalizedRole === "staff" ? "/api/login/staff" : "/api/login/student";

		setIsSubmitting(true);
		try {
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
				throw new Error("No auth token returned from server");
			}

			saveAuthToken(payload.token);
		} catch (submitError) {
			setError(submitError.message || "Login failed");
		} finally {
			setIsSubmitting(false);
		}
	}

	return (
		<form onSubmit={handleSubmit}>
			<label>
				Email:
				<input
					type="email"
					name="email"
					value={email}
					onChange={(event) => setEmail(event.target.value)}
					required
				/>
			</label>
			<br />
			<label>
				Password:
				<input
					type="password"
					name="password"
					value={password}
					onChange={(event) => setPassword(event.target.value)}
					required
				/>
			</label>
			<br />
			<button type="submit" disabled={isSubmitting}>
				{isSubmitting ? "Logging in..." : "Login"}
			</button>
			{error ? <p>{error}</p> : null}
		</form>
	);
}