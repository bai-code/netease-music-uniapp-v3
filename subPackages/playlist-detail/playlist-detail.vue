<template>
	<view class="playlist-container">
		<view class='info-detail'>
			<view class="info left">
				<image class="coverImg" :src="playListDetail.coverImgUrl" mode="scaleToFill"></image>
			</view>
			<view class="info right">
				<view class="name">{{ playListDetail.name }}</view>
				<view class="user-info" v-if="playListDetail.creator">
					<view class="img" v-if="playListDetail.creator">
						<image class="avatar" :src="playListDetail.creator.avatarUrl" mode="scaleToFill"></image>
						<image class="identity" v-if="playListDetail.creator.avatarDetail"
							:src="playListDetail.creator.avatarDetail.identityIconUrl" mode="scaleToFill"></image>
					</view>
					<view class="avatar-name overflow" v-if="playListDetail.creator">
						{{ playListDetail.creator.nickname }}
					</view>
				</view>

				<!-- 收藏 分享数量 -->
				<view class="count">
					<view class="track-count">歌曲:<text class="num">{{trackCount}}</text></view>
					<view>播放:<text class="num">{{playCount}}</text></view>
				</view>

				<!-- 分类 -->
				<view class="category">
					<text class="cate-title">分类:</text>
					<view class="cate overflow">
						<text v-for="(tag,index) in playListDetail.tags" :key="index" class="overflow">
							{{tag}}
							<text v-if="index!=playListDetail.tags.length-1">/</text>
						</text>
					</view>
				</view>

				<!-- 专辑描述 -->
				<view class="description" v-if='playListDetail.description'>
					<view class="desc-title">描述:</view>
					<view :class="['desc-txt', { single:!isSpread }]">
						{{ playListDetail.description }}
					</view>
					<view class="icon" v-if="playListDetail.description.length>9">
						<text class="iconfont icon-spread" @click="isSpread=false" v-if="isSpread"></text>
						<text class="iconfont icon-pack-up" @click="isSpread=true" v-else></text>
					</view>
				</view>
			</view>
		</view>
		<view class="controls">
			<button class="btn" @click="playAll">播放全部</button>
			<u--input placeholder="搜索歌手/歌名" prefixIcon="search" prefixIconStyle="font-size: 22px;color: #909399"
				class='search' @change='searchValue' v-model='inputValue'>
			</u--input>
		</view>

		<view class="music-list" v-if="showMusicList">
			<music-list-table ref="listRef" :musicList='showMusicList' :showImage='false'
				@scrollToBottom='scrollToBottom'></music-list-table>
		</view>
	</view>
</template>

<script setup>
	import { onLoad } from '@dcloudio/uni-app'
	import { computed, ref, shallowRef } from 'vue'
	import { useStore } from 'vuex'
	import { computedCount } from '@/utils/plugins.js'

	const pId = ref('') // 专辑id
	const total = ref(0)  //歌曲总数
	const isSpread = ref(false) //是否展开描述
	const listRef = ref()

	const store = useStore()

	const showMusicList = ref([]) // 展示歌曲列表
	const cacheMusicList = ref([]) // 缓存歌曲列表
	const playListDetail = shallowRef({})
	const getPlaylistDetail = async (pid) => {
		const { playlist = {} } = await store.dispatch('getInfo', { path: `/playlist/detail?id=${pid}` })
		playListDetail.value = playlist
		cacheMusicList.value = showMusicList.value = playlist.tracks || []
		total.value = playlist.trackCount
	}

	const getPlaylistTrackAll = async () => {
		const len = cacheMusicList.value.length
		if(len>=total.value)return
		const { songs = [] } = await store.dispatch(
		'getInfo', { path: `/playlist/track/all?id=${pId.value}&limit=20&offset=${len}` })
		 cacheMusicList.value.push(...songs)
		 showMusicList.value = cacheMusicList.value
	}

	const playCount = computed(() => {
		return computedCount(playListDetail.value.playCount || 0)
	})

	const trackCount = computed(() => {
		return computedCount(playListDetail.value.trackCount || 0)
	})


	// 播放全部
	const playAll = () => {
		const playMusic = listRef.value.playMusic
		playMusic && playMusic(0)
	}

	// 滚动到底部
	const scrollToBottom = () => {
		getPlaylistTrackAll()
	}

	// 搜索
	const inputValue = ref('')
	const searchValue = () => {
		const val = inputValue.value
		showMusicList.value = cacheMusicList.value.filter(item=>{
			return item.name.indexOf(val)!==-1
		})
	}

	onLoad((options) => {
		const { pid } = options
		getPlaylistDetail(pid)
		pId.value = pid
	})
</script>

<style lang="scss" scoped>
	view.playlist-container {
		padding: 20rpx;
		box-sizing: border-box;
		overflow: hidden;
		height: calc(100% - 40rpx);

		view.info-detail {
			min-height: 330rpx;
			@include flex(space-between, flex-start);

			view.info.left {
				flex: 0 0 auto;
				width: 330rpx;
				height: 330rpx;

				image.coverImg {
					height: 100%;
					width: 100%;
					border-radius: 10rpx;

				}
			}

			view.info.right {
				width: calc(100% - 350rpx);
				height: 100%;

				view.name {
					font-weight: bolder;
					@include overflowMul(2);
				}

				view.user-info {
					@include flex(flex-start, center);
					margin-top: 15rpx;

					view.img {
						flex: 0 0 auto;
						height: 70rpx;
						width: 70rpx;
						position: relative;

						image {
							height: 100%;
							width: 100%;
							border-radius: 50%;

							&.identity {
								height: 35rpx;
								width: 35rpx;
								border-radius: 50%;
								position: absolute;
								right: -10rpx;
								bottom: 0;
							}
						}
					}

					view.avatar-name {
						font-size: 26rpx;
						padding-left: 15rpx;
						color: $lightFontColor;
					}

				}

				// 数量
				view.count {
					margin-top: 15rpx;
					font-size: 26rpx;
					@include flex(flex-start, center);

					view.track-count {
						margin-right: 10rpx;
					}

					text.num {
						color: $lightFontColor;
						margin-left: 10rpx;
					}


				}

				// 分类
				view.category {
					@include flex(flex-start, center);
					margin-top: 15rpx;
					font-size: 26rpx;

					view.cate {
						color: $lightFontColor;
						margin-left: 5rpx;
						width: calc(100% - 80rpx);
						flex: 0 0 auto;
						@include flex(flex-start, center);

						&>text {
							margin-left: 5rpx;
							white-space: nowrap;
						}
					}
				}

				// 描述
				view.description {
					display: flex;
					justify-content: flex-start;
					font-size: 26rpx;
					margin-top: 15rpx;

					view.desc-title {
						width: 80rpx;
						flex: 0 0 auto;
					}

					view.desc-txt {
						flex: 0 0 auto;
						width: calc(100% - 120rpx);


						&.single {
							overflow: hidden;
							text-overflow: ellipsis;
							white-space: nowrap;
						}
					}
				}
			}
		}

		view.controls {
			margin: 20rpx 0;
			@include flex(space-between, center);

			button {
				width: 200rpx;
				margin: 0;
				background: $bgColor;
				height: 80rpx;
				line-height: 80rpx;
				color: #fff;
				font-size: 26rpx;
			}

			.search {
				width: 40%;
				flex: 0 0 auto;
			}
		}

		view.music-list {
			padding: 15rpx 0;
			height: calc(100% - 380rpx);
			box-sizing: border-box;
		}

	}
</style>
