export default {
	requests(state) {
		return state.requests;
	},
	hasRequests(state, getters) {
		return getters.requests && getters.requests.length > 0;
	}
};