<template>
	<view>
		停用
	</view>
</template>

<script setup>
	import { onLoad } from '@dcloudio/uni-app'
import { onMounted } from "vue";
	
	
	const getPlaylist = async () =>{
		const res = await store.dispatch('getInfo', { path:'/playlist/hot' })
		console.log(res)
	}
	
	
	onLoad((options)=>{
		const { isAlbum, pid } = options
		console.log(options, isAlbum, pid);
	})
	
	onMounted(()=>{
		getPlaylist()
	})
</script>

<style lang="scss">

</style>
