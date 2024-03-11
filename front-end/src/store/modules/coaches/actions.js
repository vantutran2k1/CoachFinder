export default {
	async registerCoach(context, data) {
		const coachData = {
			first_name: data.first,
			last_name: data.last,
			description: data.desc,
			hourly_rate: data.rate,
			areas: data.areas
		};
		
		let response = await context.dispatch('sendRegisterCoachRequest', coachData);
		let responseData = await response.json();
		if (!response.ok) {
			if (response.status === 401) {
				await context.dispatch('auth/refreshToken', null, {root: true});
				
				response = await context.dispatch('sendRegisterCoachRequest', coachData);
				const retryResponseData = await response.json();
				responseData = retryResponseData;
				if (!response.ok) {
					throw new Error(retryResponseData['error'] || 'Failed to send request!');
				}
			} else {
				throw new Error(responseData['error'] || 'Failed to send request!');
			}
		}
	},
	async loadCoaches(context, payload) {
		if (!payload.forceRefresh && !context.getters.shouldUpdate) {
			return;
		}
		
		const coaches = [];
		const response = await fetch(`${process.env.VUE_APP_BACKEND_URL}/coaches`);
		const responseData = await response.json();
		
		if (!response.ok) {
			throw new Error(responseData['error'] || 'Failed to fetch!');
		}
		
		if ('data' in responseData) {
			for (const coachData of responseData['data']) {
				const coach = {
					id: coachData.id,
					firstName: coachData.first_name,
					lastName: coachData.last_name,
					description: coachData.description,
					hourlyRate: coachData.hourly_rate,
					email: coachData.email,
					areas: coachData.areas
				};
				
				coaches.push(coach);
			}
		}
		
		context.commit('setCoaches', coaches);
		context.commit('setFetchTimestamp');
	},
	async sendRegisterCoachRequest(context, requestPayload) {
		return await fetch(`${process.env.VUE_APP_BACKEND_URL}/coaches`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${context.rootGetters['auth/accessToken']}`
			},
			body: JSON.stringify(requestPayload)
		});
	}
};