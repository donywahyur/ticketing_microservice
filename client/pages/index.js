import axios from "axios";
import useRequest from "../hooks/use-request";
import buildClient from "../api/build-client";

const LandingPage = ({ currentUser }) => {
	return currentUser ? (
		<h1>you are signed in</h1>
	) : (
		<h1>you are not signed in</h1>
	);
};

LandingPage.getInitialProps = async (context) => {
	const client = buildClient(context);
	try {
		const { data } = await client.get("/api/users/currentuser");
		return data;
	} catch (error) {
		console.error("Error fetching current user:", error);
		return { currentUser: null }; // or return a default shape
	}
};

export default LandingPage;
