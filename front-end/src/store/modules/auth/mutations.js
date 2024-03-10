export default {
	setUser(state, payload) {
		state.userId = payload.userId || state.userId;
		state.email = payload.email || state.email;
		state.accessToken = payload.accessToken || state.accessToken;
		state.refreshToken = payload.refreshToken || state.refreshToken;
		
		state.didAutoLogout = false;
	},
	logoutUser(state) {
		state.userId = null;
		state.email = null;
		state.accessToken = null;
		state.refreshToken = null;
		
		state.didAutoLogout = false;
	},
	setAutoLogout(state) {
		state.didAutoLogout = true;
	}
};