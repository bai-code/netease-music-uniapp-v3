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
			
			// 歌曲播放结束
			audio.onEnded(()=>{
				store.dispatch('changeMusic', { params:'next' })
			})
			
			const oldTime = ref(0)
			// 歌曲更新播放时间
			audio.onTimeUpdate(()=>{
				const currentTime = parseInt(audio.currentTime)
				if(oldTime.value !== currentTime){
					store.commit('timeUpdate',{currentTime})
				}
			})
			
			store.dispatch('getInfo', { path:'/register/anonimous' })
			
		},
		
	}
</script>

<style lang='scss'>
	/* uview样式 */
	page,body{
		height: 100%;
		overflow: hidden
	}
	@import "@/uni_modules/uview-plus/index.scss";

	body,
	page {
		color: $fontColor;
	}

	/*每个页面公共css */
</style>
