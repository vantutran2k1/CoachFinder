export default {
	coaches(state) {
		return state.coaches;
	},
	hasCoaches(state) {
		return state.coaches && state.coaches.length > 0;
	},
	isCoach(state, getters, rootState, rootGetters) {
		const coaches = getters.coaches;
		const email = rootGetters['auth/email'];
		return coaches.some(coach => coach.email === email);
	},
	shouldUpdate(state) {
		const lastFetch = state.lastFetch;
		if (!lastFetch) {
			return true;
		}
		
		const currentTimestamp = new Date().getTime();
		return (currentTimestamp - lastFetch) / 1000 > 60;
	}
};