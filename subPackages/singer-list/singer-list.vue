<template>
	<view class="singer-list">
		<nav-title-select-multiple @changeSelect='changeSelect' :scaleRow='2' 
		:titleList='titleList' :selectItemList='selectItemList' ></nav-title-select-multiple>
		<scroll-view scroll-y="true" class="singer-container" @scrolltolower="loadMore" lower-threshold="200" >
			<view class="content" v-if="singerList[0]">
				<view class="singer-item" v-for='singer in singerList[selectItemList[0]][selectItemList[1]][selectItemList[2]]' :key='singer.id'
				@click="linkToSingerDetail"
				>
					<view class="image">
						<image :src="singer.picUrl" :lazy-load="true" mode="scaleToFill" @click="viewSingerImage(singer.picUrl,$event)"></image>
					</view>
					<view class="singer-name overflow">
						{{singer.name}}
					</view>
				</view>
			</view>
		</scroll-view>
		<cover-view class="big-image" v-if="isShow" @click="isShow=false">
			<cover-image class="img" :src="showBigImageSrc"></cover-image>
		</cover-view>
	</view>
</template>

<script setup> 
	import { onMounted, ref, reactive, shallowReactive, watch } from 'vue'
	import { useStore } from 'vuex'
	
	const store = useStore()
	
	const isShow = ref(false)  // 是否大图展示图片
	const showBigImageSrc = ref('') // 大图展示图片地址
	
	const selectItemList = shallowReactive([0,0,1])  // 选择项
	
	// 标题选择
	const titleList = reactive([
		{
			id:0,
			category:'性别',
			children:[
				{
					id:'0-1',
					text:'全部',
					type:-1
				},
				{
					id:'0-2',
					text:'男歌手',
					type:1
				},{
					id:'0-3',
					text:'女歌手',
					type:2
				},{
					id:'0-4',
					text:'乐队',
					type:3
				},
			]
		},
		{
			id:1,
			category:'地区',
			children:[
				{
					id:'1-1',
					text:'全部',
					type:-1
				},
				{
					id:'1-2',
					text:'华语',
					type:7
				},{
					id:'1-3',
					text:'欧美',
					type:96
				},{
					id:'1-4',
					text:'日本',
					type:8
				},
				{
					id:'1-3',
					text:'韩国',
					type:16
				},{
					id:'1-4',
					text:'其他',
					type:0
				},
			]
		},
		{
			id:2,
			category:'字母',
			children:[
				{
					id:'2-0',
					text:'热门',
					type:-1
				},
				{
					id:'2-100',
					text:'#',
					type:0
				},
			]
		},
	])
	
	const singerList = reactive([])  // 歌手存储列表
	let hasMore = true
	let isLoading = false  //请求数据中
	
	
	const tempSelect = {  //缓存选择项
		type:'',
		area:'',
		initial:''
	}
	
	// 获取歌手列表
	const getSingerList = async (type, area, initial) =>{
		isLoading = true
		const _type = type || tempSelect.type
		const _area = area || tempSelect.area
		const _initial = initial || tempSelect.initial
		
		const arrFirst = singerList[selectItemList[0]]
		if(!arrFirst){
			singerList[selectItemList[0]] = []
		}
		if(!singerList[selectItemList[0]][selectItemList[1]]){
			singerList[selectItemList[0]][selectItemList[1]] = []
		}
		if(!singerList[selectItemList[0]][selectItemList[1]][selectItemList[2]]){
			singerList[selectItemList[0]][selectItemList[1]][selectItemList[2]] = []
		}
		
		const len = singerList[selectItemList[0]][selectItemList[1]][selectItemList[2]].length
		const { artists, more } = await store.dispatch('getInfo', { path:`/artist/list?type=${_type}&area=${_area}&initial=${_initial}&limit=30&offset=${len}` })
		hasMore = more
		singerList[selectItemList[0]][selectItemList[1]][selectItemList[2]].push(...artists)
		isLoading = false
		// console.log(artists, singerList);
	}
	
	// 切换类型选择项
	const changeSelect = (index,i) => {
		selectItemList[index] = i
	}
	
	// 当选择项改变，发起请求
	watch(selectItemList, ([index1,index2,index3])=>{
		hasMore = true
		const type = titleList[0].children[index1].type
		const area = titleList[1].children[index2].type
		const initial = titleList[2].children[index3].type
		Object.assign(tempSelect,{type,area,initial})
		getSingerList(type,area,initial)
	}, {  immediate:true})
	
	// 跳转到歌手详情页面
	const linkToSingerDetail = () => {
		
	}
	
	// 大图预览歌手图片
	let time = 0
	const viewSingerImage = (picUrl,e) =>{
		// 使用时间戳 达到双击预览图片效果
		const {timeStamp} = e
		if(timeStamp-time<300){
			showBigImageSrc.value = picUrl
			isShow.value = true
		}
		time = timeStamp
	}
	
	// 滚动加载更多
	const loadMore = () => {
		if(!hasMore||isLoading) return
		getSingerList()
	}
	
	onMounted(()=>{
		// 歌手首字母列表加工
		const alphabet = 'abcdefghijklmnopqrstuvwxyz'
		const alphabetUpper = alphabet.toUpperCase()
		const arr = alphabetUpper.split('')
		const result = arr.map((item,index)=>{
			return {
				id: `2-${index + 1 }`,
				text:item,
				type:alphabet[index]
			}
		})
		titleList[2].children.splice(1,0,...result)
	})
	
</script>

<style lang="scss" scoped>
view.singer-list{
	padding: 10rpx ;
	box-sizing: border-box;
	height: 100%;
	.singer-container{
		height: calc(100% - 240rpx);
		view.content{
			@include flex(flex-start,center);
			flex-wrap: wrap;
			width: 100%;
			view.singer-item{
				width: 25%;
				margin-bottom: 20rpx;
				@include flex(flex-start,center);
				flex-direction: column;
				font-size: 26rpx;
				view.image{
					width: 100%;
					height: 0;
					padding-bottom: 100%;
					position: relative;
					image{
						position: absolute;
						height: 80%;
						width: 80%;
						border-radius: 5rpx;
						transform: translate(12.5%,12.5%);
					}
				}
				view.singer-name{
					width: 80%;
				}
			}
		}
	}
	
	.big-image{
		position: absolute;
		height: 100%;
		width: 100%;
		background: rgba(100,100,100,0.5);
		top: 0;
		left: 0;
		transition: all 0.5s;
		.img{
			position: absolute;
			left: 50%;
			top: 50%;
			width: 80%;
			height: 80vw;
			transform: translate(-50%,-50%);
			border-radius: 10rpx;
		}
	}
	
	
}
</style>
