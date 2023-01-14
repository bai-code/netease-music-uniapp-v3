<template>
	<view class="video-container">
		<view class="select-content">
			<view class="area select-item">
				<text>地区:</text>
				<text v-for='(tag,index) in areaList' :key="tag.id" :class="['tag-item', { active:areaIndex===index }]"
					@click="areaIndex=index">{{ tag.area }}
				</text>
			</view>
			<view class="type select-item">
				<text>类型:</text>
				<text v-for='(item,index) in typeList' :key="item.id" :class="['tag-item',{active:typeIndex===index}]"
					@click="typeIndex=index">{{item.type}}</text>
			</view>
			<view class="order select-item">
				<text>排序:</text>
				<text v-for="(item,index) in orderList" :key="item.id" :class="['tag-item',{active:orderIndex===index}]"
					@click="orderIndex=index">{{item.order}}</text>
			</view>
		</view>
		
		<view class="video-content" v-if=" videoList[areaIndex]&& videoList[areaIndex][typeIndex]">
			<scrollView-backTop :isLoading='isLoading' :backTopDistance='{right:"40rpx", bottom:"160rpx"}'
			@scrollToBottom='scrollToBottom' >
					<video-temp v-for="video in videoList[areaIndex][typeIndex][orderIndex]" :key="video.id"
						:videoInfo='video' :showSinger='true'>
					</video-temp>
					<view class="empty" v-if="!isLoading&&videoList[areaIndex][typeIndex][orderIndex].length===0">
						empty
					</view>
			</scrollView-backTop>
		</view>
		
	</view>
</template>

<script setup>
	import { useStore } from 'vuex'
	import { onMounted, shallowRef, watch, ref, shallowReactive } from "vue";
	import { loopAdd } from '../../utils/plugins';

	const store = useStore()

	const areaIndex = ref(0) // 选中项
	const typeIndex = ref(0)
	const orderIndex = ref(2)
	const areaList = shallowReactive([{
		id: 0,
		area: '全部'
	}, {
		id: 1,
		area: '内地'
	}, {
		id: 2,
		area: '港台'
	}, {
		id: 3,
		area: '欧美'
	}, {
		id: 4,
		area: '日本'
	}, {
		id: 5,
		area: '韩国'
	} ])

	const typeList = shallowReactive([{
		id: 0,
		type: '全部'
	}, {
		id: 1,
		type: '官方'
	}, {
		id: 2,
		type: '原生'
	}, {
		id: 3,
		type: '现场版'
	}, {
		id: 4,
		type: '网易出品'
	}])

	const orderList = shallowReactive([{
		id: 0,
		order: '上升最快'
	}, {
		id: 1,
		order: '最热'
	}, {
		id: 2,
		order: '最新'
	}])

	const spreadObject = (aI, tI, oI) => {
		const _aI = aI || areaIndex.value
		const _tI = tI || typeIndex.value
		const _oI = oI || orderIndex.value
		const { area } = areaList[_aI]
		const { type } = typeList[_tI]
		const { order } = orderList[_oI]
		return { area, type, order }
	}

	const scrollTop = ref(0)
	const videoList = ref([]) // 视频数组
	const loadMore = ref(false) // 是否加载更多
	const isLoading = ref(false)
	const getVideoCategoryData = async () => {
		const { area, type, order } = spreadObject()
		const list = videoList.value[areaIndex.value]
		const flag = list && list[typeIndex.value]
		if (typeof (list&&list[typeIndex.value])!== 'object') {
			videoList.value[areaIndex.value] = []
			videoList.value[areaIndex.value][typeIndex.value] = []
			videoList.value[areaIndex.value][typeIndex.value][orderIndex.value] = []
		} else if(!list[typeIndex.value][orderIndex.value]){
			videoList.value[areaIndex.value][typeIndex.value][orderIndex.value] = []
		}
		const len = videoList.value[areaIndex.value][typeIndex.value][orderIndex.value].length
		if (len > 0 && !loadMore.value) return
		const { data = [] } = await store.dispatch(
			'getInfo', { path: `/mv/all?area=${area}&type=${type}&order=${order}&offset=${len}&limit=30` })
		const newData = loopAdd({ list: data, singerName: 'artists', playCountName: 'duration' })
		if (newData.length > 0) {
			videoList.value[areaIndex.value][typeIndex.value][orderIndex.value].push(...newData)
		}
		isLoading.value = false
		loadMore.value = false
	}



	// 检测切换
	watch([areaIndex, typeIndex, orderIndex], (index) => {
		isLoading.value = true
		getVideoCategoryData()
	})

	// 滚动加载更多
	const scrollToBottom = () => {
		loadMore.value = true
		isLoading.value = true
		getVideoCategoryData()
	}

	onMounted(() => {
		isLoading.value = true
		getVideoCategoryData()
	})
</script>

<style lang="scss" scoped>
	view.video-container {
		height: 100%;
		padding: 10rpx 15rpx;
		box-sizing: border-box;

		view.select-content {
			white-space: nowrap;

			view.select-item {
				height: 50rpx;
				line-height: 50rpx;
				margin: 15rpx 0;

				text.tag-item {
					display: inline-block;
					padding: 0 15rpx;
					box-sizing: border-box;
					position: relative;

					&.active::after {
						content: '';
						height: 4rpx;
						width: 70%;
						left: 50%;
						transform: translateX(-50%);
						background: $bgColor;
						position: absolute;
						bottom: 0;
					}
				}
			}

		}

		// 视频内容区域
		view.video-content {
			height: calc(100% - 210rpx);
			margin-top: 10rpx;

			view.video-item-container {
				flex: 0 0 auto;
				height: 100%;
				width: 100%;
			}

			view.empty {
				width: 100%;
				height: 300rpx;
				text-align: center;
				line-height: 300rpx;
			}

		}
	}
</style>
