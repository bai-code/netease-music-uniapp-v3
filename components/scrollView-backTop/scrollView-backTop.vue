<template>
	<scroll-view class="container" scroll-y @scrolltolower="scrollToBottom" 
	 @scroll='scrollEvent' :scroll-top='scrollDistance' lower-threshold='200'
	 enable-back-to-top scroll-with-animation>
		<view class="view-content">
			<slot></slot>
		</view>
		<view class="back-top" @click="backToTop" :style="[backTopDistance]"
		v-if="scrollDistance>distanceTop">
			<view class="iconfont icon-back-top"></view>
		</view>
		<u-loading-icon :show="isLoading"  v-if="needLoading" ></u-loading-icon>
	</scroll-view>
</template>

<script setup>
	import { ref } from 'vue'

	defineProps({
		distanceTop: {
			// 距离顶部距离，出现滚动条
			type: Number,
			default: 600
		},
		needLoading:{  // 是否需要 loading
			type:Boolean,
			default:true
		},
		isLoading:{
			// needloading 为 false 此条不生效
			type:Boolean,
			default:false
		},
		backTopDistance:{
			type:Object,
			default:()=>{
				return {
					right: '40rpx',
					bottom: '80rpx'
				}
			}
		}
	})

	const emits = defineEmits(['scrollToBottom'])

	const scrollDistance = ref(0) // 滚动距离

	// scroll-view 滚动事件
	const scrollEvent = (e) => {
		const { scrollTop } = e.detail
		scrollDistance.value = scrollTop
	}

	// 滚动触底事件
	const scrollToBottom = () => {
		emits('scrollToBottom')
	}

	// 回顶部
	const backToTop = () => {
		scrollDistance.value = 0
	}
</script>

<style lang="scss" scoped>
	.container {
		height: 100%;
		position: relative;
		view.view-content{
			@include flex(space-around, center);
			flex-wrap: wrap;
		}
		view.back-top {
			position: fixed;
			// right: 40rpx;
			// bottom: 80rpx;
			background: rgba(200, 200, 200, 0.8);
			height: 80rpx;
			width: 80rpx;
			box-shadow: 0 0 5rpx #ccc;
			border-radius: 20rpx;
			@include flex(center, center);

			view.iconfont {
				color: $bgColor;
				font-weight: bolder;
				font-size: 55rpx;
			}
		}
	}
</style>
