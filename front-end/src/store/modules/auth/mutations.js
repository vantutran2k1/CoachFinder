export default {
	setUser(state, payload) {
		state.userId = payload.userId;
		state.accessToken = payload.accessToken;
		state.refreshToken = payload.refreshToken;
		state.tokenExpiration = payload.tokenExpiration;
	}
};