import App from './App'
import uviewPlus from '@/uni_modules/uview-plus'
import $axios from '@/utils/axios.js'
import store from '@/store/index.js'
// 图标样式
import '@/utils/iconfont/iconfont.css'

uni.$axios = $axios

// #ifndef VUE3
import Vue from 'vue'
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
	...App
})
app.use(store).use(uviewPlus)
uni.$u.config.unit = 'rpx'
app.$mount()
// #endif



// #ifdef VUE3
import {
	createSSRApp
} from 'vue'
export function createApp() {
	const app = createSSRApp(App)
	app.use(store)
	return {
		app
	}
}
// #endif
