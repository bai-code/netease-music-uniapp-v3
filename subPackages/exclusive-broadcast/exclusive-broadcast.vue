<template>
	<view class="exclusive-broadcast">
		<scrollView-backTop @scrollToBottom='loadMore' :isLoading='isLoading'>
			<video-temp :videoInfo='item' imageName='sPicUrl' v-for="item in privatecontentList" :key="item.id">
				<view class="play-icon">
					<text class="iconfont icon-play"></text>
				</view>
			</video-temp>
		</scrollView-backTop>
	</view>
</template>

<script setup>
	import { reactive, ref, defineExpose, nextTick } from 'vue'
	import { useStore } from 'vuex'
	import { onLoad } from '@dcloudio/uni-app'

	const store = useStore()

	// 获取独家放送数据
	const privatecontentList = reactive([]) // 数据数组
	const hasMore = ref(true) // 是否还有更多
	// 获取数据
	const getPrivatecontentList = async () => {
		isLoading.value = true
		const len = privatecontentList.length
		const { more, result } = await store.dispatch(
			'getInfo', { path: `/personalized/privatecontent/list?limit=20&offset=${len}` })
		privatecontentList.push(...result)
		isLoading.value = false
	}

	const isLoading = ref(false) // 是否获取数据中
	// 加载更多
	const loadMore = () => {
		getPrivatecontentList()
	}

	// const scrollTopDis = ref(0) // 滚动距离

	// 滚动距离
	// const scrollDistance = (e) => {
	// 	const { scrollTop } = e.detail
	// 	scrollTopDis.value = scrollTop
	// }

	// // 返回顶部
	// const backToTop = () => {
	// 	scrollTopDis.value = 0 /*  */
	// }


	onLoad(() => {
		getPrivatecontentList()
	})
</script>

<style lang="scss" scoped>
	view.exclusive-broadcast {
		height: 100%;

		// view.view-container {
		// 	@include flex(space-around, center);
		// 	flex-wrap: wrap;
		// 	height: 100%;
		view.play-icon {
			position: absolute;
			top: 15rpx;
			left: 15rpx;
			height: 50rpx;
			width: 50rpx;
			@include flex(center, center);
			border-radius: 50%;
			border: 2rpx solid rgba(200, 200, 200, 1);
			background: rgba(100, 100, 100, 0.3);

			text.iconfont {
				color: rgba(200, 200, 200, 1);
			}

			// }
		}

		// }
	}
</style>
