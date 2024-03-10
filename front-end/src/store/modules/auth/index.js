import mutations from './mutations.js';
import actions from './actions.js';
import getters from './getters.js';

export default {
	namespaced: true,
	state() {
		return {
			userId: null,
			email: null,
			accessToken: null,
			refreshToken: null,
			didAutoLogout: false
		};
	},
	mutations,
	actions,
	getters
};

