'use strict';
const featureData={
  summary:{index:'01 / 04',title:'会议结束，重点留下。',description:'粘贴会议记录，或导入 TXT / Markdown，整理成核心结论、个人待办和风险问题。',points:['系统中文语音输入，适合短句和会议要点','待办可勾选，原文按需展开','复制、分享和 TXT 导出'],alt:'会议摘要输入页界面示意'},
  reply:{index:'02 / 04',title:'想清楚，再好好说。',description:'选择领导、同事、客户或朋友，再选择语气倾向，让回复更符合沟通场景。',points:['四种沟通关系与四种语气偏好','生成多种风格，逐条复制','草稿自动保存，返回继续编辑'],alt:'高情商回复页界面示意'},
  history:{index:'03 / 04',title:'重要的事，随时找回。',description:'成功生成的纪要和回复自动保存到本机。按标题、原文或结果搜索，让信息有迹可循。',points:['类型筛选与收藏，快速找到记录','每页 5 条，手机浏览更清晰','查看详情、再次编辑或删除'],alt:'历史记录页界面示意'},
  settings:{index:'04 / 04',title:'按你的习惯，安排工作。',description:'连接自己的 DeepSeek 服务，选择浅色、深色或跟随系统，管理手机上的数据。',points:['API Key 在本机加密保存','支持 JSON / Markdown 全量历史导出','需要时移除密钥、清空记录'],alt:'设置页界面示意'}
};
let lastOpener=null;
function openDialog(id,opener){const dialog=document.getElementById(id);if(!dialog)return;lastOpener=opener||document.activeElement;dialog.showModal();document.body.style.overflow='hidden';}
document.querySelectorAll('[data-dialog]').forEach(button=>button.addEventListener('click',()=>openDialog(button.dataset.dialog,button)));
document.querySelectorAll('dialog').forEach(dialog=>{
  dialog.querySelector('[data-close]').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('close',()=>{document.body.style.overflow='';if(lastOpener&&lastOpener.isConnected)lastOpener.focus();});
  dialog.addEventListener('click',event=>{if(event.target!==dialog)return;const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();});
});
function selectFeature(key){const item=featureData[key];if(!item)return;document.querySelectorAll('[data-feature]').forEach(button=>{const selected=button.dataset.feature===key;button.setAttribute('aria-selected',String(selected));button.tabIndex=selected?0:-1;});document.getElementById('feature-panel').setAttribute('aria-labelledby','tab-'+key);document.getElementById('feature-index').textContent=item.index;document.getElementById('feature-title').textContent=item.title;document.getElementById('feature-description').textContent=item.description;document.getElementById('feature-points').replaceChildren(...item.points.map(text=>{const li=document.createElement('li');li.textContent=text;return li;}));const image=document.getElementById('feature-screen');image.src='./assets/screen-'+key+'.png';image.alt=item.alt;}
const tabs=[...document.querySelectorAll('[data-feature]')];tabs.forEach((button,index)=>{button.addEventListener('click',()=>selectFeature(button.dataset.feature));button.addEventListener('keydown',event=>{let target;if(event.key==='ArrowRight')target=(index+1)%tabs.length;else if(event.key==='ArrowLeft')target=(index+tabs.length-1)%tabs.length;else if(event.key==='Home')target=0;else if(event.key==='End')target=tabs.length-1;else return;event.preventDefault();selectFeature(tabs[target].dataset.feature);tabs[target].focus();});});
const motionButton=document.getElementById('motion-toggle');const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');let motionPreference;try{motionPreference=localStorage.getItem('huiyi-website-motion');}catch{}
function setMotion(enabled,save=false){document.documentElement.classList.toggle('motion-off',!enabled);motionButton.setAttribute('aria-checked',String(enabled));if(save)try{localStorage.setItem('huiyi-website-motion',enabled?'on':'off');}catch{}}
setMotion(!reducedMotion.matches&&motionPreference!=='off');motionButton.addEventListener('click',()=>setMotion(motionButton.getAttribute('aria-checked')!=='true',true));reducedMotion.addEventListener('change',()=>{if(reducedMotion.matches)setMotion(false);});
let toastTimer;function notify(message){const toast=document.getElementById('toast');toast.textContent=message;toast.hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>{toast.hidden=true},2600);}
document.getElementById('copy-checksum').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(document.getElementById('checksum').textContent.trim());notify('校验值已复制');}catch{notify('请长按或选择校验值进行复制');}});
// The download links remain usable even if the metadata request fails.
fetch('./downloads/release.json').then(r=>{if(!r.ok)throw new Error('Metadata unavailable');return r.json();}).then(release=>{const size=(release.bytes/1024/1024).toFixed(2)+' MB';document.querySelectorAll('[data-apk-size]').forEach(el=>{el.textContent=size;});if(/^[a-f0-9]{64}$/i.test(release.sha256))document.getElementById('checksum').textContent=release.sha256;}).catch(()=>{});
function updateDownloadQr(siteUrl = window.location.href) {
 const container=document.getElementById('download-qr'),status=document.getElementById('qr-status');
 if(!container)return;
 const base=new URL(siteUrl),host=base.hostname.toLowerCase();
 const local=base.protocol==='file:'||host==='localhost'||host==='[::1]'||host==='0.0.0.0'||host.endsWith('.localhost')||/^127\./.test(host);
 if(local){container.innerHTML='<span class="qr-empty" aria-hidden="true">▤</span>';status.textContent='当前是本机预览，手机无法访问 localhost。发布官网后会自动显示下载二维码。';delete container.dataset.url;return;}
 const apkUrl=new URL('./downloads/huiyi-1.3.apk',base).href;
 try{const qr=qrcode(0,'M');qr.addData(apkUrl);qr.make();container.innerHTML=qr.createSvgTag({cellSize:4,margin:16,scalable:true});container.dataset.url=apkUrl;container.querySelector('svg').setAttribute('role','img');container.querySelector('svg').setAttribute('aria-label','会意 Android 安装包下载二维码');status.textContent='使用 Android 手机扫码，直接下载安装包。';}catch{status.textContent='二维码暂时不可用，请使用左侧下载按钮。';}
}
updateDownloadQr();