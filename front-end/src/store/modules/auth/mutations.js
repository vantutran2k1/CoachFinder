export default {
	setUser(state, payload) {
		state.userId = payload.userId || state.userId;
		state.email = payload.email || state.email;
		state.accessToken = payload.accessToken || state.accessToken;
		state.refreshToken = payload.refreshToken || state.refreshToken;
		state.tokenExpiration = payload.tokenExpiration || state.tokenExpiration;
	},
	logoutUser(state) {
		state.userId = null;
		state.email = null;
		state.accessToken = null;
		state.refreshToken = null;
		state.tokenExpiration = null;
	}
};