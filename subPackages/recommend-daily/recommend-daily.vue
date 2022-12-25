<template>
	<view>
		每日推荐
	</view>
</template>

<script setup>
	import { ref, shallowRef, onMounted } from 'vue'
	import { useStore } from 'vuex'
	
	const store = useStore()
	
	const dailyList = shallowRef([])
	
	const getDailyList = async () => {
		const res = await store.dispatch('getInfo', { path:'/recommend/songs' })
		console.log(res);
	}
	
	onMounted(async ()=>{
		// await store.dispatch('getInfo', {path:'/register/anonimous'})
		getDailyList()
	})
	
</script>

<style lang="scss">

</style>
