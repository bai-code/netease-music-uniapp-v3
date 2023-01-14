<template>
	<view class="singer-detail" >
		<scroll-view scroll-y="true" class="singer-content" @scrolltolower="scrollToBottom" :lower-threshold='100'
			@scroll='scrollEvent' :scroll-top='scrollTopDistance' enable-back-to-top scroll-with-animation>
			<view class="detail-info" v-if="singerDetail.artist">
				<view class="image">
					<image :src="singerDetail.user&&singerDetail.user.avatarUrl || singerDetail.artist.cover" mode="scaleToFill"></image>
				</view>
				<view class="info">
					<view class="nickname">
						{{ singerDetail.artist.name }}
					</view>
					<view class="alias gutter" v-if="singerDetail.artist.alias">
						{{singerDetail.artist.alias[0]}}
					</view>
					<view class="function gutter">
						<view class="personal-homepage" @click="linkToPersonalHomepage">
							<text class="iconfont icon-personal"></text>
							<text>个人主页</text>
						</view>
					</view>
					<view class="other gutter">
						<view class="single-music gutter">
							<text>单曲数: </text>
							<text>{{singerDetail.artist.musicSize}}</text>
						</view>
						<view class="album gutter">
							<text>专辑数: </text>
							<text> {{ singerDetail.artist.albumSize}}</text>
						</view>
						<view class="mv gutter">
							<text>MV数: </text>
							<text>{{singerDetail.artist.mvSize}}</text>
						</view>
					</view>
				</view>
			</view>
			<!-- 选项 -->
			<view class="singer-description" v-if="singerDetail.artist">
				<view class="cmp-title">
					<view :class="['cmp-item', { active:selectCmpIndex===index }]" v-for="(item,index) in cmpList"
						:key="item.id" @click="changeCmp(index)">{{item.text}}</view>
				</view>
				<keep-alive>
					<component :is='cmpList[selectCmpIndex].cmp' ref='cmpRef' :singerId='singerId'></component>
				</keep-alive>
			</view>
			<!-- 回到顶部 -->
			<transition name="scroll">
				<view class="back-top" @click="scrollToTop" v-if="isShowBackTop">
					<text class="iconfont icon-back-top"></text>
				</view>
			</transition>
			<u-loading-icon text="加载中" textSize="18" v-if="isLoading"></u-loading-icon>
		</scroll-view>
	</view>

</template>

<script setup>
	import { ref, shallowReadonly } from 'vue'
	import { onLoad, onPageScroll } from '@dcloudio/uni-app'
	import { useStore } from 'vuex';
	import SingerAlbum from './singer-album.vue'
	import SingerMv from './singer-mv.vue'
	import SingerDescription from './singer-description.vue'
	import SingerSimilar from './singer-similar.vue'

	const store = useStore()
	const singerId = ref(0) //歌手id

	const cmpRef = ref() // 组件对象

	//动态组件列表
	const cmpList = shallowReadonly([{
		id: 0,
		text: '专辑',
		cmp: SingerAlbum
	}, {
		id: 1,
		text: 'MV',
		cmp: SingerMv
	}, {
		id: 2,
		text: '歌手详情',
		cmp: SingerDescription
	}, {
		id: 3,
		text: '相似歌手',
		cmp: SingerSimilar
	}, ])
	const selectCmpIndex = ref(0) //当前选中第几个动态组件



	// 获取歌手信息
	const singerDetail = ref({})
	const getSingerDetail = async (id) => {
		const { data = {} } = await store.dispatch('getInfo', { path: `/artist/detail?id=${id}` })
		singerDetail.value = data
	}

	// 跳转到个人主页
	const linkToPersonalHomepage = () => {
		uni.showToast({
			title: '建设中...',
			icon: 'none'
		})
	}

	// 触底事件
	const isLoading = ref(false)
	const scrollToBottom = () => {
		isLoading.value = true
		if(cmpRef.value.loadMore){
			cmpRef.value.loadMore()
			isLoading.value = true
		} else {
			isLoading.value = false
		}
	}

	// 切换动态组件
	const changeCmp = (index) => {
		selectCmpIndex.value = index
	}


	const scrollTopDistance = ref(0) // 距离顶部距离
	const isShowBackTop = ref(false) // 是否显示返回顶部
	// scroll-view 滚动事件  
	// 只有改变了scrollTop 回到顶部再次改变才有效果
	const scrollEvent = (e) => {
		const { scrollTop } = e.detail
		if (scrollTop >= 600) {
			isShowBackTop.value = true
		} else {
			isShowBackTop.value = false
		}
		scrollTopDistance.value = scrollTop
	}

	// 回到顶部事件
	const scrollToTop = () => {
		scrollTopDistance.value = 0
	}

	

	onLoad((options) => {
		getSingerDetail(options.id)
		singerId.value = options.id
	})
</script>

<style lang="scss">
	view.singer-detail {
		padding: 10rpx 15rpx 20rpx 15rpx;
		box-sizing: border-box;
		height: 100%;

		.singer-content {
			height: 100%;
			position: relative;

			// 歌手详情
			view.detail-info {
				@include flex(space-between, center);
				width: 100%;
				// height: 240rpx;
				padding: 20rpx 0;
				box-sizing: border-box;

				view.gutter {
					margin-top: 20rpx;
				}

				view.image {
					height: 49vw;
					width: 49%;
					flex: 0 0 auto;

					image {
						height: 100%;
						width: 100%;
						border-radius: 10rpx;
					}
				}

				view.info {
					width: 49%;
					flex: 0 0 auto;
					height: 49vw;

					view.nickname {
						font-size: 40rpx;
						font-weight: bolder;
					}

					view.function {
						view.personal-homepage {
							border-radius: 30rpx;
							font-size: 28rpx;
							border: 2rpx solid #888;
							padding: 5rpx 25rpx;
							display: inline-block;

							text.iconfont {
								margin-right: 5rpx;
							}
						}
					}
				}
			}

			// 其他
			view.singer-description {
				view.cmp-title {
					@include flex(flex-start, flex-end);

					view.cmp-item {
						padding: 10rpx 20rpx;
						font-size: 32rpx;

						&.active {
							font-size: 40rpx;
							font-weight: bold;
							position: relative;

							&::after {
								content: '';
								position: absolute;
								width: 100%;
								left: 50%;
								height: 4rpx;
								width: 80%;
								background: $bgColor;
								bottom: 0;
								transform: translateX(-50%);

							}
						}
					}
				}
			}

			view.back-top {
				position: fixed;
				width: 80rpx;
				height: 80rpx;
				bottom: 80rpx;
				right: 80rpx;
				border-radius: 20rpx;
				box-shadow: 0 0 5rpx #ccc;
				background: rgba(200, 200, 200, 0.8);
				@include flex(center, center);

				text.iconfont {
					font-size: 50rpx;
					color: $bgColor;
				}
			}
		}
	}
</style>
