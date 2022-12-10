<template>
	<view class='home-container'>
		<nav-header class='search'>
			<!-- 搜索 -->
			<template #center>
				<view class='search'>
					<view class="content" @click='searchPage'>
						<icon type="search"></icon>
						<text class='placeholder'>搜索歌曲/歌手</text>
					</view>
				</view>
			</template>
		</nav-header>
		
		<audio-control-panel></audio-control-panel>
	</view>
</template>

<script setup>
	const searchPage = () => {
		uni.navigateTo({
			url: '/subPackages/search/search'
		})
	}
</script>

<style lang='scss' scoped>
	view.home-container {
		:deep(.nav-header__container.search) {
			height: 80rpx;
			padding: 15rpx 20rpx;

			view.search {
				height: 50rpx;
				width: 80%;
				background: #fff;
				border-radius: 80rpx;
				position: relative;
				@include flex(center, center);

				view.content {
					@include flex(center, center);

					uni-icon {
						margin-right: 10rpx;

						:deep(svg) {
							height: 20 !important;
							width: 20 !important;
						}
					}

					text.placeholder {
						color: $holderColor;
					}
				}
			}
		}
	}
</style>
