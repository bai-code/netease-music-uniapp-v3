import store from '@/store/index.js'
// 添加歌手
export const addSinger = ({list=[],singerName='ar', spaceMark='/'})=>{
	const len = list.length
	if(len===0)return 
	let str = ''
	list.forEach((item,index)=>{
		if(index===len-1){
			str+=item.name
		}else{
			str+=item.name + '/'
		}
	})
	return str
}

// 对循环的数据进行筛选添加某个属性
export const loopAdd = ({list=[],singerName='ar'}) =>{
	if(list.length===0)return
	list.forEach(item=>{
		item._singer = addSinger({list:item[singerName]})
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
export const playAndCommit= ({ musicList=[],index,musicInfo={}})=>{
	let info = musicInfo
	if(musicList.length>0){
		info = musicList[index]
		store.commit('saveMusicList',{musicList})
	}
	store.dispatch('getMusicInfo',{musicInfo:info,index})
}