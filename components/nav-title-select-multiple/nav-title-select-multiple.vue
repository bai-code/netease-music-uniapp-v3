<template>
	<!-- 多层选择组件  mv页面  歌手页面等 -->
	<view class="nav-title-select-multiple">
		<view class="title-container" v-for="(title,index) in titleList" :key="title.id">
			<view class="category">{{title.category}}:</view>
			<scroll-view class="select-item" scroll-x v-if="title.children">
				<view class="select-container" >
					<view :class="['item', {scale:index===scaleRow, active:selectItemList[index]===i}]" 
					v-for="(item,i) in title.children" :key="item.id" @click="changeSelect(index,i)">
						{{item.text}}
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script setup>
	defineProps({
		titleList: {
			type: Array,
			default: () => []
		},
		scaleRow:{
			// 某一行 每个item项间距调大
			type:Number,
			default:-1
		},
		selectItemList:{
			type:Array,
			default:()=>[0,0,1]
		}
	})
	
	const emits = defineEmits(['changeSelect'])
	
	const changeSelect = (index,i) => {
		emits('changeSelect', index,i)
	}
	
	
</script>

<style lang="scss">
view.nav-title-select-multiple{
	view.title-container{
		height: 80rpx;
		line-height: 80rpx;
		padding: 10rpx 0;
		@include flex(flex-start,center);
		box-sizing: border-box;
		view.category{
			font-weight: bolder;
		    flex: 0 0 auto;
		}
		.select-item{
			flex: 1 1  auto;
			view.select-container{
				@include flex(flex-start,center);
				padding-right: 20rpx;
				// width: 100%;
				view.item{
					padding: 0 10rpx;
					flex: 0 0 auto;
					&.scale{
						padding: 0 20rpx;
					}
					&.active{
						color: $bgColor;
					}
				}
			}
		}
	}
}
</style>
