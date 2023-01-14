<template>
	<scroll-view scroll-y  class="container">
		<music-list-table :musicList='searchList' ></music-list-table>
	</scroll-view>
</template>

<script setup>
	import { onLoad } from '@dcloudio/uni-app'
	import { ref } from 'vue'
	import { loopAdd } from '@/utils/plugins';

	const searchList = ref([])
	const getSearchResult = async (s) => {
		uni.showNavigationBarLoading()
		const {
			result: {
				songs = []
			} = {}
		} = await uni.$axios({
			url: `/cloudsearch?keywords=${s}`
		})
		uni.hideNavigationBarLoading()
		uni.setNavigationBarTitle({
			title: `搜索 -- ${s}`,
		})
		searchList.value = loopAdd({list:songs})
	}

	onLoad((options) => {
		getSearchResult(options.s)
	})
</script>

<style lang="scss" scoped>
.container{
	height: 100%;
}
</style>
