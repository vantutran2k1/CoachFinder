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
		// if (!response.ok) {
		//
		// }
		
		context.commit('registerCoach', coachData);
	}
};