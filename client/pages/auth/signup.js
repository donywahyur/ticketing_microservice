import { useState } from "react";
import axios from "axios";

export default () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [errors, setErrors] = useState([]);

	const onSubmit = async (event) => {
		event.preventDefault();
		try {
			await axios.post("/api/users/signup", {
				email,
				password,
			});
		} catch (err) {
			setErrors(err.response.data.errors);
		}
	};

	return (
		<form>
			<h1>Sign Up</h1>
			<div className="form-group">
				<label>Email</label>
				<input
					className="form-control"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
				/>
			</div>
			<div className="form-group">
				<label>Password</label>
				<input
					className="form-control"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
				/>
			</div>

			{errors.length > 0 && (
				<div className="alert alert-danger">
					<h4>Oops</h4>
					<ul className="my-0">
						{errors.map((error) => (
							<li key={error.message}>{error.message}</li>
						))}
					</ul>
				</div>
			)}
			<button className="btn btn-primary" onClick={onSubmit}>
				Sign Up
			</button>
		</form>
	);
};
