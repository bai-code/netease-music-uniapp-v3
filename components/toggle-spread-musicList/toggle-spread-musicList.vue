<template>
	<view class='spread-musicList' >
		<text class='iconfont icon-list'   @click="isSpread=true"></text>
		<view class="spread-container" @click="toggleSpread" 
		:style="{width:windowW,bottom:isSpread?positionListBottom:'-100vh',height:windowH}">
			<view class="container"  ref='listRef'>
				<view class="c">
					<music-list-table :musicList='musicList' 
					:showImage='false' :showOther='false' />
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import { ref, onMounted, computed } from 'vue'
	import { useStore } from 'vuex'
 
 const store = useStore()
 const musicList = computed(() => {
 	return store.state.musicList
 })
 
 const isSpread = ref(false) // 是否展开
 
 const listRef = ref()
 const toggleSpread = (e) => {
	 const el = e.instance.$el
	 const listContainer = listRef.value.$el
	 const flag = listContainer.contains(el)
	 isSpread.value = flag
 }
 
 const windowH = ref(0)
 const windowW = ref(0)
 const positionListBottom = ref(0)
 
 onMounted(() => {
 	const info = uni.getSystemInfoSync()
 	const { windowHeight, windowWidth, windowBottom } = info
 	windowH.value = windowHeight + 'px'
 	windowW.value = windowWidth  + 'px'
	positionListBottom.value = -windowBottom  + 'px' 
 })
</script>

<style lang="scss" scoped>
	
	view.spread-container{
		// width: 100%;
		background: transparent;
		position: absolute;
		left: 0;
		transition: bottom 0.5s ease-out;
	
		view.container {
			position: absolute;
			bottom: 5rpx;
			left: 50%;
			width: 95%;
			height: 900rpx;
			overflow: hidden;
			transform: translateX(-50%);
			box-shadow: 0 -2rpx 10rpx #ccc;
			background: #fff;
			z-index: 999;
			padding: 20rpx 10rpx;
			box-sizing: border-box;
			border-radius: 10rpx;
			view.c{
				height: 100%;
				overflow: scroll;
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
</style>