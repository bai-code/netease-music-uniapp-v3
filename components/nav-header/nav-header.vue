<template>
	<view class="nav-header__container">
		<view class='nav-header'>
			<slot name='left'>
				<view class="left">

				</view>
			</slot>
			<slot name='center'>
				<view class="center">
				</view>
			</slot>
			<slot name='right'>
				<view class="right">

				</view>
			</slot>
		</view>
	</view>
</template>

<script>
	export default {
		name: "nav-header",
		data() {
			return {

			};
		}
	}
</script>

<style lang="scss" scoped>
	view.nav-header__container {
		height: 90rpx;
		background-color: $bgColor;
		padding: 5rpx 20rpx;
		box-sizing: border-box;
		// @include flex(space-between,center);
		view.nav-header {
			position: relative;
			@include flex(space-between, center);

		}
	}
</style>
