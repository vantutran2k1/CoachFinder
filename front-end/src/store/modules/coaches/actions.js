export default {
	async registerCoach(context, data) {
		const coachData = {
			first_name: data.first,
			last_name: data.last,
			description: data.desc,
			hourly_rate: data.rate,
			areas: data.areas
		};
		
		await fetch('http://127.0.0.1:5000/coaches', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${context.rootGetters.accessToken}`
			},
			body: JSON.stringify(coachData)
		});
	},
	async loadCoaches(context, payload) {
		if (!payload.forceRefresh && !context.getters.shouldUpdate) {
			return;
		}
		
		const coaches = [];
		
		const response = await fetch('http://127.0.0.1:5000/coaches');
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
	}
};