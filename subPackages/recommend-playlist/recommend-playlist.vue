<template>
	<view class="playlist-tags">
		<scroll-view scroll-x="true" scroll-with-animation :scroll-into-view='"tag"+currentIndex'>
			<view :class="['tag',{current:index===currentIndex}]" @click="setCurrentIndex(index)"
				v-for="(tag,index) in playlistCategory" :key="tag.id" :id='"tag"+index'>
				{{tag.name}}
			</view>
		</scroll-view>

		<swiper :current="currentIndex" :interval="3000" :duration="1000" @change="changeSwiper">
			<swiper-item v-for="(tag,index) in playlistCategory" :key='tag.id'>
				<scroll-view scroll-y="true" class="item-container" @scrolltolower="scrollToBottom"
					v-if='categoryDetailList[currentIndex]&&categoryDetailList[currentIndex].list'>
					<view class="children-container">
						<view class="playlist-item" v-for='playlist in categoryDetailList[currentIndex].list'
							:key="playlist.id">
							<playlist-temp :musicInfo='playlist' />
						</view>
					</view>
				</scroll-view>l
			</swiper-item>
		</swiper>
	</view>
</template>

<script setup>
	import { onMounted, ref, shallowRef, watch } from 'vue'
	import { useStore } from 'vuex'
	import { computedPlayCount } from '@/utils/plugins.js'

	const store = useStore()
	const currentIndex = ref(0)
	const playlistCategory = shallowRef([])
	// 获取列表分类
	const getPlaylist = async () => {
		const { tags = [] } = await store.dispatch('getInfo', { path: '/playlist/hot' })
		playlistCategory.value = tags
	}

	// 设置当前项
	const setCurrentIndex = (index) => {
		currentIndex.value = index
	}

	// swiper切换 使对应的scroll-view 也切换
	const isNoMore = ref(false) // 是否还有更多
	const loadMore = ref(false)
	const changeSwiper = (e) => {
		const { current } = e.detail
		currentIndex.value = current
	}
	// 获取列表数据分类内具体数据
	const categoryDetailList = ref([])
	const getCategoryDetailList = async (val) => {
		let item = categoryDetailList.value[currentIndex.value]
		const _val = val || playlistCategory.value[currentIndex.value].name
		if (!item) {
			item = categoryDetailList.value[currentIndex.value] = {
				list: [],
				isMore: true
			}
		}
		if (item.list && item.list.length === 0 || loadMore.value) {
			const offset = item && item.list && item.list.length || 0
			const { more, playlists = [] } = await store.dispatch(
				'getInfo', { path: `/top/playlist?limit=20&cat=${_val}&offset=${offset}` })
			const newDate = computedPlayCount({ list: playlists })
			categoryDetailList.value[currentIndex.value].list.push(...playlists)
			categoryDetailList.value[currentIndex.value].isMore = more
		}
		loadMore.value = false
	}

	const getListDetail = (index = 0) => {
		const list = playlistCategory.value
		if (list.length === 0) return
		const val = list[index].name
		getCategoryDetailList(val)
	}
	// 滚动加载更多
	const scrollToBottom = () => {
		if (!isNoMore) return
		loadMore.value = true
		getCategoryDetailList()
	}

	watch(currentIndex, (index) => {
		const list = categoryDetailList.value[currentIndex.value]
		if (list) {
			isNoMore.value = list.isMore
		}
		loadMore.value = false
		getListDetail(index)
	})

	onMounted(async () => {
		await getPlaylist()
		getListDetail(0)
	})
</script>

<style lang="scss" scoped>
	view.playlist-tags {
		height: 100%;

		scroll-view {
			width: 100%;
			white-space: nowrap;
			// height: 80rpx;

			view.tag {
				display: inline-block;
				padding: 10rpx 20rpx;
				height: 60rpx;
				line-height: 60rpx;

				&.current {
					color: $bgColor;
					position: relative;

					&::after {
						content: '';
						height: 4rpx;
						position: absolute;
						background: $bgColor;
						bottom: 0;
						width: 80%;
						left: 50%;
						transform: translateX(-50%);
					}
				}
			}
		}

		swiper {
			height: calc(100% - 80rpx);
			padding: 10rpx;
			box-sizing: border-box;

			swiper-item {
				height: 100%;
				// background: #0f0;

				scroll-view.item-container {
					height: 100%;

					view.children-container {
						@include flex(space-evenly, center);
						flex-wrap: wrap;

						view.playlist-item {
							width: 45%;
							flex: 0 0 auto;

							.playlist-temp {
								width: 100%;
							}
						}
					}
				}
			}
		}
	}
</style>
