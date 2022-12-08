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