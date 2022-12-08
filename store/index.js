import { createStore } from 'vuex'

const audio = uni.createInnerAudioContext()

export default createStore({
	state(){
		return {
			count:'asdfsdf'
		}
	},
	mutations:{
		play(){
			audio.play()
		},
		pause(){
			audio.pause()
		}
	}
})