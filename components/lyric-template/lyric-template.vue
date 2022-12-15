<template>
	<view class='lyric-container'>
		<view :class="[{empty:lyricList.length===0}, 'content']">
			<scroll-view scroll-y="true"  :scroll-top="scrollTopSize"
			scroll-with-animation='true' v-if='lyricList.length>0'>
				<view  v-for="(item,index) in lyricList" :key='index'
				:class="[{active:index===activeIndex},'lyric-text']" > 
					<text v-if='lyricVersion===0' @click.stop="playHere(item,index)">{{item&&item[1]}}</text>
					<view v-else>{{item}}</view>
				</view>
			</scroll-view>
			<text class="empty" v-else>
				暂无匹配歌词
			</text>
		</view>
	</view>
</template>

<script setup>
	import { computed, watch, ref, nextTick, onBeforeUnmount } from 'vue'
	import { useStore } from 'vuex'
	import { transTime } from '@/utils/plugins.js'
	const props = defineProps({
		lyricList:{
			type:Array
		},
		lyricVersion:{
			//0 = 普通  1 = 不随时间滚动
			type:Number,
			default:0
		}
	})

	const store = useStore()
	const currentTime = computed(()=>{
		return store.getters.setCurrentTime
	})
	
	const activeIndex = ref(0)
	watch(currentTime,(time)=>{
		if(!time || time === '00:00' || time === '00:01' ){
			activeIndex.value = 0
		}
		props.lyricList.forEach((item,index)=>{
			if(item[0]===time){
				activeIndex.value = index
			}
		})
	},{immediate:true})
	
	// 歌词滚动
	const scrollTopSize = ref(0)
	watch(()=>activeIndex.value,(index)=>{
		const val = (index-7)>0?index-7:0
		scrollTopSize.value = val * 30
	},{immediate:true})
	
	// 点击歌词，从点击处开始播放
	const playHere = (item, index) => {
		const str = item[0].split(':')
		const m = parseInt(str[0])
		const s = parseInt(str[1])
		const time = m * 60 + s
		activeIndex.value = index
		store.commit('seekProgress', { s:time })
	}
	// let timer = null
	// const showEmpty = ref(false)
	// watch(()=>props.lyricList, (list)=>{
	// 	timer = setTimeout(()=>{
	// 		showEmpty.value = list.length>0?false:true
	// 		clearTimeout(timer)
	// 		console.log(2222);
	// 	},1000)
	// },{  immediate:true,deep:true})
	
	// onBeforeUnmount(()=>{
	// 	clearTimeout(timer)
	// })
</script>

<style lang="scss" scoped>
view.lyric-container{
	height: 100%;
	view.content{
		height: 100%;
		&.empty{
			@include  flex(center,center);
		}
		scroll-view{
			height: 100%;
			view.lyric-text{
				text-align: center;
				height: 30px;
				line-height: 30px;
				font-size: 28rpx;
				&.active{
					color: $bgColor;
					height: 40px;
					font-size: 32rpx;
					line-height: 40px;
					// padding: 15rpx 0;
				}
			}
		}
	}
}
</style>