<template>
	<view class="video-temp">
		<view class="video-container" @click="linkToVideoDetail">
			<view class="image">
				<image class="pic" :src="videoInfo[imageName]||videoInfo.cover" mode="scaleToFill"></image>
				<view class="play-count" v-if="videoInfo._playCount">
					<text class="iconfont icon-play">
					</text>
					<text>{{videoInfo._playCount}}</text>
				</view>
				<slot></slot>
			</view>
			<view class="description">
				<text>{{videoInfo.name}} {{showSinger?' - ' + videoInfo._singer:''}}</text>
			</view>
		</view>
	</view>
</template>

<script setup>
	const props = defineProps({
		videoInfo: {
			type: Object,
			default: () => {
				return {}
			}
		},
		showSinger:{
			type:Boolean,
			default:false
		},
		imageName:{ // 展示的图片名字
			type:String,
			default:'picUrl'
		}
	})
	
	const linkToVideoDetail = () => {
		const { id } = props.videoInfo
		uni.navigateTo({
			url:`/subPackages/video-detail/video-detail?mvId=${id}`
		})
	}
</script>

<style lang="scss" scoped>
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
				position: relative;
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
