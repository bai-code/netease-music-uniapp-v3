<template>
	<!-- 一个选择  +  内容的组件 -->
	<view class="select-and-content">
		<scroll-view class="title-container" scroll-x>
			<view class="title-item">
				<view class="item" v-for="(item,index) in titleList" :key="item.id" :class="{active:index===titleIndex}"
					@click="changeTitle(index)">
					{{ item[titleName] }}
				</view>
			</view>
		</scroll-view>

		<swiper :interval="3000" :current="titleIndex" :duration="1000" 
		class="content-container" @change="swiperChange">
			<swiper-item v-for="(item,index) in titleList" :key="item.id">
				<slot v-if="titleIndex===index"></slot>
			</swiper-item>
		</swiper>


	</view>
</template>

<script setup>
	defineProps({
		titleList: {
			type: Array,
			default: () => []
		},
		titleName:{
			type:String,
			default:'title'
		},
		titleIndex: {
			type: Number,
			default: 0,
		}

	})

	const emits = defineEmits(['changeTitle'])

	const changeTitle = (index) => {
		emits('changeTitle', index)
	}
	
	const swiperChange = (e) => {
		const {current} = e.detail
		emits('changeTitle', current)
	}
</script>

<style lang="scss" scoped>
	view.select-and-content {
		height: 100%;

		.title-container {
			height: 60rpx;

			.item {
				display: inline-block;
				padding: 10rpx 15rpx;
				position: relative;

				&.active::after {
					content: '';
					width: 80%;
					height: 5rpx;
					background-color: $bgColor;
					@include textCenter(50%);
					bottom: 5rpx;
					border-radius: 2rpx;
				}
			}
		}

		.content-container {
			height: calc(100% - 60rpx);
			width: 100%;
			padding: 20rpx;
			box-sizing: border-box;

			.content {
				height: 100%;
			}
		}

	}
</style>
