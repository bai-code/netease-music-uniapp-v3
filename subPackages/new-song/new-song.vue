<template>
	<select-and-content :titleList='songTypeList' :titleIndex='titleIndex' @changeTitle='changeTitle'>
			<music-list-table :musicList='newSongList[titleIndex]' :showImage='false' />
	</select-and-content>
</template>

<script setup>
	import { ref, shallowReactive, watch } from 'vue'
	import { useStore } from 'vuex'
	import { loopAdd } from '@/utils/plugins.js'
	import { onLoad } from '@dcloudio/uni-app'

	const store = useStore()

	const titleIndex = ref(0)
	const songTypeList = shallowReactive([{
			id: 0,
			title: '全部'
		},
		{
			id: 1,
			title: '华语'
		}, {
			id: 2,
			title: '欧美'
		}, {
			id: 3,
			title: '日本'
		}, {
			id: 4,
			title: '韩国'
		},
	])

	const newSongList = ref([])
	const getNewSongList = async () => {
		const { title } = songTypeList[titleIndex.value]
		let t = 0
		switch (title) {
			case '华语':
				t = 7;
				break;
			case '欧美':
				t = 96;
				break;
			case '日本':
				t = 8;
				break;
			case '韩国':
				t = 16;
				break;
			default:
				t = 0;
				break;
		}
		if(!newSongList.value[titleIndex.value]){
			newSongList.value[titleIndex.value] = []
			const { data } = await store.dispatch('getInfo', { path: `/top/song?type=${t}` })
			newSongList.value[titleIndex.value] = loopAdd({ list: data, singerName: 'artists' })
		} 
	}

	watch(titleIndex, (index) => {
		getNewSongList()
	}, { immediate: true })

	// 切换地区类型
	const changeTitle = (index) => {
		titleIndex.value = index
	}
	
</script>

<style lang="scss">

</style>
