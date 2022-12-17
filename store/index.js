import userInfo from './userInfo.js'

import { createStore } from 'vuex'
import  axios from '@/utils/axios.js' 
import audio from '@/utils/audio.js'
import { transTime } from '@/utils/plugins.js'
// 创建audio对象

const tempMusicInfo = {
	name:'',
	_singer:'',
	id:'',
	url:'',
	picUrl:'',
	level:''
}
const info = localStorage.getItem('musicInfo')
const musicInfo = info && JSON.parse(info) || tempMusicInfo

const list = localStorage.getItem('musicList')
const musicList = list&&JSON.parse(list) || []

const level = localStorage.getItem('level') || 'standard'

export default createStore({
	state:{
			musicInfo,  // 当前播放歌曲信息
			musicList, // 歌曲列表
			isPlay:false, // 播放状态
			currentTime:0, //当前播放进度
			durationTime:0, // 当前歌曲总时长
			level, // 音质
			current:-1, //当前播放第几首
	},
	getters:{
		findCurrentPlayIndex(state){
			return  (list) => {
				const _list = list || state.musicList
				const targetList = JSON.stringify(state.musicList)
				const originList = JSON.stringify(_list)
				if(targetList === originList){
					const {  id } = state.musicInfo
					return _list.findIndex(item=>{
						return item.id === id
					})
				}
			}
		},
		setPrecentage(state){
			const { currentTime, durationTime } = state
			// 切换歌曲 durationTime 可能变成0，进度抖动
			if(!currentTime||!durationTime)return 0
			return parseInt((currentTime/durationTime)*100)
		},
		setCurrentTime(state){
			const {currentTime} =state
			return transTime(currentTime)
		},
		setDurationTime(state){
			const { durationTime } = state
			return transTime(durationTime)
		},
	},
	mutations:{
		play(){
			audio.play()
		},
		pause(){
			audio.pause()
		},
		saveUrlAndDurationTime(state,{url,durationTime, level}){
			audio.src=url
			state.level = level
			state.musicInfo.url=url
			state.durationTime=durationTime
		},
		changePlayStatus(state,{ isPlay }){
			if(isPlay){
				if(audio.src){
					audio.play()
				}
			}else{
				audio.pause()
			}
			state.isPlay = isPlay
		},
		// 保存歌曲当前播放信息
		saveMusicInfo(state, {musicInfo,index}){
			const info = { }
			for(const props in tempMusicInfo){
				// 只取需要的属性
				if(props==='picUrl'){
					info[props] = musicInfo.picUrl||musicInfo.al&&musicInfo.al.picUrl
				}else{
					info[props] = musicInfo[props] || tempMusicInfo[props]
				}
			}
			state.musicInfo = info
			localStorage.setItem('musicInfo', JSON.stringify(info))
			if(index>=0){
				state.current = index
			}
		},
		// 保存播放列表
		saveMusicList(state,{ musicList }){
			state.musicList = musicList
			localStorage.setItem('musicList', JSON.stringify(musicList))
		},
		changeToneQuality(state, { level }){
			state.level = level
		},
		// 用于动态更新 播放进度
		timeUpdate(state,{currentTime}){
			state.currentTime = currentTime
		},
		// 用于初始更新时间
		updateDateTime(state,{currentTime,durationTime}){
			state.currentTime = currentTime
			state.durationTime = durationTime
		},
		// 播放时间跳转
		seekProgress(state, { time /*占进度条百分比*/ , s /*时间  s */ }){
			if(s===0 || s){
				audio.seek(s)
			}else{
				const { durationTime } = state
				audio.seek(durationTime * (time / 100))
			}
		}
	},
	actions:{
		async getInfo({state}, { path }){
			const res = await axios({ url:path})
			if(res.code === 200 ){
				return res
			}
		},
		async getMusicInfo({state,commit},{ musicInfo, level='standard', index, isPlay=true }){
			const  { id }  =musicInfo
			if(!id)return 
			const _level = level || state.level
			// 保存歌曲信息
			commit('saveMusicInfo', { musicInfo, index })
			// 当 选取音质和之前一致，不重新请求
			if(level === state.musicInfo.level)return 
			const {data=[]} = await axios({url:`/song/url/v1?id=${id}&level=${_level}`})
			if(data[0]){
				const { time, url, level } = data[0]
				commit('saveUrlAndDurationTime',{url,durationTime:time/1000, level})
				if(isPlay!==state.isPlay || isPlay){
					commit('changePlayStatus', { isPlay })
				}
				if(_level!==state.level){
					commit('chagneToneQuality', { level:_level })
				}
			}
			// console.log(res)
		},
		changeMusic({ state, getters, commit, dispatch }, { params='next' }={}){
			const list = state.musicList
			const len = list.length
			commit('updateDateTime', { currentTime:0, durationTime: 0}) //切换歌曲，初始化进度条和开始时间
			// const musicInfo = state.musicList
			let index = getters.findCurrentPlayIndex(list)
			if(params==='next'){
				if(index===len-1){
					index = 0
				}else{
					index += 1
				}
			} else {
				if(index===0){
					index = len - 1
				} else {
					index -= 1
				}
			}
			dispatch('getMusicInfo', {musicInfo:list[index], index })
		}
	},
	modules:{
		userInfo
	}
})