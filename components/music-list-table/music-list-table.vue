<template>
	<view class='music-list-table'>
		<u-list class='music-list'>
			<u-list-item class='list-item' v-for='(item,index) in showMusicList' :key='item.id'
			@click='playMusic(index)' :class='{currentActive:index===currentIndex}'
			>
				<u-cell v-if='showImage'>
					<template #icon>
						<u-avatar shape="square" size="45" :src='item.picUrl||item.al.picUrl'>
						</u-avatar>
					</template>
				</u-cell>
				<view class="music-info" :class="{bespread:!showOther}">
					<view class="name overflow" >
						<text class='name'>{{item.name}} </text>
						<text class='singer overflow' v-if='!showOther'> &nbsp; - &nbsp; {{item._singer || item.artist}}</text>
					</view>
					<view class="singer" v-if="showOther">
						<view class="icon icons" v-if='item.originCoverType===1&&showOther'>
							原唱
						</view>
						<view class="hi-res icons" v-if='item.privilege&&item.privilege.playMaxBrLevel==="hires"&&showOther'>
							Hi-Res
						</view>
						<view class="hi-res icons sq" v-else-if='item.sq&&showOther'>
							SQ
						</view>
						<text class='singer' v-if="showOther" :class="{overflow:!(item.al&&item.al.name)}">{{item._singer }} </text>
						<text class='al overflow' v-if='item.al&&item.al.name&&showOther'>-{{item.name}}</text>
					</view>
					<view class="alias sColor overflow" v-if='item.alia&&item.alia.length>0 && showOther'>
						{{item.alia[0]}}
					</view>
				</view>
				<view class="video-icon icons" v-if='(item.mv||item.mvid)&&showOther' @click.stop="linkToVideoDetail(item)">
					<view class='iconfont icon-play' ></view>
				</view>
			</u-list-item>
		</u-list>
	</view>
</template>

<script setup>
	import { ref,watch,watchEffect,onMounted, computed } from 'vue'
	import { loopAdd, playAndCommit } from '@/utils/plugins.js'
	import { useStore } from 'vuex'

	const props = defineProps({
		musicList: {
			type: Array,
			default: () => []
		},
		// 展示图片
		showImage: {
			type: Boolean,
			default: true
		},
		// 展示其他 
		showOther:{
			type:Boolean,
			default:true
		}
	})
	const showMusicList = ref([])
	watch(() => props.musicList, (list) => {
		if (list.length === 0) return
		showMusicList.value = loopAdd({
			list: uni.$u.deepClone(list)
		})
	}, { immediate: true, deep: true})
	
	const store = useStore()
	// 寻找当前播放数组中第几项活跃
	const currentIndex = computed(()=>{
		return  store.getters.findCurrentPlayIndex(showMusicList.value)
	})
	
	const playMusic= (index)=>{
		playAndCommit({musicList:showMusicList.value,index})
	}
	
// 视频页面跳转
	const linkToVideoDetail = (item) => {
		const { mv,  mvid } = item
		const vid = mv || mvid
		uni.navigateTo({
			url: `/subPackages/video-detail/video-detail?vid=${vid}`,
		});
	}
</script>

<style lang="scss">
	.icons {
		flex: 0 0 auto;
	}

	view.music-list-table {
		.u-list.music-list {
			.u-list-item.list-item {
				flex-direction: row;
				padding: 10rpx 15rpx;
				box-sizing: border-box;
				margin-top: 10rpx;
				&.currentActive{
					background: rgba(255, 100, 0, 0.3);
				}
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
					max-width: calc(100% - 200rpx);
					overflow: hidden;
					&.bespread{
						width: 100% !important;
						max-width: 100%;
						@include flex(flex-start,center);
						flex-direction: row;
					}
					view.name {
						flex: 0 0 auto;
						width: 100%;
						text.singer{
							font-size: 26rpx;
							color: $singerColor;
						}
					}

					view.singer,
					view.alias {
						font-size: 24rpx;
					}

					view.singer {
						@include flex(flex-start, center);
						color: $singerColor;
						flex: 0 0 auto;
						width: 100%;
						view.icon {
							padding: 2rpx 6rpx;
							box-sizing: border-box;
							background: $bgColor;
							border-radius: 5rpx;
							transform: scale(0.8);
							color: #fff;
						}

						view.hi-res {
							color: $bgColor;
							border: 1rpx solid $bgColor;
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
							flex:  0 0 auto;
							white-space: nowrap;
						}
						text.al{
							flex: 1 1 auto;
							text-overflow: ellipsis;
							overflow: hidden;
						}

					}


				}

				view.video-icon {
					flex: 0 0 auto;
					width: 80rpx;
					@include flex(center, center);
					view.iconfont{
						font-size: 28rpx;
						border: 1px solid #aaa;
						border-radius: 10rpx;
						padding: 0 4rpx;
						color: #888;
					}
				}
			}
		}
	}
</style>
