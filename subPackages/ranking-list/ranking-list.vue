<template>
	<view class="ranking-list">
		<scroll-view scroll-y="true" class="ranking-container">
			<view class="ranking-c">
				<!-- 主要榜单 -->
				<view class="container" v-if="mainRankingList.length>0">
					<view class="title">官方榜单</view>
					<view class="item" v-for='list in mainRankingList' :key="list.id">
						<view class="image" @click="linkToMusicDetail(list.id)">
							<image :src="list.coverImgUrl" mode="scaleToFill"></image>
						</view>
						<view class="music-list">
							<view :class="['music-item', { active:currentId===i.id }]" v-for="(i,index) in list.tracks.slice(0,5)"
							 @click="playMusic(list.tracks.slice(0,5),index)">
								<text :class="[{top:index<3}, 'index']">{{index + 1}}  </text>
								<view class="info">
									<text class="name overflow">&nbsp;. {{ i.name }}</text>
									<text :class="['singer','overflow', {active:currentId===i.id}]">{{ i._singer }}</text>
								</view>
							</view>
							<view class="view-more" @click="linkToMusicDetail(list.id)">
								<text>查看更多</text>
								<text class="iconfont icon-right"></text>
							</view>
						</view>
					</view>
				</view>
				
				<!-- 次要榜单 -->
				<view class="container" v-if="rankingList.length>0&&mainRankingList.length>0">
					<view class="title">
						全球榜单
					</view>
					<view class="playlist">
						<view class="playlist-item" v-for="item in rankingList" :key="item.id"
						 @click="linkToMusicDetail(item.id)">
								<view class="image">
									<image :src="item.coverImgUrl" mode="scaleToFill"></image>
								</view>
								<view class="name">
									{{ item.name }}
								</view>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script setup>
	import  { computed, reactive, ref } from 'vue'
	import { useStore } from  'vuex'
	import { loopAdd, playAndCommit } from '@/utils/plugins.js'
	
	const store = useStore()
	
	const mainRankingList = computed(()=>{
		return store.state.rankingInfo.mainRankingList 
	})
	
	const rankingList = computed(()=>{
		return store.state.rankingInfo.rankingList
	})
	
	// 播放单曲
	const playMusic = (list,index) => {
		console.log(list,index);
		playAndCommit({ musicList:list,index })
	}
	
	// 跳转榜单页面
	const linkToMusicDetail = (id) => {
		uni.navigateTo({
			url:`/subPackages/playlist-detail/playlist-detail?pid=${id}`
		})
	}
	
	// 标记播放歌曲
	const currentId = computed(()=>{
		return store.state.musicInfo.id
	})
	
	// onMounted(()=>{
	// 	getRankingList()
	// })
	
</script>

<style lang="scss" scoped>
	view.ranking-list{
		height: 100%;
		.ranking-container{
			height: 100%;
			padding: 10rpx;
			box-sizing: border-box;
			view.ranking-c{
				view.title{
					font-weight: bolder;
					font-size: 40rpx;
					margin: 20rpx 0;
				}
				// 主要榜单
				view.item{
					margin-bottom: 80rpx;
					background: rgba(150,150,150,0.1);
					padding: 20rpx 10rpx;
					// box-sizing: border-box;
					font-size: 26rpx;
					border-radius: 10rpx;
					height: 300rpx;
					@include flex(flex-start,flex-start);
					view.image{
						height: 300rpx;
						width: 300rpx;
						image{
							height: inherit;
							width: inherit;
							border-radius: 10rpx;
						}
					}
					view.music-list{
						flex: 0 0 auto;
						padding-left: 15rpx;
						width: calc(100% - 300rpx);
						height: 100%;
						view.music-item{
							// margin-bottom: 22rpx;
							@include flex(flex-start,center);
							height: 20%;
							width: calc(100% - 10rpx);
							color: $lightFontColor;
							&.active{
								color: $bgColor;
							}
							text.index.top{
								color: $bgColor;
								flex: 0 0 auto;
							}
							view.info{
								@include flex(space-between,center);
								flex: 1 1 auto;
								width: 100%;
								text.name{
									flex: 0 0 auto;
									max-width: 55%;
								}
								text.singer{
									font-size: 24rpx;
									flex: 0 0 auto;
									max-width: 45%;
									min-width: 20%;
									white-space: nowrap;
									color: #bbb;
									&.active{
										color: $bgColor;
									}
								}
							}
						}
						view.view-more{
							margin-top: 20rpx;
							@include flex(flex-end,center);
							align-self: flex-end;
							letter-spacing: 2rpx;
							color: #aaa;
						}
					}
					
				}
				
				// 次要榜单
				
				view.playlist{
					@include flex(flex-start,flex-start);
					flex-wrap: wrap;
					view.playlist-item{
							margin-bottom: 30rpx;
							width: 33%;
							@include flex(flex-start,center);
							flex-direction: column;
						view.image{
							position: relative;
							height: 0;
							width: 100%;
							padding-bottom: 100%;
							// @include flex(center,center);
							image{
								position: absolute;
								height: 95%;
								width: 95%;
								border-radius: 10rpx;
								left: 50%;
								transform: translateX(-50%);
							}
						}
						view.name{
							@include overflowMul(2);
							width: 90%;
							font-size: 28rpx;
						}
					}
				}
			}
		}
	}
</style>
