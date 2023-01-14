<template>
	<view class='singer-mv'>
		<!-- <view class="mv-item"  > -->
			<video-temp :videoInfo='mv' imageName='imgurl' v-for="mv in mvList" :key="mv.id" />
		<!-- </view> -->
	</view>
</template>

<script setup>
	import { ref, watch, reactive, defineExpose } from 'vue'
	import { useStore } from 'vuex'
	
	const props = defineProps({
		singerId:{
			type:String,
			required:true
		}
	})
	
	const store = useStore()
	
	const mvList = reactive([])  // mv数据
	const hasmore = ref(true)
	const getMvList = async (id) =>{
		const len = mvList.length //偏移量
		const { mvs, hasMore } = await store.dispatch('getInfo', { path:`/artist/mv?id=${id}&offset=${len}&limit=10` })
		mvList.push(...mvs)
		hasmore.value = hasMore
		// console.log(mvs,hasMore);
	}
	
	const loadMore = () => {
		if(!hasmore.value)return
		getMvList(props.singerId)
	}
	
	watch(()=>props.singerId, (id)=> {
		getMvList(id)
	}, { immediate:true })
	
	
	defineExpose({
		loadMore
	})
	
</script>

<style lang="scss" scoped >
view.singer-mv{
	@include flex(space-around, center);
	flex-wrap: wrap;
	
}
</style>
