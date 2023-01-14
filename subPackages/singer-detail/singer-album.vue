<template>
	<view class="singer-album">
		<view class="hot-50" v-if="showHotMusic.length">
			<view class="title">
				热门50首
			</view>
			<music-list-table class='music-list' :musicList='showHotMusic' :showImage='false' />
			<view class="show-more" v-if="showMore" @click="showHotMusic=hotMusic,showMore=false">
				<text>查看全部 {{ hotMusic.length }} 首</text>
				<text class="iconfont icon-right"></text>
			</view>
		</view>
		<view class="album-list" v-if='albumList.length'>
			<view class="album-item" v-for="(album,index) in albumList" :key="album.id">
				<view class="album-item-title">
					{{ album.name }}
				</view>
				<view class="list">
					<view class="image">
						<image :src="album.blurPicUrl" mode="scaleToFill"></image>
					</view>
					<view class="music-list-content" v-if="album._songs">
						<music-list-table class='music-list'
							:musicList='album._songs.slice(0,spreadListIndex===index?-1:5)' :showImage='false' />
						<view class="show-more" v-if="spreadListIndex!==index&&album._songs.length>10"
							@click="spreadListIndex=index">
							<text>查看全部 {{ album._songs.length }} 首</text>
							<text class="iconfont icon-right"></text>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import { useStore } from 'vuex'
	import { watch, ref, reactive } from "vue";
	const props = defineProps({
		singerId: {
			type: [String, Number],
			required:true
		}
	})

	const store = useStore()

	const spreadListIndex = ref(-1) // 控制展示五首还是全部歌曲

	const isLoading = ref(0) // 是否加载中

	const showMore = ref(true) // 是否展示更多
	const hotMusic = ref([]) // 全部数据
	const showHotMusic = ref([]) // 部分数据
	// 获取歌手50首单曲
	const getSingerSingleMusic = async (id) => {
		const { hotSongs } = await store.dispatch('getInfo', { path: `/artists?id=${id}` })
		hotMusic.value = hotSongs
		showHotMusic.value = hotMusic.value.slice(0, 5)
	}

	const albumList = reactive([]) // 专辑数组
	const hasMore = ref(true)
	const getAlbumDetail = async (id, index) => {
		const { songs = [] } = await store.dispatch('getInfo', { path: `/album?id=${id}` })
		albumList[index]._songs = songs
		isLoading.value -= 1
	}


	const getSingerAlbum = async (id) => {
		const len = albumList.length || 0
		// console.log(len);
		const { hotAlbums, more } = await store.dispatch(
		'getInfo', { path: `/artist/album?id=${id}&limit=5&offset=${len}` })
		albumList.push(...hotAlbums)
		hasMore.value = more
		albumList.forEach((item, index) => {
			if (!item._songs) {
				isLoading.value += 1
				getAlbumDetail(item.id, index)
			}
		})
	}

	watch(() => props.singerId, (id) => {
		getSingerSingleMusic(id)
		getSingerAlbum(id)
	}, { immediate: true })

	const loadMore = () => {
		if (!hasMore.value || isLoading.value !== 0) return
		getSingerAlbum(props.singerId)
	}

	// 暴露出去，父组件滚动到底部加载更多
	defineExpose({
		loadMore
	})
</script>

<style lang="scss">
	view.singer-album {

		// .music-list{
		// 	padding-left: 100rpx !important;
		// }
		view.hot-50 {
			margin-top: 30rpx;

			view.title {
				font-size: 40rpx;
				font-weight: bold;
			}

			view.show-more {
				height: 80rpx;
				@include flex(flex-end, center);
				color: $lightFontColor;
				font-size: 26rpx;
			}
		}

		view.album-list {
			view.album-item {
				view.album-item-title {
					font-size: 40rpx;
					font-weight: bolder;
					margin: 50rpx 0 20rpx 0;
				}

				view.list {
					@include flex(space-between, flex-start);

					view.image {
						width: 30vw;
						height: 30vw;
						flex: 0 0 auto;

						&>image {
							height: 100%;
							width: 100%;
							border-radius: 10rpx;
						}
					}

					view.music-list-content {
						width: calc(100% - 31vw);

						view.show-more {
							height: 80rpx;
							@include flex(flex-end, center);
							color: $lightFontColor;
							font-size: 26rpx;
						}
					}
				}
			}
		}
	}
</style>
