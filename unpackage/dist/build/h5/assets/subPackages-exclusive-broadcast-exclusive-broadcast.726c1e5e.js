import{aa as a,f as s,_ as o,o as e,c as t,w as i,i as c,a as l,B as n,C as r,F as d,u as p,k as u,l as f,d as m}from"./index.88361eb6.js";import{_}from"./video-temp.bdb93370.js";import{_ as v}from"./scrollView-backTop.c40c26d0.js";import{_ as b}from"./_plugin-vue_export-helper.cdc0426e.js";import"./u-loading-icon.f23f30cd.js";const g=b({__name:"exclusive-broadcast",setup(b){const g=p(),h=a([]);s(!0);const j=async()=>{x.value=!0;const a=h.length,{more:s,result:o}=await g.dispatch("getInfo",{path:`/personalized/privatecontent/list?limit=20&offset=${a}`});h.push(...o),x.value=!1},x=s(!1),k=()=>{j()};return o((()=>{j()})),(a,s)=>{const o=m,p=c,b=u(f("video-temp"),_),g=u(f("scrollView-backTop"),v);return e(),t(p,{class:"exclusive-broadcast"},{default:i((()=>[l(g,{onScrollToBottom:k,isLoading:x.value},{default:i((()=>[(e(!0),n(d,null,r(h,(a=>(e(),t(b,{videoInfo:a,imageName:"sPicUrl",key:a.id},{default:i((()=>[l(p,{class:"play-icon"},{default:i((()=>[l(o,{class:"iconfont icon-play"})])),_:1})])),_:2},1032,["videoInfo"])))),128))])),_:1},8,["isLoading"])])),_:1})}}},[["__scopeId","data-v-8c5e9a08"]]);export{g as default};