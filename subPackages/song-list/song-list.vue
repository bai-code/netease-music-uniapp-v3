<template>
	<view>
		歌单
	</view>
</template>

<script setup>
	import { onLoad } from '@dcloudio/uni-app'
	
	
	onLoad((options)=>{
		const { isAlbum, pid } = options
		console.log(options, isAlbum, pid);
	})
</script>

<style lang="scss">

</style>
