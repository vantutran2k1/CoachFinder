import mutations from './mutations.js';
import actions from './actions.js';
import getters from './getters.js';

export default {
	state() {
		return {
			userId: 1
		};
	},
	mutations,
	actions,
	getters
};

