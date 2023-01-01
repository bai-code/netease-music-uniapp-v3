<template>
	<view class="comment" v-if="commentInfo.user">
		<view class="comment-left">
			<image lazy-load :src="commentInfo.user.avatarUrl" mode="scaleToFill"></image>
		</view>
		<view class="comment-right">
			<view class="publish-user overflow">
				{{commentInfo.user.nickname}}
			</view>
			<view class="reply-txt">
				{{ commentInfo.content}}
			</view>
			<!-- 回复 -->
			<view class="reply" v-if="commentInfo.beReplied.length>0">
				<view class="commentInfo-reply" v-for="(com,index) in commentInfo.beReplied">
					<view class="reply-image">
						<image lazy-load :src="com.user.avatarUrl" mode="scaleToFill"></image>
					</view>
					<view class="reply-content">
						<view class="user overflow">{{ com.user.nickname }}</view>
						<view class="reply-txt">
							{{ com.content }}
						</view>
						<u-line v-if="index!=commentInfo.beReplied.length-1"></u-line>
					</view>
				</view>
			</view>
			<view class="other">
				<text class="time">{{ commentInfo.timeStr }}</text>
				<view class="like" @click="isLiked(commentInfo.liked)">
					<text class="iconfont icon-like_active" v-if="commentInfo.liked"></text>
					<text class="iconfont icon-like" v-else></text>
					<text class="count">{{ computedCount(commentInfo.likedCount) }}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import { computedCount } from '@/utils/plugins.js'
	import { useStore } from 'vuex'
	
	const store = useStore()
	
	const props = defineProps({
		commentInfo: {
			type:Object,
			default:()=>{
				return {}
			}
		},
		typeId:{
			type:String,
			default:''
		},
		typeKind:{
			// 种类
			type:String,
			default:'mv'
		}
	})
	
	// const getThreadId = async () => {
	// 	const res = await store.dispatch('getInfo', { path:'/event' })
	// 	console.log(res);
	// }
	
	const isLiked = (liked) => {
		const { typeId, commentInfo:{commentId}, typeKind } = props
		const _liked = liked?1:0
			uni.showToast({
				title:'暂未实现',
				icon:'error'
			})
			
			
		// }
		// getThreadId()
		
	}
	
	
</script>

<style lang="scss" scoped>
	$imageHeight: 70rpx;

	view.reply-txt {
		font-size: 26rpx;
		min-height: 26rpx;
	}
	
	

	view.comment {
		@include flex(space-between, flex-start);
		margin-top: 30rpx;

		view.comment-left {
			width: $imageHeight;
			flex: 0 0 auto;

			image {
				width: inherit;
				height: $imageHeight;
				border-radius: 50%;
			}
		}

		view.comment-right {
			padding-left: 10rpx;
			width: calc(100% - $imageHeight - 10rpx);
			min-height: 150rpx;
			color: $lightFontColor;
			font-size: 30rpx;

			view.publish-user {
				height: $imageHeight;
				line-height: $imageHeight;
				box-sizing: border-box;
				color: $userColor;
			}

			view.reply {
				margin-top: 20rpx;
				padding: 20rpx;
				box-sizing: border-box;
				background: rgba(100, 100, 100, 0.1);
				border-radius: 5rpx;

				view.commentInfo-reply {
					@include flex(space-between, flex-start);

					view.reply-image {
						flex: 0 0 auto;
						width: $imageHeight;

						&>image {
							height: $imageHeight;
							width: $imageHeight;
							border-radius: 50%;
						}
					}

					view.reply-content {

						width: calc(100% - $imageHeight - 10rpx);

						view.user {
							color: $userColor;
							height: $imageHeight;
							line-height: $imageHeight;
						}


					}
				}
			}
			
			view.other{
				@include flex(space-between, center);
				height: 50rpx;
				margin-top: 30rpx;
				&>text.time{
					font-size: 24rpx;
				}
				view.like{
					text.count{
						margin-left: 10rpx;
					}
				}
			}
		}
	}
</style>
