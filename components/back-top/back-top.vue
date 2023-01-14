<template>
	<view class="back-top" @click="backToTop" v-if="scrollTopDis>500">
		<view class="iconfont icon-back-top">
			
		</view>
	</view>
</template>

<script setup>
	
	defineProps({
		scrollTopDis:{
			// 滚动距离
			type:Number,
			default:0
		}
	})
	
	const emits = defineEmits(['backToTop'])
	
	const backToTop = () => {
		emits('backToTop')
	}
</script>

<style lang="scss" scoped>
	view.back-top{
		position: fixed;
		right: 40rpx;
		bottom: 60rpx;
		background: rgba(200,200,200,0.8);
		height: 80rpx;
		width: 80rpx;
		box-shadow: 0 0 5rpx #ccc;
		border-radius: 20rpx;
		@include flex(center,center);
		view.iconfont{
			color: $bgColor;
			font-weight: bolder;
			font-size: 55rpx;
		}
	}
</style>