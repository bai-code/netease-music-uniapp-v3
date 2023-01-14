<template>
	<view class="singer-description">
		<view class="introduce ">
			<view class="desc-title gutter title">
				简介
			</view>
			<view class="desc-text gutter2 textIndent ">
				{{ desc }}
			</view>
			<view class="introd">
				<template v-for="(desc,index) in introduce" :key="index">
					<view class="title gutter title">{{ desc.ti }}</view>
					<view class="txt gutter2 textIndent" >
						<view class="desc-item" v-for="(item,index) in desc._txt" 
						:key='index' v-if="desc._txt">
								{{ item }}
						</view>
						<view class="item" v-else>
							{{ desc.txt }}
						</view>
						
					</view>
				</template>
			</view>
			<view class="topic">
				
			</view>
		</view>
	</view>
</template>

<script setup>
	import { ref, watch } from 'vue'
	import { useStore } from 'vuex'

	const props = defineProps({
		singerId:{
			type:String,
			required:true
		}
	})

	const store = useStore()



	const desc = ref('')  // 歌手简介
	const introduce = ref([])  // 介绍
	const topic = ref([])
	// 获取歌手详情
	const getDescription = async (id) => {
		const { briefDesc, introduction, topicData } = await store.dispatch('getInfo', {path:`/artist/desc?id=${id}`})
		desc.value = briefDesc
		introduce.value = introduction.map(item=>{
			if(item.txt.indexOf('\n')!==-1){
				 return {
					 ti: item.ti,
					 _txt: item.txt.split('\n')
				 }
			}
			return { 
				ti:item.ti,
				txt: item.txt
			}
		})
		// topic.value = topicData.forEach(item=>{
		// 	console.log(item.txt);
		// 	if(item.txt.indexOf('/n')!==-1){
		// 		item._txt = item.txt.split('/n')
		// 		console.log(11111);
		// 	}
		// })
		console.log(introduce.value, topicData);
	}
	
	watch(() => props.singerId, (id) => {
		getDescription(id)
	}, { immediate: true })
</script>

<style lang="scss" scoped>
	view.singer-description{
		view.introduce{
			.gutter{
				margin-top: 40rpx;
			}
			.gutter2{
				margin-top: 20rpx;
			}
			.textIndent{
				text-indent: 2em;
			}
			.title{
				font-weight: bolder;
				font-size: 40rpx;
			}
			view.desc-text{
				text-indent: 2em;
				line-height: 50rpx;
			}
		}
	}
</style>
