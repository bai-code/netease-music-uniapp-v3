<template>
	<view class="video-detail">
		<view class="video">
			<video :src="mvDetail.src"></video>
		</view>

		<scroll-view class="video-content" scroll-y :lower-threshold="200" @scrolltolower="scrollToBottom">

			<view class="">
				<view class="info" v-if="mvDetail.artists">
					<image :src="mvDetail.artists[0].img1v1Url" mode=""></image>
					<view class="title overflow">
						{{mvDetail.artists[0].name}}
					</view>
				</view>
				<view class="desc">
					{{mvDetail.name}}
				</view>
				<view class="time">
					<view class="publish-time">
						<text>发布时间 :</text>
						<text class="time">{{mvDetail.publishTime }}</text>
					</view>
				</view>

				<view class="comment-container">
					<view class="hot-comment" v-if="hotCommentList.length">
						<view class="comment-title show-txt">
							热门评论
						</view>
						<view class="comment">
							<comment v-for='comment in hotCommentList' :key="comment.id" :commentInfo='comment' />
						</view>
						<view class="has-more" v-if="hasMoreHot" @click="scrollToBottom(mvId)">
							<text>加载更多</text>
							<text class="iconfont icon-right"></text>
						</view>
					</view>
					<view class="hot-comment" v-if="commentList.length">
						<view class="comment-title show-txt">
							精彩评论
						</view>
						<view class="comment">
							<comment v-for='comment in commentList' :key="comment.id" :commentInfo='comment' />
						</view>
					</view>
					<view class="empty show-txt" v-if="!hotCommentList.length&&!commentList.length&&!isLoading">
						暂无评论
					</view>
					<view class="loading" v-if="isLoading">
						<u-loading-icon></u-loading-icon>
					</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script setup>
	import { onLoad } from '@dcloudio/uni-app'
	import { useStore } from 'vuex'
	import { ref } from 'vue'

	const store = useStore()
	// const isPlay = ref(false)
	const mvDetail = ref({}) // mv信息
	const _id = ref(0)  // 视频id
	const isLoading = ref(false) // 是否加载中
	const isFirstEnter = ref(false) // 是否第一次进入

	const getMvSrc = async (id) => {
		const { data = {} } = await store.dispatch('getInfo', { path: `/mv/url?id=${id}` })
		mvDetail.value.src = data.url
	}

	const getMvDetail = async (id) => {
		const { data = {} } = await store.dispatch('getInfo', { path: `/mv/detail?mvid=${id}` })
		Object.assign(mvDetail.value, data)
	}

	const hotCommentList = ref([]) //精彩评论
	const commentList = ref([]) //普通评论
	const hasMore = ref(false)
	const hasMoreHot = ref(false) //是否还有热评
	const getMvCommentList = async (id) => {
		const len = commentList.value.length
		const { comments = [], hotComments = [], more = false, moreHot = false } = await store.dispatch(
			'getInfo', { path: `/comment/mv?id=${id}&offset=${len}` })
		if (hotComments.length > 0) {
			hotCommentList.value.push(...hotComments)
		}
		commentList.value.push(...comments)
		hasMore.value = more
		hasMoreHot.value = moreHot
		isLoading.value = false
		console.log(comments);
	}

	const scrollToBottom = () => {
		if (!hasMore.value) return
		getMvCommentList(mvId.value)
	}

	onLoad((options) => {
		const { mvId, vid } = options
		_id.value = mvId || vid
		if (_id.value) {
			isLoading.value = true
			getMvDetail(_id.value)
			getMvSrc(_id.value)
			getMvCommentList(_id.value)
		}
	})
</script>

<style lang="scss" scoped>
	view.video-detail {
		height: 100%;

		view.video {
			height: 440rpx;
			width: 100%;

			&>video {
				height: 100%;
				width: 100%;
			}
		}

		.video-content {
			height: calc(100% - 440rpx);
			padding: 20rpx;
			box-sizing: border-box;

			view.info {
				@include flex(flex-start, center);

				&>image {
					height: 100rpx;
					width: 100rpx;
					border-radius: 50%;
				}

				view.title {
					margin-left: 20rpx;
				}

			}

			view.desc {
				font-size: 40rpx;
				font-weight: bolder;
				@include overflowMul(2);
				padding: 15rpx 0;
			}

			view.publish-time {
				font-size: 26rpx;
				color: $lightFontColor;
				padding: 15rpx 0;

				text.time {
					margin-left: 20rpx;
				}
			}
		}

		view.comment-container {
			view.show-txt {
				font-size: 40rpx;
				font-weight: bolder;
				margin-top: 30rpx;
			}

			view.has-more {
				text-align: end;
				color: $userColor;
				font-size: 26rpx;
			}

			view.empty {
				height: 300rpx;
				text-align: center;
				line-height: 300rpx;
				font-size: 40rpx;
				color: #ccc;
			}
		}
	}
</style>
