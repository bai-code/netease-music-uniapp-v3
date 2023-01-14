<template>
	<view v-if="token" class="similar-contianer">
		无法登录， 数据暂时无法获取
	</view>
	<view class="no-login" v-else>
		<view class="login" @click="loginIn">
			登录获取信息
		</view>
	</view>
</template>

<script setup>
	import { onLoad, onShow } from '@dcloudio/uni-app'
	import { ref, watch, watchEffect, onActivated, computed } from 'vue'
	import { useStore } from 'vuex'
	
	const props = defineProps({
		singerId:{
			type:String,
			required:true
		}
	})
	
	const store = useStore()
	
	const getSimilarList = async (id) => {
		const res = await store.dispatch('getInfo', { path:`/simi/artist?id=${id}` })
		console.log(res);
	}
	
	const token = computed(()=>{
		return store.state.userInfo.userInfo.token
	})
	
	watchEffect(()=>{
		console.log(token.value);
		if(!token.value)return
		getSimilarList(props.singerId)
	})
	
	// 跳转登录页面
	const loginIn = () => {
		uni.navigateTo({
			url:'/subPackages/user-login/user-login'
		})
	}
	
</script>

<style lang="scss">
view.similar-container{
	min-height: 300rpx;
	text-align: center;
	line-height: 300rpx;
}

view.no-login{
	min-height: 600rpx;
	@include flex(center,center);
	view.login{
		border: 1px solid #ccc;
		padding: 10rpx 25rpx;
		border-radius: 10rpx;
	}
}
</style>
