<template>
	<view class="video-temp">
		<view class="video-container">
			<view class="image">
				<image class="pic" :src="videoInfo.picUrl" mode="scaleToFill"></image>
				<view class="play-count" v-if="videoInfo._playCount">
					<text class="iconfont icon-play">
					</text>
					<text>{{videoInfo._playCount}}</text>
				</view>
			</view>
			<view class="description">
				<text>{{videoInfo.name}}</text>
			</view>
		</view>
	</view>
</template>

<script setup>
	defineProps({
		videoInfo: {
			type: Object,
			default: () => {
				return {}
			}
		}
	})
</script>

<style lang="scss">
	view.video-temp {
		position: relative;
		height: 0;
		width: 48%;
		padding-bottom: 35%;
		@include flex(flex-start, center);
		flex-direction: column;
		margin-top: 20rpx;
		view.video-container {
			height: 100%;
			width: 100%;
			position: absolute;
			view.play-count{
				position: absolute;
				right: 20rpx;
				top: 5rpx;
				color: #fff;
				text-shadow: 0 0 3rpx #aaa;
				font-size: 24rpx;
				text.iconfont{
					margin-right: 4rpx;
				}
			}
			view.image {
				height: calc(100% - 80rpx);
				width: 100%;
				flex: 0 0 auto;
				image.pic {
					height: 100%;
					width: 100%;
					border-radius: 10rpx;
				}
				
			}

			view.description {
				font-size: 26rpx;
				text {
					@include overflowMul(2);
				}
			}
		}
	}
</style>
