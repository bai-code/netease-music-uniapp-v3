<template>
	<view class='music-list-table'>
		<u-list class='music-list'>
			<u-list-item class='list-item' v-for='(item,index) in showMusicList' :key='item.id'>
				<u-cell>
					<!-- {{index+1}} -->
					<template #icon>
						<u-avatar shape="square" size="45" :src='item.al.picUrl'>
						</u-avatar>
					</template>
				</u-cell>
				<view class="music-info" >
					<view class="name overflow">
						{{item.name}}
					</view>
					<view class="singer">
						<view class="icon icons" v-if='item.originCoverType===1'>
							原唱
						</view>
						<view class="hi-res icons" v-if='item.privilege&&item.privilege.playMaxBrLevel==="hires"'>
							Hi-Res
						</view>
						<view class="hi-res icons sq" v-else-if='item.sq'>
							SQ
						</view>
						<text class='singer' :class="{overflow:!(item.al&&item.al.name)}">{{item._singer }} </text>
						<text class='al overflow' v-if='item.al&&item.al.name'>-{{item.name}}</text>
					</view>
					<view class="alias sColor overflow" v-if='item.alia.length>0'>
						{{item.alia[0]}}
					</view>
				</view>
				<view class="video-icon icons" v-if='item.mv||item.mvid'>
					<uni-icons type='videocam' size='30' @click="linkToVideoDetail(item.item)"></uni-icons>
				</view>
			</u-list-item>
		</u-list>
	</view>
</template>

<script setup>
	import {
		ref,
		watch,
		watchEffect,
		onMounted
	} from 'vue'
	import {
		loopAdd
	} from '@/utils/plugins.js'
	import {
		useStore
	} from 'vuex'

	const props = defineProps({
		musicList: {
			type: Array,
			default: () => []
		},
		isShowImage: {
			type: Boolean,
			default: false
		}
	})
	const showMusicList = ref([])
	watch(() => props.musicList, (list) => {
		if (list.length === 0) return
		showMusicList.value = loopAdd({
			list: uni.$u.deepClone(list)
		})
	}, {
		immediate: true,
		deep: true
	})

	const linkToVideoDetail =(item)=>{
		const { mv , mvid} = item
		const vid = mv || mvid
		uni.navigateTo({
			url: `/subPackages/video-detail/video-detail?vid=${vid}`,
		});
	}
</script>

<style lang="scss">
	.icons{
		flex: 0 0 auto;
	}
	view.music-list-table {
		.u-list.music-list {
			.u-list-item.list-item {
				flex-direction: row;
				padding: 10rpx 15rpx;
				box-sizing: border-box;
				margin-top: 10rpx;
				.u-cell {
					:deep(.u-cell__body) {
						padding: 0;

						.u-avatar {
							box-shadow: 0rpx 0 5rpx #aaa;
						}
					}
				}

				view.music-info {
					@include flex(space-between, flex-start);
					flex-direction: column;
					flex: 1 1 auto;
					max-width: calc(100% - 180rpx);
					overflow: hidden;
					view.name {
						flex: 0 0 auto;
					}

					view.singer,
					view.alias {
						font-size: 24rpx;
					}

					view.singer {
						@include flex(flex-start, center);
						color: $singerColor;
						view.icon {
							padding: 2rpx 6rpx;
							box-sizing: border-box;
							// display: inline-block;
							background: $bgColor;
							border-radius: 5rpx;
							transform: scale(0.8);
							color: #fff;
						}

						view.hi-res {
							color: $bgColor;
							border: 1rpx solid $bgColor;
							// display: inline-block;
							transform: scale(0.8);
							border-radius: 5rpx;
							padding: 0 6rpx;
							box-sizing: border-box;

							&.sq {
								letter-spacing: 4rpx;
								padding: 0rpx;
								box-sizing: border-box;
							}
						}

						text.singer {
							flex: 1 1 auto;
							// overflow: hidden;
							white-space: nowrap;
						}

					}


				}

				view.video-icon {
					flex: 0 0 auto;
					width: 80rpx;
					@include flex(center,center);
				}
			}
		}
	}
</style>
