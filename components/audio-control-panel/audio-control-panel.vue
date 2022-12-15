<template>
	<view class='audio-control-panel'>
		<view class="music-info">
			<navigator class="image" open-type="navigate" url="/subPackages/music-detail/music-detail" >
				<image :src="musicInfo.picUrl" class='image'
				 :style="{transform:`rotate(${imgDeg}deg)`}" mode='aspecFill'></image>
			</navigator>
			<view class="music-name">
				<text class="name">{{ musicInfo.name }}</text>
				<text class="singer">&nbsp; - &nbsp;{{ musicInfo._singer }}</text>
			</view>
		</view>
		<view class="controls"  ref='domRef'>
			<view class="play-pause">
				<view class="pause" v-show='isPlay' @click="changePlayStatus('pause')">
					<text class='iconfont icon-pause'></text>
				</view>
				<view class="play" v-show='!isPlay' @click="changePlayStatus('play')">
					<text class='iconfont icon-play'></text>
				</view>

			</view>
			<view class="next" @click="changeMusic">
				<text class='iconfont icon-next'></text>
			</view>
			<view class="list" >
				<toggle-spread-musicList />
			</view>
		</view>
	</view>
</template>

<script setup>
	import { ref, computed } from 'vue'
	import { useStore } from 'vuex'
	import { onShow, onHide } from '@dcloudio/uni-app'

	const store = useStore()
	
	const musicInfo = computed(() => {
		return store.state.musicInfo
	})
	const isPlay = computed(() => {
		return store.state.isPlay
	})
	
	const timer = ref(null)
	const imgDeg = ref(0)
	
	const startInterval = ()=>{
		timer.value = setInterval(()=>{
			imgDeg.value += 1
		},30)
	}
	// 改变播放状态
	const changePlayStatus = (status) => {
		if(status==='play'){
				startInterval()
		}else{
			clearInterval(timer.value)
			timer.value = null
		}
		
		store.commit('changePlayStatus', {
			isPlay: status === 'play' ? true : false
		})
	}
	// 下一首
	const changeMusic = () => {
		store.dispatch('changeMusic', {})
	}
	
	onShow(()=>{
		if(isPlay.value){
			clearInterval(timer.value)
			startInterval()
		}
	})
	onHide(()=>{
		clearInterval(timer.value)
		// console.log(timer.value);/*  */
	})
	
	// onBeforeUnmount(()=>{
	// 	clearInterval(timer.value)
	// })
</script>

<style lang="scss" scoped>
	view.audio-control-panel {
		position: absolute;
		bottom: 0;
		width: 100%;
		height: 100rpx;
		background: #fff;
		padding: 0 20rpx;
		border: 1rpx solid;
		border-color: #ccc transparent transparent transparent;
		box-sizing: border-box;
		border-top-left-radius: 10rpx;
		border-top-right-radius: 10rpx;
		@include flex(space-between, center);

		view.music-info{
			@include flex(flex-start, center);
			width: 65%;
			flex: 0 0 auto;
			navigator.image {
				flex: 0 0 auto;
				height: 80rpx;
				width: 80rpx;
				image.image {
					height: inherit;
					width: inherit;
					border-radius: 50%;
				}
			}
			view.music-name{
				@include flex(flex-start,center);
				flex: 0 0 auto;
				overflow-x: auto;
				width: calc(100% - 120rpx);
				margin-left: 10rpx;
				text.name{
					font-size: 26rpx;
					white-space: nowrap;
				}
				text.singer{
					font-size: 24rpx;
					color: $lightFontColor;
					white-space: nowrap;
				}
			}
			
		}

		view.controls {
			width: 35%;
			@include flex(space-between, center);

			text.iconfont {
				font-size: 45rpx;
			}

		}
	}
</style>
