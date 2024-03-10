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
			const data = responseData['data'];
			
			localStorage.setItem('userId', data.user_id);
			localStorage.setItem('email', data.email);
			localStorage.setItem('accessToken', data.access_token);
			localStorage.setItem('refreshToken', data.refresh_token);
			localStorage.setItem('tokenExpiration', data.token_expiration);
			
			context.commit('setUser', {
				userId: data.user_id,
				email: data.email,
				accessToken: data.access_token,
				refreshToken: data.refresh_token,
				tokenExpiration: data.token_expiration
			});
		}
	},
	tryLogin(context) {
		const userId = localStorage.getItem('userId');
		const email = localStorage.getItem('email');
		const accessToken = localStorage.getItem('accessToken');
		const refreshToken = localStorage.getItem('refreshToken');
		const tokenExpiration = localStorage.getItem('tokenExpiration');
		
		if (userId && email && accessToken && refreshToken && tokenExpiration) {
			context.commit('setUser', {
				userId: userId,
				email: email,
				accessToken: accessToken,
				refreshToken: refreshToken,
				tokenExpiration: tokenExpiration
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
	},
	logout(context) {
		context.commit('logoutUser');
	}
};