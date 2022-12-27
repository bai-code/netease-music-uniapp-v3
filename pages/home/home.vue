<template>
	<view class="home-container">
		<nav-header class="search">
			<!-- 搜索 -->
			<template #center>
				<view class="search">
					<view class="content" @click="searchPage">
						<icon type="search"></icon>
						<text class="placeholder">搜索歌曲/歌手</text>
					</view>
				</view>
			</template>
		</nav-header>

		<scroll-view class="home-content" scroll-y @scroll="scrollTopInfo">
			<!-- 轮播图 -->
			<swiper :indicator-dots="true" :autoplay="true" :interval="5000" indicator-active-color="#EC4141" circular
				class="swiper-container">
				<swiper-item v-for="banner in bannerList" :key="banner.id" class="swiper-item" @click="playItem(banner)"
					:style="{ height: imgHeight }">
					<image class="pic" mode="scaleToFill" :src="banner.pic"></image>
				</swiper-item>
			</swiper>

			<!-- 每日推荐 。。。 -->
			<view class="other">
				<view class="list-container">
					<view class="daily item">
						<navigator open-type="navigate" url="/subPackages/recommend-daily/recommend-daily">
							<view class="item-c">
								<view class="iconfont icon-daily">
									<text class="date">{{daily}}</text>
								</view>
								<view class="txt">
									每日推荐
								</view>
							</view>
						</navigator>
					</view>
					<view class="song-list item">
						<navigator open-type="navigate" url="/subPackages/recommend-playlist/recommend-playlist">
							<view class="item-c">
								<view class="iconfont icon-songlist" />

								<view class="txt">
									歌单
								</view>
							</view>
						</navigator>
					</view>
					<view class="ranking item">
						<navigator open-type="navigate" url="/subPackages/ranking-list/ranking-list">
							<view class="item-c">
								<view class="iconfont icon-ranking">

								</view>
								<view class="txt">
									排行榜
								</view>
							</view>
						</navigator>
					</view>
					<view class="daily item">
						<navigator open-type="navigate" url="">
							<view class="item-c">
								<view class="iconfont icon-daily">

								</view>
								<view class="txt">
									占位
								</view>
							</view>
						</navigator>
					</view>
				</view>

				<!-- 推荐歌单 -->

				<view class="recommend-playlist">
					<nav-title title='推荐歌单' linkUrl='/subPackages/recommend-playlist/recommend-playlist' />
					<scroll-view scroll-x="true" class="scroll-container">
						<view v-for="item in playList" :key="item.id" class="scroll-item">
							<playlist-temp :musicInfo='item' />
						</view>
					</scroll-view>
				</view>

				<!-- 新歌推荐 -->
				<view class="new-song">
					<nav-title title='新歌推荐' linkUrl='/subPackages/new-song/new-song' />
					<view class="new-song-content">
						<music-list-table :musicList='newSongList' :showOther='false' />
					</view>
				</view>


				<!-- 排行榜 -->
				<view class="ranking-list">
					<nav-title title='榜单热门' linkUrl='/subPackages/ranking-list/ranking-list' ></nav-title>
					<swiper :interval="3000" :duration="500" next-margin="50rpx">
						<swiper-item v-for="item in topList" :key='item'>
							<image :src="item.coverImgUrl" mode="scaleToFill"></image>
							<view class="s-item">
								<view class="item overflow" v-for="(i,index) in item.tracks" :key='index'>
									{{index + 1}}. {{i.first}} <text class="singer overflow"> - {{i.second}}</text>
								</view>
							</view>
						</swiper-item>
					</swiper>
				</view>

				<!-- 热门歌手 -->
				<view class="hot-singer">
					<nav-title title='热门歌手' linkUrl='/subPackages/singer-list/singer-list' />
					<movable-area ref='movableRef'>
						<template v-if="movableList.length>0">
							<movable-view class="movable-item" direction='all' v-for="(singer,index) in hotSingerList"
								:key="singer.id" :x='movableList[index].left' :y='movableList[index].top'
								:inertia='true' scale='true' scale-min="0.5" scale-max="1.5" animation
								@change="movableChange(index)" :style="{zIndex:activeIndex===index?9:1}">
								<!-- {{index}} -->
								<image :src="singer.img1v1Url" class="s-pic" mode="scaleToFill"></image>
							</movable-view>
						</template>
					</movable-area>
				</view>

				<!-- 独家放送 -->
				<view class="personalized">
					<nav-title title='独家放送' />
					<view class="personalized-content">
						<template v-for="video in personalizedList" :key="video.id">
							<video-temp :videoInfo='video' />
						</template>
					</view>
				</view>


				<!-- 推荐mv -->
				<view class="recommend-mv">
					<nav-title title='推荐mv' linkUrl='/subPackages/video-content/video-content' />
					<view class="mv-content">
						<template v-for='mv in recommendMvList' :key="mv.id">
							<video-temp :videoInfo='mv' />
						</template>
					</view>
				</view>

			</view>
		</scroll-view>

		<!-- // 播放控制板 -->
		<audio-control-panel></audio-control-panel>
	</view>
</template>

<script setup>
	import { ref, onMounted, shallowRef, computed } from "vue";
	import { useStore } from "vuex";
	import { playAndCommit, loopAdd, computedPlayCount, sortPosition } from '@/utils/plugins.js'

	const phoneType = ref(1); // 设备平台
	const imgHeight = ref(0); // 图片比例对应高度

	const store = useStore();

	const bannerList = ref([]);
	const getBannerList = async () => {
		const { banners = [] } = await store.dispatch("getInfo", {
			path: `/banner?type=${phoneType.value}`,
		});
		bannerList.value = banners;
		// console.log(res);
	};

	const searchPage = () => {
		uni.navigateTo({
			url: "/subPackages/search/search",
		});
	};

	// 点击banner触发事件
	const playItem = async (banner) => {
		const { url, targetType, targetId } = banner;
		if (url) {
			uni.navigateTo({
				url: `/subPackages/external-website/external-website?url=${banner.url}`,
			});
		} else {
			//  
			if (targetType === 1) {
				// 播放单首歌曲
				const { songs = [] } = await store.dispatch(
					'getInfo', { path: `/song/detail?ids=${targetId}` })
				playAndCommit({ musicInfo: songs[0] })
			} else if (targetType === 1000) {
				// 歌单、
				uni.navigateTo({
					url: `/subPackages/song-list/song-list?pid=${targetId}`
				})
			} else if (targetType === 10) {
				// 新碟首发  数字专辑
				uni.navigateTo({
					url: `/subPackages/song-list/song-list?pid=${targetId}&isAlbum=${true}`
				})
			}
		}
	};

	// 获取推荐歌单
	const playList = shallowRef([])
	const getPlaylist = async () => {
		const { result = [] } = await store.dispatch('getInfo', { path: `/personalized?limit=10` })
		playList.value = computedPlayCount({ list: result })
		// console.log(result)
	}

	// 新歌推荐
	const newSongList = ref([])
	const getNewSongsList = async () => {
		const { result } = await store.dispatch('getInfo', { path: '/personalized/newsong?limit=5' })
		newSongList.value = loopAdd({ list: result, singerName: 'artists', nest: 'song', reName: 'artist' })
		// console.log(newSongList.value, result);
	}

	// 榜单热门
	const topList = shallowRef([])
	const getTopList = async () => {
		const { list = [] } = await store.dispatch('getInfo', { path: '/toplist/detail' })
		const newList = list.filter(item => {
			return !!item.ToplistType
		})
		topList.value = newList
		// console.log(list, newList);
	}

	// 获取热门歌手
	const hotSingerList = shallowRef([])
	const getHotSinger = async () => {
		const { artists = [] } = await store.dispatch('getInfo', { path: '/top/artists?limit=8' })
		hotSingerList.value = artists
		// console.log(artists);
	}

	// 让拖动那一项，最靠前 z-index 最大
	const activeIndex = ref(1)
	const movableChange = (index) => {
		if (index !== activeIndex.value) {
			activeIndex.value = index
		}
	}

	// 独家放送
	const personalizedList = shallowRef([])
	const getPersonalizedList = async () => {
		const { result } = await store.dispatch('getInfo', { path: '/personalized/privatecontent/list?limit=4' })
		personalizedList.value = result
		// console.log(res);
	}

	// 推荐mv
	const recommendMvList = shallowRef([])
	const getRecommendMvList = async () => {
		const { result = [] } = await store.dispatch('getInfo', { path: '/personalized/mv' })
		recommendMvList.value = computedPlayCount({ list: result })
		// console.log(result);
	}

	const daily = ref(0) // 今天日期
	const movableList = ref([]) // 存储每个movable-view的坐标

	const movableRef = ref()
	const loadMore = ref(false)
	const scrollTopInfo = async (e) => {
		const { detail: { scrollTop } } = e
		
		if (scrollTop > 0 && hotSingerList.value.length === 0) {
			if(loadMore.value)return
			loadMore.value = true
			await getHotSinger()
			 getNewSongsList()
			 getTopList()
			if (movableList.value.length === 0) {
				const { offsetWidth, offsetHeight } = movableRef.value.$el
				movableList.value = sortPosition({
					width: offsetWidth,
					height: offsetHeight,
					gutter: 5,
					domSize: 50,
					num: 8
				})
			}
			loadMore.value = false
		}

		const len = personalizedList.value.length
		if (scrollTop >= 100 && len === 0) {
			if(loadMore.value)return
			loadMore.value = true
			await getPersonalizedList()
			getRecommendMvList()
			loadMore.value = false
		}
	}

	onMounted(() => {
		const { platform, screenWidth } = uni.getSystemInfoSync();
		if (platform === "ios") {
			phoneType.value = 2;
		} else {
			phoneType.value = 1;
		}
		// 图片等比高度
		imgHeight.value = (screenWidth / 1080) * 420 + "px";
		//当前几号（日期）
		daily.value = new Date().getDate()

		getBannerList();
		getPlaylist()
		// getTopList()

		// getHotSinger()
		// getVideoCategoryList()
		// getRecommendMvList()
		// console.log(movableRef.value.$el.offsetWidth);
		// const { offsetWidth, offsetHeight } = movableRef.value.$el
		// movableList.value = sortPosition({
		// 	width: offsetWidth,
		// 	height: offsetHeight,
		// 	gutter: 5,
		// 	domSize: 50,
		// 	num: 8
		// })
	});
</script>

<style lang="scss" scoped>
	view.home-container {
		height: calc(100% - 100rpx);
		overflow: scroll;

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

					text.placeholder {
						color: $holderColor;
					}
				}
			}
		} 

		// 内容区域
		scroll-view.home-content {
			height: calc(100% - 100rpx);
			// background: #00f;
			// height: 100%;
			// 轮播图
			.swiper-container {
				.swiper-item {
					.pic {
						width: 100%;
						height: 100%;
					}
				}
			}

			view.other {
				padding: 10rpx 20rpx;

				// 每日推荐  。。。。
				view.list-container {
					margin: 10px 0;
					@include flex(space-between, center);
					padding: 10rpx 20rpx;

					view.item {
						width: 20%;
						padding-bottom: 20%;
						height: 0;
						position: relative;

						view.item-c {
							@include flex(space-around, center);
							flex-direction: column;
							height: 100%;
							position: absolute;
							width: 100%;

							view.iconfont {
								background: $bgColor;
								border-radius: 10rpx;
								padding: 2rpx 4rpx;
								height: 80rpx;
								width: 80rpx;
								color: #fff;
								@include flex(center, center);

								&.icon-daily {
									position: relative;
									font-size: 80rpx;

									text.date {
										position: absolute;
										transform: translate(0, 6 rpx);
										font-size: 28rpx;
										font-weight: bold;
									}
								}

								&:not(.icon-daily) {
									font-size: 60rpx;
								}

								&.icon-songlist {
									font-size: 50rpx;
									font-weight: bolder;
								}
							}

							view.txt {
								font-size: 30rpx;
							}
						}
					}

					// flex-direction: row;
				}

				// 推荐歌单 
				view.recommend-playlist {
					// background: $_bgColor;
					// padding: 10rpx;
					// border-radius: 5rpx;

					.scroll-container {
						white-space: nowrap;
						margin-top: 10rpx;

						.scroll-item {
							display: inline-block;
						}
					}
				}

				view.new-song {
					view.new-song-content {
						:deep(.music-list-table) {
							height: 600rpx;
						}
					}
				}

				// 排行榜
				view.ranking-list {

					swiper {
						height: 200rpx;
						margin-top: 20rpx;

						swiper-item {
							// @include flex(flex-start, center);
							display: flex;

							image {
								flex: 0 0 auto;
								height: 200rpx;
								width: 200rpx;
								border-radius: 10rpx;
							}

							view.s-item {
								margin-left: 10rpx;
								@include flex(space-between, flex-start);
								flex-direction: column;
								width: calc(95% - 230rpx);

								view.item {
									margin-bottom: 20rpx;
									width: 100%;
									@include flex(flex-start, center);

									text.singer {
										flex: 1 1 auto;
										color: $singerColor;
										font-size: 26rpx;
									}
								}
							}
						}
					}
				}

				// 热门歌手
				view.hot-singer {
					height: 400rpx;

					movable-area {
						height: 350rpx;
						width: 100%;
						background: linear-gradient(rgba(0, 100, 100, 0.2) 0%, rgba(100, 100, 100, 0.1) 100%);
						border-radius: 5rpx;
						margin-top: 15rpx;

						movable-view.movable-item {
							margin-top: 15rpx;
							height: 100rpx;
							border: 1rpx solid #eee;
							width: 100rpx;

							image.s-pic {
								height: 100%;
								width: 100%;
								border-radius: 10rpx;
							}
						}
					}
				}

				// 独家放送
				view.personalized {

					view.personalized-content {
						@include flex(space-between, center);
						flex-wrap: wrap;
					}
				}

				view.recommend-mv {

					view.mv-content {
						@include flex(space-between, center);
						flex-wrap: wrap;
					}
				}

			}

		}
	}
</style>
