'use strict';
const VERSIONS=[
 {id:'v1',version:'V1.0',title:'最早真人版',type:'真人剪辑',summary:'最初的真人镜头剪辑，用相遇、独处和雨景串起歌曲。',detail:'保留早期剪辑的画面与顺序。横屏镜头完整放入竖屏构图，歌词随歌曲出现。',tags:['真人镜头','完整歌词'],poster:'library/posters/v1.jpg',src:'library/videos/v1.mp4'},
 {id:'v2',version:'V2.0',title:'真人叙事版',type:'真人剪辑',summary:'在真人画面里加入等待、回复与没发出去的话。',detail:'保留“我到了”到“我可以再等”的早期叙事。聊天与歌词重新排入竖屏，横屏原镜头保持完整。',tags:['真人镜头','消息叙事'],poster:'library/posters/v2.jpg',src:'library/videos/v2.mp4'},
 {id:'v3',version:'V3.0',title:'手绘歌词版',type:'手绘动画',summary:'纸张、信封、棋盘与线条，让歌词成为画面的一部分。',detail:'早期线稿风格：十九段视觉场景对应歌曲，文字随波浪、雨和牵引的线条变化。',tags:['线稿手绘','动态歌词'],poster:'library/posters/v3.jpg',src:'library/videos/v3.mp4'},
 {id:'v4',version:'V4.0',title:'雨夜插画版',type:'手绘动画',summary:'窗边、街道和海边，以雨夜插画呈现等待。',detail:'细腻绘画背景配合雨滴、热气和海面反光。歌词出现在玻璃、街灯和雨景之间。',tags:['雨夜插画','场景歌词'],poster:'library/posters/v4.jpg',src:'library/videos/v4.mp4'},
 {id:'v5',version:'V5.0',title:'手机动作版',type:'手绘动画',summary:'拿起手机、输入、删除，再把手机放回桌上。',detail:'保留当时的手部和手机动作、屏幕聊天与相册回忆，让迟疑发生在输入与发送之间。',tags:['手机动作','输入与删除'],poster:'library/posters/v5.jpg',src:'library/videos/v5.mp4'},
 {id:'v6',version:'V6.0',title:'手绘聊天版',type:'聊天叙事',summary:'聊天直接浮现在画面中，关系藏在消息与停顿里。',detail:'从失约、等待到写下又删除“我可以再等”。雨夜、海边与聊天一起推进原来的故事。',tags:['画面聊天','未发送草稿'],poster:'library/posters/v6.jpg',src:'library/videos/v6.mp4'},
 {id:'v7',version:'V7.0',title:'回应之间',type:'聊天叙事',summary:'一个希望多些回应，一个习惯保持距离。',detail:'最新的情感需求故事。对话从反复确认走向压低自己的需要；背景经历同处一室、短暂的温柔、离开的背影，最后留下空房间。',tags:['情感需求差异','人物离开'],poster:'library/posters/v7.jpg',src:'library/videos/v7.mp4'}
];
const $=id=>document.getElementById(id),video=$('movie');
let selected=null,metadata={};
function announce(message){$('status').textContent=message;}
function formatBytes(n){return n?`${(n/1e6).toFixed(1)} MB`:'MP4';}
function fillMeta(){const m=metadata[selected.id];$('size').textContent=m?formatBytes(m.bytes):'MP4';$('download-size').textContent=m?formatBytes(m.bytes):'MP4';}
function setVersion(id,{history=true,autoplay=false}={}){
 const found=VERSIONS.find(v=>v.id===id)||VERSIONS[VERSIONS.length-1];
 if(selected?.id===found.id)return;
 // A single video element prevents an older selection from continuing to play.
 video.pause();selected=found;
 video.poster=found.poster;video.src=found.src;video.load();
 $('version-label').textContent=found.version;$('now-title').textContent=found.title;$('now-summary').textContent=found.summary;$('now-detail').textContent=found.detail;
 $('download').href=found.src;$('download').download=`周旋-${found.version}-${found.title}-抖音竖屏版.mp4`;
 $('download-top').href=found.src;$('download-top').download=$('download').download;$('download-top').textContent=`下载 ${found.version} ↓`;
 $('download').setAttribute('aria-label',`下载 ${found.version} ${found.title} MP4`);
 $('download-text').textContent=`下载 ${found.version}`;
 $('tags').replaceChildren(...found.tags.map(t=>{const e=document.createElement('span');e.textContent=t;return e}));
 document.querySelectorAll('.version').forEach(b=>{const on=b.dataset.id===found.id;b.setAttribute('aria-pressed',String(on));b.classList.toggle('selected',on);b.querySelector('.version-state').textContent=on?'正在查看':'选择观看';});
 fillMeta();if(history)window.history.replaceState(null,'',`#${found.id}`);
 document.title=`周旋 · ${found.version} ${found.title}`;
 announce(`已切换到 ${found.version} ${found.title}，点击播放观看。`);
 if(autoplay)video.play().catch(()=>announce('点击播放器中的播放按钮，即可观看。'));
}
function renderVersions(){const list=$('versions');VERSIONS.forEach(v=>{
 const button=document.createElement('button');button.className='version';button.type='button';button.dataset.id=v.id;button.setAttribute('aria-pressed','false');
 const image=document.createElement('img');image.src=v.poster;image.alt='';image.loading='lazy';image.width=48;image.height=72;
 const body=document.createElement('span');body.className='version-body';
 const number=document.createElement('span');number.className='version-number';number.textContent=v.version+(v.id==='v7'?' · 最新':'');
 const title=document.createElement('strong');title.textContent=v.title;
 const sub=document.createElement('span');sub.className='version-sub';sub.textContent=v.type;
 const state=document.createElement('span');state.className='version-state';state.textContent='选择观看';
 body.append(number,title,sub);button.append(image,body,state);button.onclick=()=>{setVersion(v.id,{autoplay:true});if(matchMedia('(max-width:760px)').matches)$('viewer').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth',block:'start'});};list.append(button);
 });}
$('download').addEventListener('click',()=>announce(`正在下载 ${selected.version}。手机若打开视频页面，可从分享菜单存储视频。`));
$('share').onclick=async()=>{
 const url=new URL(location.href);url.hash=selected.id;
 try{await navigator.clipboard.writeText(url.href);announce(`${selected.version} 的观看链接已复制。`);$('share-label').textContent='已复制';setTimeout(()=>$('share-label').textContent='复制链接',2200);}
 catch{const field=$('share-url');field.hidden=false;field.value=url.href;field.focus();field.select();announce('请复制下方链接。');}
};
video.addEventListener('error',()=>{if(!video.currentSrc)return;announce('视频未能加载，请检查网络后点击“重新加载”，或直接下载。');$('retry').hidden=false;});
video.addEventListener('loadedmetadata',()=>{$('retry').hidden=true;});
$('retry').onclick=()=>{video.load();announce('正在重新加载当前视频。');};
window.addEventListener('hashchange',()=>setVersion(location.hash.slice(1),{history:false}));
renderVersions();setVersion(location.hash.slice(1)||'v7');
fetch('library/manifest.json',{cache:'no-cache'}).then(r=>{if(!r.ok)throw Error('metadata');return r.json()}).then(rows=>{metadata=Object.fromEntries(rows.map(v=>[v.id,v]));fillMeta();}).catch(()=>{});
