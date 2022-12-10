<script>
	import { ref, computed } from 'vue'
	import { useStore } from 'vuex'
	import audio from '@/utils/audio.js'
	export default {
		onLaunch: function() {
			const store = useStore()
			// 隔段时间播放地址不能使用，需重新请求
			const musicInfo = computed(()=>{
				return store.state.musicInfo
			})
			store.dispatch('getMusicInfo',{ musicInfo:musicInfo.value, isPlay:false })
			
			const musicList = computed(()=>{
				return store.state.musicList
			})
			
			audio.onEnded(()=>{
				store.dispatch('changeMusic', { params:'next' })
			})
			
			const oldTime = ref(0)
			audio.onTimeUpdate(()=>{
				const currentTime = parseInt(audio.currentTime)
				if(oldTime.value !== currentTime){
					store.commit('timeUpdate',{currentTime})
				}
			})
		},
		// onShow: function() {
		// 	console.log('App Show')
		// },
		// onHide: function() {
		// 	console.log('App Hide')
		// }
	}
</script>

<style lang='scss'>
	/* uview样式 */
	@import "@/uni_modules/uview-plus/index.scss";

	body,
	page {
		color: $fontColor;
	}

	/*每个页面公共css */
</style>
