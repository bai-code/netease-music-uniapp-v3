<template>
	<view class='mine'>
		<view class="fill-avatar">
			<view class="avatar">
				<image src="@/static/temp-avatar.png" mode="scaleToFill"></image>
				<view class="other overflow">
					<text class="nickname" v-if='userInfo.token'> {{ userInfo.nickname }} </text>
					<navigator  open-type="navigate" url="/subPackages/user-login/user-login" v-else>登录</navigator>
				</view>
				
			</view>
		</view>
			
	</view>
</template>

<script setup>
	import { computed, onMounted, ref } from 'vue'
	import { useStore } from 'vuex'
	const store = useStore()
	// store.dispatch('userInfo/getUserInfo')
	
	const userInfo = computed(()=>{
		return store.state.userInfo.userInfo
	})
	
	
</script>

<style lang="scss" scoped>
view.mine{
	view.fill-avatar{
		width: 100%;
		height: 0;
		overflow: hidden;
		padding-bottom: 70%;
		position: relative;
		border-bottom: 1rpx solid #aaa;
		background: #ccc;
		view.avatar{
			position: absolute;
			height: 100%;
			width: 100%;
			@include flex(center,center);
			flex-direction: column;
			image{
				height: 270rpx;
				width: 270rpx;
				padding: 8rpx;
				box-sizing: border-box;
				background: #fff;
				border-radius: 50%;
			}
			view.other{
				position: absolute;
				bottom: 30rpx;
				color: #fff;
				
				font-size: 36rpx;
				width: 80%;
				text-align: center;
				@include flex(center,center);
				text.nickname{
					text-shadow: 2rpx 2rpx 4rpx #888;
				}
				navigator{
					width: 80rpx;
					background: #fff;
					border-radius: 10rpx;
					padding: 5rpx 20rpx;
					color: #444;
				}
			}
		}
	}
}
</style>
