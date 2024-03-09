export default {
	async contactCoach(context, payload) {
		const newRequest = {
			coach_id: payload.coachId,
			user_email: payload.email,
			message: payload.message
		};
		
		const response = await fetch('http://127.0.0.1:5000/requests', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(newRequest)
		});
		const responseData = await response.json();
		
		if (!response.ok) {
			throw new Error(responseData.message || 'Failed to send requests!');
		}
		
		context.commit('addRequest', newRequest);
	},
	async fetchRequests(context) {
		const coachId = context.rootGetters.userId;
		const response = await fetch(`http://127.0.0.1:5000/requests?coach_id=${coachId}`);
		const responseData = await response.json();
		
		if (!response.ok) {
			throw new Error(responseData['error'] || 'Failed to fetch requests!');
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
	}
};