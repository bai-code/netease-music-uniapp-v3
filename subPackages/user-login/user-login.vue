<template>
	<view class="user-login">
		<u--form labelPosition="left" :model="model" :rules="rules" 
		ref="formRef" labelWidth="50" v-if="loginMode!=='qrCode'"> 
			<u-form-item label="邮箱" prop="userInfo.email" borderBottom v-if="loginMode==='email'">
				<u--input v-model="model.userInfo.email" border="none"></u--input>
			</u-form-item>
			<u-form-item label="手机号" prop="userInfo.phone" borderBottom v-else>
				<u--input v-model="model.userInfo.phone" border="none" ></u--input>
			</u-form-item>
			<u-form-item label="密 码" v-if='loginMode !=="phoneCode"' prop="userInfo.password" borderBottom >
				<u--input v-model="model.userInfo.password" type='password' border="none"></u--input>
			</u-form-item>
			<u-form-item label="验证码" class='code' v-if='loginMode==="phoneCode"' prop="userInfo.code" borderBottom >
				<u--input v-model="model.userInfo.code" border="none"></u--input>
				<template #right>
					<button class="code" @click="getCode" :disabled="btnTxt!=='获取验证码'">{{btnTxt}}</button>
				</template>
			</u-form-item>
			<u-form-item>
				<u-button @click="reset">重置</u-button>
				<u-button @click="submit">提交</u-button>
			</u-form-item>
		</u--form>
		<view class="qr-code" v-else>
			
		</view>
		<view class="change-login-mode">
			<text v-if="loginMode!='phonePwd'" @click="loginMode='phonePwd'">手机号登录</text>
			<text v-if="loginMode!='phoneCode'" @click="loginMode='phoneCode'">验证码登录</text>
			<text v-if="loginMode!='email'" @click="loginMode='email'">邮箱登录</text>
			<text v-if="loginMode!='email'" @click="loginMode='qrCode'">二维码登录</text>
		</view>
	</view>
</template>

<script setup>
	import { ref, watch } from 'vue'
	import { useStore } from 'vuex'
	// import axios from '@/utils/axios.js'

	const store = useStore()

	const loginMode = ref('phone') // phonePwd 手机号密码 // phoneCode 手机号验证码  // email 邮箱登录（暂时不用）
	const model = ref({
		userInfo: {
			phone: '13735544745',
			password: 'bgf1580087304',
			code: '',
			email: '',
			qrCode:''
		},
	})

	const rules = ref({
		'userInfo.phone': [{
			type: 'string',
			required: true,
			message: '请填写手机号码',
			trigger: ['blur', 'change']
		}, {
			validator(rule, value, callback) {
				// 手机号验证
				return uni.$u.test.mobile(value)
			},
			trigger: ['change', 'blur'],
			message: '请填写规范的手机号码'
		}],
		'userInfo.password': [{
			type: 'string',
			required: true,
			message: '请填写密码',
			trigger: ['blur', 'change']
		}, {
			validator(rule, value, callback) {
				const reg = /^\w{6,16}$/g
				return reg.test(value)
			},
			trigger: ['change', 'blur'],
			message: '密码不符合规范'
		}],
		'userInfo.code': [{
			type: 'string',
			required: true,
			len: 4,
			message: '请输入4位验证码',
			trigger: ['blur'],
		}]
	})

	const formRef = ref()
	const reset = () => {
		formRef.value.resetFields()
	}

	const submit = async () => {
		try {
			const flag = await formRef.value.validate()
			if (flag === true) {
				const { phone, password, code, email } = model.value.userInfo
				const res = await store.dispatch('userInfo/userLogin', { phone, code, password, email })
				console.log(res);
				if (res===true) {
					uni.navigateBack()
				} else {
					uni.showToast({
						title: res,
						icon: 'error'
					})
				}
			}
			console.log(flag);
		} catch (_) {
			console.log(_);
		}
	}


	//向手机发送验证码
	const countDown = ref(60)
	const btnTxt = ref('获取验证码')
	let countDownTimer = null
	const getCode = (callback) => {
		formRef.value.validateField('userInfo.phone', async (val) => {
			console.log(val);
			if (val.length === 0) {
				countDownTimer = setInterval(() => {
					countDown.value -= 1
					btnTxt.value = countDown.value + '秒后可再次发送'
					if (countDown.value === 0) {
						clearInterval(countDownTimer)
						btnTxt.value = '获取验证码'
					}
				}, 1000)
				const { phone } = model.value.userInfo
				const { code } = await store.dispatch(
				'userInfo/getInfo', { path: `/captcha/sent?phone=${phone}` })
				if (code === 200) {
					uni.showToast({
						title: '验证码已发送',
						icon: null
					})
				} else {
					uni.showToast({
						title: '验证码发送失败 请稍后重试',
						icon: 'error'
					})
				}
			}
		})
	}


	// 设置 navigatorBarTitle 
	watch(loginMode, async (val) => {
		let txt = '手机号登录'
		switch (val) {
			// case 'phonePwd' : txt = '手机号登录';break;
			case 'phoneCode':
				txt = '验证码登录';
				break;
			case 'email':
				txt = '邮箱登录';
				break;
			case 'qrCode':
				txt = '二维码登录';
				break;
			default:
				txt = '手机号登录';
				break;

		}
		if(val==='qrCode'){
			const { data:{ unikey } = {} } = await store.dispatch('getInfo', { path:`/login/qr/key` })
			if(unikey){
				const res = await store.dispatch('getInfo', { path:`/login/qr/create?key=${unikey}` })
				console.log(res);
			}
			console.log(unikey);
		}
		
		uni.setNavigationBarTitle({
			title: txt
		})
	}, { immediate: true })
</script>

<style lang="scss">
	view.user-login {
		position: relative;
		padding: 20rpx;
		box-sizing: border-box;
		height: 100%;

		button.code {
			height: 50rpx;
			line-height: 50rpx;
			font-size: 28rpx;
		}

		view.qr-code{
			width: 100%;
			height: 500rpx;
			background: #0f0;
			@include flex(center,center);
			image{
				height: 400rpx;
				width: 400rpx;
			}
		}

		// 切换登录方式
		view.change-login-mode {
			position: absolute;
			bottom: 30rpx;
			@include flex(flex-end, center);
			font-size: 28rpx;
			color: $userColor;
			width: 100%;

			text {
				margin-right: 50rpx;
			}
		}
	}
</style>
