<template>
	<view class="nav-title" @click="routerLinkTo">
		<text class="title">{{title}}</text>
		<text class="iconfont icon-right"></text>
	</view>
</template>

<script setup>
	const props = defineProps({
		title:{
			type:String,
		},
		linkMode:{
			// 跳转方式
			type:String,
			default:'navigateTo'
		},
		linkUrl:{
			type:String
		}
	})
	
	const routerLinkTo = () => {
		const { linkUrl, linkMode } = props
		if(!linkUrl)return
		try{
			uni[linkMode]({
				url:linkUrl
			})
		}catch(e){
			//TODO handle the exception
		}
	}
</script>

<style lang="scss">
view.nav-title{
	font-weight: bolder;
	margin-top: 50rpx;
	text.title{
		margin-right: 10rpx;
	}
}
</style>