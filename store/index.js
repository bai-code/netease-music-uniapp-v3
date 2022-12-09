import { createStore } from 'vuex'
import  axios from '@/utils/axios.js' 
import audio from '@/utils/audio.js'
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

export default createStore({
	state:{
			musicInfo,  // 当前播放歌曲信息
			musicList, // 歌曲列表
			currentTime:0, //当前播放进度
			durationTime:0, // 当前歌曲总时长
			level:'standard', // 音质
			current:-1, //当前播放第几首
	},
	getters:{
		findCurrentPlayIndex(state){
			return function (list){
				const targetList = JSON.stringify(state.musicList)
				const originList = JSON.stringify(list)
				if(targetList === originList){
					const {  id } = state.musicInfo
					return list.findIndex(item=>{
						return item.id === id
					})
				}
			}
		}
	},
	mutations:{
		play(){
			audio.play()
		},
		pause(){
			audio.pause()
		},
		saveUrlAndDurationTime(state,{url,durationTime, level}){
			console.log(state.musicInfo,url);
			audio.src=url
			audio.play()
			state.level = level
			state.musicInfo.url=url
			state.durationTime=durationTime
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
		}
	},
	actions:{
		getInfo(){
			
		},
		async getMusicInfo({state,commit},{ musicInfo,level='standard', index }){
			const  { id }  =musicInfo
			const _level = level || state.level
			// 当 选取音质和之前一致，不重新请求
			if(level === state.musicInfo.level)return 
			const {data=[]} = await axios({url:`/song/url/v1?id=${id}&level=${_level}`})
			if(data[0]){
				console.log(data[0]);
				const { time, url, level } = data[0]
				commit('saveUrlAndDurationTime',{url,durationTime:time, level})
				
			}
			// console.log(res)
		}
	}
})