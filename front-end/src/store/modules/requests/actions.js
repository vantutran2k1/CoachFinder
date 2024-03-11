export default {
	async contactCoach(context, payload) {
		const newRequest = {
			coach_id: payload.coachId,
			message: payload.message
		};
		
		let response = await context.dispatch('sendContactCoachRequest', newRequest);
		let responseData = await response.json();
		if (!response.ok) {
			if (response.status === 401) {
				await context.dispatch('auth/refreshToken', null, {root: true});
				
				response = await context.dispatch('sendContactCoachRequest', newRequest);
				const retryResponseData = await response.json();
				responseData = retryResponseData;
				if (!response.ok) {
					throw new Error(retryResponseData['error'] || 'Failed to send request!');
				}
			} else {
				throw new Error(responseData['error'] || 'Failed to send request!');
			}
		}
		
		await context.dispatch('fetchRequests');
	},
	async fetchRequests(context) {
		let response = await context.dispatch('sendFetchRequest');
		let responseData = await response.json();
		if (!response.ok) {
			if (response.status === 401) {
				await context.dispatch('auth/refreshToken', null, {root: true});
				
				response = await context.dispatch('sendFetchRequest');
				const retryResponseData = await response.json();
				responseData = retryResponseData;
				if (!response.ok) {
					throw new Error(retryResponseData['error'] || 'Failed to send request!');
				}
			} else {
				throw new Error(responseData['error'] || 'Failed to send request!');
			}
		}
		
		const requests = [];
		if ('data' in responseData) {
			for (const requestData of responseData['data']) {
				const request = {
					id: requestData.id,
					coachId: requestData.coach_id,
					userEmail: requestData.user_email,
					message: requestData.message
				};
				
				requests.push(request);
			}
		}
		
		context.commit('setRequests', requests);
	},
	async sendContactCoachRequest(context, requestPayload) {
		return await fetch(`${process.env.VUE_APP_BACKEND_URL}/requests`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${context.rootGetters['auth/accessToken']}`
			},
			body: JSON.stringify(requestPayload)
		});
	},
	async sendFetchRequest(context) {
		return await fetch(`${process.env.VUE_APP_BACKEND_URL}/requests`, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${context.rootGetters['auth/accessToken']}`
			},
		});
	}
};