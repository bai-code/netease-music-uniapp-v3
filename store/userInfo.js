// import tempAvatarPng from '@/static/temp-avatar.png'
import axios from '@/utils/axios.js'

const tempUserInfo = {
	nickname: '张三',
	token:'',
	nickname:'',
	userId:''
}
const userInfo = JSON.parse(localStorage.getItem('userInfo')) || tempUserInfo

export default {
	namespaced: true,
	state: {
		userInfo
	},
	mutations: {
		saveInfo(state, payload) {
			const info = state.userInfo
			for(const prop in tempUserInfo){
				state.userInfo[prop] = payload[prop]
			}
			localStorage.setItem('userInfo', JSON.stringify(state.userInfo))
		}
	},
	actions: {
		async getInfo({ state }, { path = '/register/anonimous' } = {}) {
			try {
				const res = await axios({ url: path })
				return res
			} catch (err) {
				console.log(err);
			}

			console.log(res)
		},
		async userLogin({ state, commit }, { phone, password, code, email }) {
			let path = ''
			let data = {}
			if (email) {
				path = `/login?email=${email}&password=${password}`
			} else if (code) {
				const res = await axios({url:`/captcha/verify?phone=${phone}&captcha=${code}`})
				if(res.code!==200)return false
				path = `/login/cellphone?phone=${phone}&captcha=${code}`
				
			} else {
				path = `/login/cellphone`
			}
			const { token, profile } = await axios({ url: path, method:'POST' })
			if (token) {
				const { avatarUrl, nickname, userId } = profile
				commit('saveInfo', { token, avatarUrl, nickname, userId })
				return true
			}
			return false
		}
	}
}
