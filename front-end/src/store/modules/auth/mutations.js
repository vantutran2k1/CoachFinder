export default {
	setUser(state, payload) {
		state.userId = payload.userId || state.userId;
		state.accessToken = payload.accessToken || state.accessToken;
		state.refreshToken = payload.refreshToken || state.refreshToken;
		state.tokenExpiration = payload.tokenExpiration || state.tokenExpiration;
	}
};