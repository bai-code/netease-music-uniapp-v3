// 按需导入 $http 对象
// import {
// 	$http
// } from '@escook/request-miniprogram'

// $http.baseUrl = 'http://localhost:3000'

// $http.beforeRequest = function(options) {

// 	// console.log(options);

// }
// $http.afterRequest = function(result) {
// 	if(result.statusCode===200){
// 		return result.data
// 	}
// 	// console.log(result);
// }

export default function({
	url,
	method = 'GET'
}) {
	return new Promise(async(resolve, reject) => {
		// 请求前
		
		// 添加await 可以按照顺序保证请求后可以做些什么
		await uni.request({
			url: 'http://localhost:3000' + url,
			method: method.toUpperCase(),
		}).then(res => {
			if (res.statusCode === 200) {
				resolve(res.data)
			}
		}).catch(err => {
			reject(err)
		})
		// 请求完成后
	})
}

// // 在 uni-app 项目中，可以把 $http 挂载到 uni 顶级对象之上，方便全局调用
// uni.$http = $http
