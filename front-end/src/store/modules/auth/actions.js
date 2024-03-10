export default {
	async login(context, payload) {
		const response = await fetch('http://127.0.0.1:5000/auth/login', {
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
				userId: responseData['data'].user_id,
				email: responseData['data'].email,
				accessToken: responseData['data'].access_token,
				refreshToken: responseData['data'].refresh_token,
				tokenExpiration: responseData['data'].token_expiration
			});
		}
	},
	async signup(context, payload) {
		const response = await fetch('http://127.0.0.1:5000/auth/signup', {
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
	},
	async refreshToken(context) {
		const response = await fetch('http://127.0.0.1:5000/auth/refresh', {
			method: 'POST',
			headers: {
				'Authorization': `Bearer ${context.getters.refreshToken}`
			}
		});
		const responseData = await response.json();
		
		if (!response.ok) {
			throw new Error(responseData['msg'] || 'Failed to get new token!');
		}
		
		if ('data' in responseData) {
			context.commit('setUser', {
				accessToken: responseData['data'].access_token,
				tokenExpiration: responseData['data'].token_expiration
			});
		}
	}
};