import store from '@/store/index.js'
// 添加歌手
export const addSinger = ({ list = [], spaceMark = '/' }) => {
	const len = list.length
	// console.log(list);
	if (len === 0) return
	let str = ''
	list.forEach((item, index) => {
		if (index === len - 1) {
			str += item.name
		} else {
			str += item.name + '/'
		}
	})
	return str
}

export const computedCount = (num)=>{
	if (num > 100000000) {
		return Math.floor(num / 100000000) + '亿'
	} else if (num > 100000) {
		return Math.floor(num / 10000) + '万'
	} else {
		return num
	}
}

export const computedPlayCount = ({ list = [], countName = '_playCount' }) => {
	if (list.length === 0) return
	list.forEach(item => {
		item[countName] = computedCount(item.playCount)
	})
	return list
}

// 对循环的数据进行筛选添加某个属性
export const loopAdd = ({ list = [], singerName = 'ar', nest/*嵌套*/, reName }) => {
	if (list.length === 0) return
	const val = reName || '_singer'
	list.forEach(item => {
		if(nest){
			item[val] = addSinger({ list :item[nest][singerName] })
		} else {
			item._singer = addSinger({ list: item[singerName] })
		}
	})
	return list
}

/**
 * musicList index 传递
 * 或者单传 musicInfo 
 * @param {musicList}  歌曲列表
 * @param {index}  歌曲索引
 * @param {musicInfo}  当前歌曲信息
 */
export const playAndCommit = ({ musicList = [], index, musicInfo = {} }) => {
	let info = musicInfo
	if (musicList.length > 0) {
		info = musicList[index]
		store.commit('saveMusicList', { musicList })
	}
	store.dispatch('getMusicInfo', { musicInfo: info, index })
}

export const fillNum = (num, fillNum = 2 /*填充到几位数*/ ) => {
	return (parseInt(num) + '').padStart(fillNum, '0')
}


// 时间转换 
export const transTime = (time, isMs = false) => {
	let t = time
	if (isMs) {
		t = t / 1000
	}
	let s = t
	let m = 0
	if (t > 60) {
		m = Math.floor(t / 60)
		s = t % 60
	}
	return `${ fillNum(m) }:${ fillNum(s) }`
}

const randomNum = (max, min) => {
	return parseInt(Math.random() * (max - min) + min)
}
/**
 * height ,width    容器大小
 * gutter  			每个元素最小间距
 * domSize  		内部元素大小
 * num     			内部几个元素
 **/
 // 对歌手那一块排列
export const sortPosition = ({ height = 200, width, gutter, domSize, num }) => {
	const arr = []
	let len = 0
	const containerWidth = width - domSize // 容器实际可放置位置大小  left 坐标
	const containerHeight = height - domSize
	while (len < num) {
		len = arr.length
		const left = randomNum(containerWidth, 0)
		const top = randomNum(containerHeight, 0)
		
		const flag = arr.every(item => {
			return Math.abs(item.left - left) >= domSize + gutter || Math.abs(item.top - top) >= gutter +
				domSize
		})
		if (flag) {
			const deg = randomNum(30,-30)
			arr.push({ left, top, deg })
		}
	}
	return arr

	// Math.abs(item.left - left) >= domSize + gutter || Math.abs(
	// item.top - top) >= gutter + domSize 


}
