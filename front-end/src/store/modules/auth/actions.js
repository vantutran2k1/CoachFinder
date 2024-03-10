let timer;

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
			
			const expiresIn = +data.token_expiration * 1000;
			const expirationDate = new Date().getTime() + expiresIn;
			
			localStorage.setItem('userId', data.user_id);
			localStorage.setItem('email', data.email);
			localStorage.setItem('accessToken', data.access_token);
			localStorage.setItem('refreshToken', data.refresh_token);
			localStorage.setItem('tokenExpiration', expirationDate);
			
			timer = setTimeout(function () {
				context.dispatch('autoLogout');
			}, expiresIn);
			
			context.commit('setUser', {
				userId: data.user_id,
				email: data.email,
				accessToken: data.access_token,
				refreshToken: data.refresh_token,
			});
		}
	},
	tryLogin(context) {
		const userId = localStorage.getItem('userId');
		const email = localStorage.getItem('email');
		const accessToken = localStorage.getItem('accessToken');
		const refreshToken = localStorage.getItem('refreshToken');
		const tokenExpiration = localStorage.getItem('tokenExpiration');
		
		const expiresIn = +tokenExpiration - new Date().getTime();
		if (expiresIn < 0) {
			return;
		}
		
		timer = setTimeout(function () {
			context.dispatch('autoLogout');
		}, expiresIn);
		
		if (userId && email && accessToken && refreshToken) {
			context.commit('setUser', {
				userId: userId,
				email: email,
				accessToken: accessToken,
				refreshToken: refreshToken,
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
			});
		}
	},
	logout(context) {
		localStorage.removeItem('userId');
		localStorage.removeItem('email');
		localStorage.removeItem('accessToken');
		localStorage.removeItem('refreshToken');
		localStorage.removeItem('tokenExpiration');
		
		clearTimeout(timer);
		
		context.commit('logoutUser');
	},
	autoLogout(context) {
		context.dispatch('logout');
		context.commit('setAutoLogout');
	}
};