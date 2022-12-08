<template>
	<view class="search">
		<view class="search-input">
			<input type="text" :placeholder="defaultPlaceholder" v-model="inputValue" @confirm='getSearchValue' />
			<uni-icons class='search' type="search" @click="getSearchValue"></uni-icons>
		</view>
	</view>
	<view class="container">
		<!-- 搜索历史 -->
		<view class='search-history' v-if='searchHistory.length>0'>
			<text class='s-t'>搜索历史:</text>
			<view class="search-h">
				<view class="s-item" v-for="item in searchHistory" :key='item.id' @click="getSearchValue(item.val)">
					{{item.val}}
				</view>
			</view>
		</view>
		<!-- 热搜列表 -->
		<view class="hot-search">
			<text class='h-s'>热搜推荐:</text>
			<u-row class="hot-s">
				<u-col class="h-item" v-for="(item,index) in hotSearchList" :key='item.content+item.searchWord'
					:span='6'>
					<view class="index">
						{{index + 1}}.
					</view>
					<view class="content" @click="getSearchValue(item.searchWord)">
						<text class='s-w'>{{item.searchWord}}</text>
						<image class='iconType' v-if='item&&item.iconType===1' :src="item.iconUrl"></image>
					</view>
				</u-col>
			</u-row>
		</view>
	</view>
</template>

<script setup>
	import {
		ref,
		onMounted
	} from 'vue'

	const defaultPlaceholder = ref('') // 默认input框placeholder文字
	const inputValue = ref('')
	const isShowSearchIcon = ref(true) //是否展示搜索按钮
	const searchHistory = ref([])
	// 搜索历史
	const getSearchValue = (params) => {
		const d = new Date().getTime()
		const obj = { //每次搜索
			id: d,
			val: typeof params === 'string' ? params : (inputValue.value ? inputValue.value : defaultPlaceholder
				.value)
		}
		if (searchHistory.value.length >= 10) {
			searchHistory.value.pop()
		}
		searchHistory.value.unshift(obj)
		localStorage.setItem('sh', JSON.stringify(searchHistory.value))
		uni.navigateTo({
			url: `/subPackages/search-result/search-result?s=${obj.val}`
		})

	}

	// 热搜
	const hotSearchList = ref([])
	const getHotSearchList = async () => {
		const {
			data
		} = await uni.$axios({
			url: '/search/hot/detail'
		})
		hotSearchList.value = data
		console.log(data);
		// console.log(uni.$axios);
	}

	// 默认关键词
	const getSearchDefaultKeyWord = async () => {
		const {
			data = {}
		} = await uni.$axios({
			url: '/search/default'
		})
		defaultPlaceholder.value = data.showKeyword || '请输入歌手/歌名'
	}


	onMounted(() => {
		searchHistory.value = JSON.parse(localStorage.getItem('sh')) || []
		getSearchDefaultKeyWord()
		getHotSearchList()
		// const res = uni.getMenuButtonBoundingClientRect && uni.getMenuButtonBoundingClientRect()
		// console.log(res);
	})
</script>

<style lang="scss">
	view.search {
		background: $bgColor;
		@include flex(center, center);

		view.search-input {
			width: 80%;
			@include flex(flex-start, center);
			padding: 10rpx 20rpx;
			position: relative;

			.uni-icons.search {
				position: absolute;
				right: 38rpx;
				font-size: 40rpx !important;
			}

		}

		input {
			background: #fff;
			border-radius: 30rpx;
			padding: 0 50rpx 0 40rpx;
			width: 100%;
			height: 50rpx;
			font-size: 25rpx;

			&::placeholder {
				font-size: 24rpx;
			}
		}

	}

	view.container {
		padding: 10rpx 20rpx;

		// 搜索历史
		view.search-history {
			text.s-t {
				color: $lightFontColor;
			}

			view.search-h {
				@include flex(flex-start, center);
				flex-wrap: wrap;
				color: #aaa;

				view.s-item {
					max-width: 50%;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
					padding: 4rpx 15rpx;
				}

			}
		}

		// 热搜
		view.hot-search {
			margin-top: 20rpx;

			.u-row.hot-s {
				flex-wrap: wrap;

				.u-col.h-item {
					// flex:0 0 auto;
					// width: 50%;
					color: #aaa;
					@include flex(flex-start, center);
					flex-direction: row;
					padding: 10rpx;

					view.index {
						padding: 0 20rpx;
					}

					view.content {
						position: relative;

						image.iconType {
							width: 40rpx;
							height: 20rpx;
							position: absolute;
							top: 5rpx;
							margin-left: 10rpx;
						}
					}
				}
			}
		}
	}
</style>
