<template>
	<view>
		<music-list-table :musicList='searchList'></music-list-table>
	</view>
</template>

<script setup>
	import {
		onLoad
	} from '@dcloudio/uni-app'
	import {
		ref
	} from 'vue'

	const searchList = ref([])
	const getSearchResult = async (s) => {
		uni.showNavigationBarLoading()
		const {
			result: {
				songs = []
			} = {}
		} = await uni.$axios({
			url: `/search?keywords=${s}`
		})
		uni.hideNavigationBarLoading()
		uni.setNavigationBarTitle({
			title: `搜索 -- ${s}`,
		})
		searchList.value = songs
		console.log(songs);
	}

	onLoad((options) => {
		getSearchResult(options.s)
	})
</script>

<style lang="scss">

</style>
