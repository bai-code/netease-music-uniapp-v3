// 提供热门榜单数据
import axios from '@/utils/axios.js'
import { loopAdd } from '@/utils/plugins.js'

export default {
	namespaced:true,
	state:{
		rankingList:[],
		mainRankingList:[]
	},
	mutations:{
		saveRankingList(state, { isMain, list=[], index }){
			if(isMain){
				state.mainRankingList[index] = list
			}else{
				state.rankingList = list
			}
		}
	},
	actions:{
		async getPlaylistDetail ({ commit }, { id, index }){
			const { playlist = {} } = await axios({ url:`/playlist/detail?id=${id}&limit=8` })
			playlist.tracks = loopAdd({ list:playlist.tracks })
			// mainRankingList[index]= playlist
			commit('saveRankingList', { list:playlist,index, isMain:true })
		},
		async getRankingList ({ commit, dispatch }){
			const { list = []} = await axios({ url:`/toplist` })
			const tempMainRankingList = list.filter(item=>{
				return item.ToplistType
			})
			const tempRankingList = list.filter(item=>{
				return !item.ToplistType
			})
			commit('saveRankingList', { list: tempRankingList })
			
			// 获取主要列表数据
			tempMainRankingList.forEach((item,index)=>{
				const { id } = item
				dispatch('getPlaylistDetail', {id,index})
			})
			// console.log(context);
		}
		
		
	}
}