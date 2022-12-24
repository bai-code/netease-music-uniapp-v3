<template>
	<view>
		<!-- banner  跳转外部网站 -->
		<web-view :src="websiteUrl" progress='true'></web-view>
	</view>
</template>

<script setup>
	import { onLoad } from '@dcloudio/uni-app'
	import { ref } from 'vue'
	const websiteUrl = ref('')
	
	onLoad((option)=>{
		websiteUrl.value = option.url
	})
</script>

<style lang="scss">

</style>
