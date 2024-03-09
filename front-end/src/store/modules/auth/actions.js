export default {
	async login(context, payload) {
		const response = await fetch('http://127.0.0.1:5000/login', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				email: payload.email,
				password: payload.password
			})
		});
		const responseData = await response.json();
		
		if (!response.ok) {
			throw new Error(responseData['error'] || 'Failed to login!');
		}
		
		if ('data' in responseData) {
			context.commit('setUser', {
				userId: responseData['data'].id,
				token: responseData['data'].access_token,
				tokenExpiration: responseData['data'].expiration_time
			});
		}
	},
	async signup(context, payload) {
		const response = await fetch('http://127.0.0.1:5000/signup', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				email: payload.email,
				password: payload.password
			})
		});
		const responseData = await response.json();
		
		if (!response.ok) {
			throw new Error(responseData['error'] || 'Failed to signup!');
		}
		
		if ('data' in responseData) {
			context.commit('setUser', {
				userId: responseData['data'].id,
				token: responseData['data'].access_token,
				tokenExpiration: responseData['data'].expiration_time
			});
		}
	}
};