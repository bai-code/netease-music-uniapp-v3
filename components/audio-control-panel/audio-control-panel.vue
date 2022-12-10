<template>
	<view class='audio-control-panel'>
		<view class="music-info">
			<view class="image">
				<image :src="musicInfo.picUrl" class='image'
				 :style="{transform:`rotate(${imgDeg}deg)`}" mode='aspecFill'></image>
			</view>
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
			<view class="list" @click="spreadList">
				<text class='iconfont icon-list'></text>
				<view class="container"  :style="{height:isSpread?windowH:0,width:windowW}">
					<music-list-table :musicList='musicList' :showImage='false' :showOther='false'></music-list-table>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import { ref, computed, onMounted } from 'vue'
	import { useStore } from 'vuex'

	const store = useStore()
	const musicList = computed(() => {
		return store.state.musicList
	})
	const musicInfo = computed(() => {
		return store.state.musicInfo
	})
	const isPlay = computed(() => {
		return store.state.isPlay
	})
	
	const timer = ref(null)
	const imgDeg = ref(0)
	
	// 改变播放状态
	const changePlayStatus = (status) => {
		if(status==='play'){
			timer.value = setInterval(()=>{
				imgDeg.value += 1
			},30)	
		}else{
			clearInterval(timer.value)
		}
		
		store.commit('changePlayStatus', {
			isPlay: status === 'play' ? true : false
		})
	}
	// 下一首
	const changeMusic = () => {
		store.dispatch('changeMusic', {})
	}

	const isSpread = ref(false) // 是否展开
	const domRef = ref()
	// 注册展开事件
	const registerEvent = (e)=>{
		const listContainer = domRef.value.$el
		if (!listContainer.contains(e.target)) {
			isSpread.value = false
			document.removeEventListener('click', registerEvent)
		} 
	}
	// 展开事件
	const spreadList = () => {
		isSpread.value = true
		if (isSpread.value) {
			document.addEventListener('click', registerEvent)
		}
	}
	const windowH = ref(0)
	const windowW = ref(0)
	onMounted(() => {
		const info = uni.getSystemInfoSync()
		const { windowHeight, windowWidth } = info
		windowH.value = windowHeight - 200 + 'px'
		windowW.value = windowWidth * 0.95 + 'px'
	})
	
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
			view.image {
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

			view.list {
				view.container {
					position: absolute;
					bottom: 100rpx;
					left: 50%;
					overflow: hidden;
					transform: translateX(-50%);
					box-shadow: 0 -2rpx 10rpx #ccc;
					transition: height 0.5s;

					:deep(.music-list-table) {
						padding: 10rpx;

						view.music-info {
							max-width: 100%;

							view.name {
								@include flex(flex-start, center);

								text.name {
									font-size: 26rpx;
									flex: 0 0 auto;
								}

								text.singer {
									font-size: 24rpx;
									white-space: nowrap;
									color: $lightFontColor;
								}
							}
						}
					}
				}
			}
		}
	}
</style>
