export default {
	userId(state) {
		return state.userId;
	},
	email(state) {
		return state.email;
	},
	accessToken(state) {
		return state.accessToken;
	},
	refreshToken(state) {
		return state.refreshToken;
	},
	isAuthenticated(state) {
		return !!state.accessToken;
	}
};