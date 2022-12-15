<template>
	<view class='container' >
		<view class="image-fill"  v-if="swiperMusicList[swiperCurrent]"
		:style='{backgroundImage:`url(${swiperMusicList[swiperCurrent].picUrl})`}'>
			<!-- 模糊背景图 -->
		</view>
		<swiper scroll-x='true' class="swiper" @change="swiperChange" 
		:current="swiperCurrent" circular>
			<swiper-item class="item" v-for="item in swiperMusicList" 
			:key='item.id'>
				<view class="music-info">
					<view class="name">
						{{item.name}}
					</view>
					<view class="singer">
						{{item._singer}}
					</view>
				</view>
				<view class="content" v-show="!showLyric" @click="showLyric = true">
					<view class="needle" :style="{transform:`rotate(${needleDeg}deg) translateX(60rpx)`}"></view>
					<view class="disc">
						<view class="image" :style="{transform:`rotate(${discDeg}deg)`}">
							<image :src="item.picUrl" mode=""></image>
						</view>
					</view>
					
				</view>
				<view class="lyric content" v-show='item.lyricList' @click="showLyric = false ">
					<lyric-template :lyricList='lyricList' :lyricVersion='lyricVersion' />
				</view>
			</swiper-item>
		</swiper>
		
		<!--  控制区域 -->
		<view class="controls">
			<view class="progress">
				<view class="current-time time">
					{{ $store.getters.setCurrentTime }}
				</view>
				<view class="progress-content" @click='adjustProgress' ref='progressRef'>
					<u-line-progress  
					:percentage="setPrecentage" :showText="false" activeColor="#aaa"  height="10rpx">
					</u-line-progress>
					<view class="dot" :style="{left:setPrecentage / 100 * pw - 6  + 'px'}"
					 draggable ></view>
				</view>
				<view class="duration-time time">
					{{ $store.getters.setDurationTime }}
				</view>
			</view>
			<view class="control-panel">
				<view class="loop">\</view>
				<view class="control-content">
					<text class='iconfont icon-prev' @click="switchMusic('prev')"></text>
					<view class="play-pause">
						<text class="iconfont icon-pause" v-if='isPlay' @click="playMusic('pause')"></text>
						<text class="iconfont icon-play" v-else @click="playMusic('play')"></text>
					</view>
					<text class="iconfont icon-next" @click="switchMusic('next')"></text>
				</view>
				<view class="list">
					<toggle-spread-musicList  />
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {  computed, nextTick, ref, watch, onBeforeUnmount } from 'vue'
	import { useStore } from 'vuex'
import musicListTableVue from '../../components/music-list-table/music-list-table.vue';
	
	const timer = ref(null)
	const store = useStore()
	
	const needleDeg = ref(-30) // 拨杆旋转角度
	const discDeg = ref(0) //唱片旋转角度
	
	const musicInfo = computed(()=>{
		return store.state.musicInfo
	})
	const isPlay = computed(()=>{
		return store.state.isPlay
	})

	
	watch(isPlay,(flag)=>{
		if(flag){
			needleDeg.value = 10
			timer.value = setInterval(()=>{
				discDeg.value += 0.3
			},10)
		} else {
			needleDeg.value = -30
			clearInterval(timer.value)
		}
	}, { immediate:true })
	
	const setPrecentage = computed(()=>{
		return store.getters.setPrecentage
	})
	

	const progressRef = ref()
	const pw = ref(0)
	nextTick(()=>{
		pw.value = progressRef.value.$el.offsetWidth
	})
	
	// 点击进度条跳转进度
	const adjustProgress =(e)=>{
		const detail = e.detail.x - e.currentTarget.offsetLeft
		const val = Math.ceil((detail/pw.value)*100)
		store.commit('seekProgress',{ time:val })
	}
	

	
	const swiperMusicList = ref([]) // swiper切换数组
	const swiperCurrent = ref(0)  // swiper 当前第几项
	const oldCurrentIndex = ref(0) //对比上一曲or下一曲
	const showLyric = ref(false) // 是否展示歌词
	const lyricList = ref([])
	const isLock = ref(false) // 切换请求数据，防止卡顿滑多了几个
	const lyricVersion = ref(0) //0 = 普通  1 = 不随时间滚动 
	
	
	// 默认把各种信息 合并到swiperMusicList 中
	const mergeOfInfo = (...params) => {
		const item = swiperMusicList.value[swiperCurrent.value] || {}
		swiperMusicList.value[swiperCurrent.value] = Object.assign({}, item, ...params)
	}
	
	// 获取歌词
	const getLyric = async (id, picUrl)=>{
		const _id = id || musicInfo.value.id
		isLock.value = true
		lyricList.value = []
		const item = swiperMusicList.value[swiperCurrent.value]
		const _lyric = item&&item.lyricList || []
		if(_lyric.length>0){
			lyricList.value = _lyric
			isLock.value = false
			return 
		}
		const { lrc:{ lyric = '' } = {  } } = await store.dispatch('getInfo', { path:`/lyric?id=${ _id }` })
		if(!lyric){
			isLock.value = false
			return
		}
		if(lyric.indexOf('[')!==lyric.lastIndexOf('[')){
			lyricVersion.value = 0
			lyricList.value = lyric.split(/\[/g)
				.map((item) => {
					const text = item.split(/\..*\]/)
					  if (text[0] && text[1] && text[1] !== '\n'&&text[1].indexOf('：') === -1) {
						  text[1]=text[1].replace('\n','')
						return text
					  }
				})
				.filter((item) => {
				  // 处理歌词多处空格
				  return !!item
				})
		} else {
			lyricVersion.value = 1
			lyricList.value = lyric.split('\n')
		}
		mergeOfInfo({lyricList:lyricList.value})
		isLock.value = false
	}
	
	const playMusic = (params) =>{
		 if(params === 'play' || params === 'pause') {
			const isPlay = params==='play'?true:false
			store.commit('changePlayStatus', { isPlay })
		} else {
			const index = swiperCurrent.value
			store.dispatch('getMusicInfo',{ musicInfo:musicList.value[index], index })
			discDeg.value = 0
		}
	}
	
	watch(showLyric, (flag) => {
		if(flag){
			const { id } = musicInfo.value
			getLyric(id)
		}
	})
	
	// 侦听歌曲ID ，获取歌词
	watch(musicInfo,(info)=>{
		uni.$u.debounce(()=>{
			// 歌曲播放先把歌名，歌手传递给store中，页面及时渲染
			// 然后有个异步获取歌曲url也添加到musicInfo，触发两次
			// 防抖减少多余请求
			const { id, picUrl} = info
			if(!id)return
			mergeOfInfo({picUrl})
			if(showLyric.value){
				getLyric(id)
			}
		},500)
	},{ immediate:true,deep:true})
	
	// 歌曲左滑切换数组
	
	const musicList = computed(()=>{
		return store.state.musicList
	})
	
	watch(musicList,(list)=>{
		swiperMusicList.value = list.map(item=>{
			const { name, _singer, id } = item
			return {
				name,
				_singer,
				id
			}
		})
	},{immediate:true,deep:true})
	

	// 寻找播放第几项
	const playIndex = computed(()=>{
		return store.getters.findCurrentPlayIndex()
	})
	
	watch(playIndex,(index)=>{
		swiperCurrent.value = index
	} , { immediate:true })
	
	// swiper 滑动切换
	const swiperChange = (e,cur)=>{
		if(isLock.value)return
		const { current } = e.detail
		swiperCurrent.value = current
		const list = musicList.value
		if(playIndex.value === current + 1 || current + 1 > list.length - 1  ){
			playMusic()
		} else if(playIndex.value === current - 1 || current - 1 < 0 ){
			playMusic()
		}
	}
	// 控制区域 手动切换歌曲 
	const switchMusic = (params) => {
		let val = params==='next'?playIndex.value + 1 : playIndex.value - 1
		const len = musicList.value.length - 1
		if(val > len){
			val = 0
			
		}else if(val < 0) {
			val = len
		}
		swiperCurrent.value = val
	}
	
	onBeforeUnmount(()=>{
		clearInterval(timer.value)
	})
</script>

<style lang="scss" scoped>
view.container{
	height: 100%;
	overflow: hidden;
	position: relative;
	@include flex(space-between,center);
	flex-direction: column;
	box-sizing: border-box;
	view.image-fill{
		background-size:100% 100%;
		background-repeat:no-repeat;
		position: absolute;
		width: 100%;
		height: 100%;
		z-index: -1;
		filter: blur(200px);
	}
	.swiper{
		flex: 0 0 auto;
		width: 100%;
		height: calc(100% - 150rpx);
		.item{
			view.music-info{
				height: 180rpx;
				@include flex(space-evenly, center );
				flex-direction: column;
				view.singer{
					color: #666;
					font-size: 26rpx;
				}
			}
			view.content{
				height: calc(100% - 200rpx);
				padding: 30rpx;
				box-sizing: border-box;
				@include flex(center,center);
				position: relative;
				view.needle{
					background-image: url(~@/static/needle.png);
					background-size: 100% 100%;
					transform-origin:  92rpx 5rpx;
					width: 160rpx;
					height: 250rpx;
					position: absolute;
					top: 25rpx;
					z-index: 1;
					transition: all 0.5s;
					&::after{
						content: '';
						position: absolute;
						height: 55rpx;
						width: 55rpx;
						border-radius: 50%;
						background: #eaeaea;
						left: 4rpx;
						top: -25rpx;
						box-shadow: -5rpx 0 10rpx #aaa;
					}
				}
				view.disc{
					width: 80%;
					position: relative;
					height: 0;
					padding-bottom: 80%;
					view.image{
						position: absolute;
						height: 100%;
						width: 100%;
						background-image: url(~@/static/disc.png);
						background-size: 100% 100%;
						@include flex(center,center);
						image{
							height: 63%;
							width: 63%;
							border-radius: 50%;
						}
					}
				}
			}
		}
	}
	view.controls{
		height: 150rpx;
		width: 100%;
		padding: 0 20rpx;
		box-sizing: border-box;
		
		view.progress{
			height: 50rpx;
			// position: relative;
			@include flex(center,center);
			view.time{
				flex: 0 0 auto;
				font-size: 24rpx;
			}
			view.progress-content{
				position: relative;
				width: 100%;
				margin: 0 15rpx;
			    @include flex(flex-start,center);
				.u-line-progress{
					overflow: visible;
					padding: 0 15rpx;
					box-sizing: border-box;
					:deep(.u-line-progress__line){
						padding-left: 5px;
					}
					
				}
				view.dot{
					position: absolute;
					background: #fff;
					border-radius: 50%;
					width: 24rpx;
					height: 24rpx;
					transition: all 0.5s;
				}
			}
		}
		view.control-panel{
			height: calc(100% - 50rpx);
			flex: 0 0 auto;
			@include flex(space-around,center);
			view.control-content{
				width: 40%;
				@include flex(space-between,center);
				text.iconfont{
					font-size: 60rpx;
				}
			}
			text.iconfont{
				font-size: 50rpx;
			}
		}
		
	}
}
</style>
