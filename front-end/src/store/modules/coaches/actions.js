export default {
	async registerCoach(context, data) {
		const coachData = {
			first_name: data.first,
			last_name: data.last,
			description: data.desc,
			hourly_rate: data.rate,
			email: data.email,
			areas: data.areas
		};
		
		await fetch('http://127.0.0.1:5000/coaches', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(coachData)
		});
	},
	async loadCoaches(context) {
		const coaches = [];
		
		const response = await fetch('http://127.0.0.1:5000/coaches');
		const responseData = await response.json();
		if ('data' in responseData) {
			console.log(responseData['data'].length);
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
	}
};