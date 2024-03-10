import mutations from './mutations.js';
import actions from './actions.js';
import getters from './getters.js';

export default {
	namespaced: true,
	state() {
		return {
			userId: null,
			accessToken: null,
			refreshToken: null,
			tokenExpiration: null
		};
	},
	mutations,
	actions,
	getters
};

