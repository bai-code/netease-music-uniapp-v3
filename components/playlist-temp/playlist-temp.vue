<template>
	<!-- 歌单 模板 -->
	<view class="play-list-temp">
		<view class="image">
			<image :src="musicInfo.picUrl" mode="scaleToFill"></image>
			<view class="play-count">
				<text class="iconfont icon-icon-play"></text>
				<text>{{musicInfo._playCount}}</text>
			</view>
			<text class="iconfont icon-icon-play"></text>
		</view>
		<text class="info-descript">
			{{musicInfo.name}}
		</text>
	</view>
</template>

<script setup>
	const props = defineProps({
		musicInfo:{
			type:Object,
			default:()=>{
				return {}
			}
		}
	})
</script>

<style lang="scss">
view.play-list-temp{
	width: 260rpx;
	@include flex(flex-start,center);
	flex-direction: column;
	view.image{
		height: 0;
		padding-bottom: 90%;
		width: 90%;
		position: relative;
		border: 1px solid #ccc;
		border-radius: 10rpx;
		overflow: hidden;
		image{
			position: absolute;
			height: 100%;
			width: 100%;
		}
		view.play-count{
			position: absolute;
			top: 5rpx;
			color: #fff;
			text-shadow: 0 0 5rpx #aaa;
			font-size: 12rpx;
			transform: scale(0.9);
			@include flex(flex-start,center);
			right: 10rpx;
			text.iconfont{
				font-size: inherit;
				margin-right: 5rpx;
			}
		}
		&>text.iconfont{
			position: absolute;
			bottom: 15rpx;
			right: 15rpx;
			color: #fff;
			text-shadow: 0 0 5rpx #aaa;
			font-size: 35rpx;
		}
	}
	text.info-descript{
		font-size: 26rpx;
		@include overflowMul(2);
		width: 90%;
		margin-top: 10rpx;
	}
	
}
</style>