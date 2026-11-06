'use strict';
const entries = [
 {id:'poznavat',short:'Poznávať',title:'Chcem poznávať ľudí a miesta.',question:'Kam ťa vedie zvedavosť?',text:'Spoznávanie ľudí a miest je začiatkom vzťahov. Prvým otvoreným smerom je TOPTOUR — cestovanie a zážitky.',links:[['Spoznať TOPTOUR','https://toptour.top/']]},
 {id:'spolupraca',short:'Spolupracovať',title:'Hľadám pomoc alebo spoluprácu.',question:'S čím ti môžeme pomôcť?',text:'Napíš, čo chceš dosiahnuť, akú pomoc hľadáš a kde pôsobíš. Tak sa môže začať konkrétny rozhovor.',links:[['Opísať svoju potrebu','#vlastne']]},
 {id:'ponuka',short:'Ponúknuť',title:'Mám čo ponúknuť.',question:'Čím by si rád prispel?',text:'Skúsenosti, práca, výrobok, služba alebo miesto — predstav svoju ponuku a komu môže byť užitočná. Obchodná platforma jarmok.shop sa pripravuje.',links:[['Predstaviť svoju ponuku','#vlastne']]},
 {id:'zamer',short:'Tvoriť',title:'Chcem uskutočniť svoj zámer.',question:'Čo chceš vytvoriť?',text:'Predstav svoj zámer, čo už máš pripravené a koho potrebuješ k spolupráci. Začnime prvým uskutočniteľným krokom.',links:[['Opísať svoj zámer','#vlastne']]}
];
const byId = id => document.getElementById(id);
function selectEntry(entry) {
 byId('detailTag').textContent=entry.short;
 byId('detailTitle').textContent=entry.question;
 byId('detailText').textContent=entry.text;
 byId('links').replaceChildren(...entry.links.map(([label,url])=>{const a=document.createElement('a');a.textContent=label+' ↗';a.href=url;return a;}));
 byId('detail').hidden=false;
 byId('detail').scrollIntoView({block:'center'});
 byId('detail').focus({preventScroll:true});
 document.querySelectorAll('.choice').forEach(b=>b.setAttribute('aria-expanded',String(b.dataset.id===entry.id)));
}
entries.forEach((entry,i)=>{
 const b=document.createElement('button');b.className='choice';b.type='button';b.dataset.id=entry.id;b.setAttribute('aria-controls','detail');b.setAttribute('aria-expanded','false');
 const n=document.createElement('b');n.textContent='0'+(i+1);const label=document.createElement('span');label.textContent=entry.title;b.append(n,label);
 b.addEventListener('click',()=>selectEntry(entry));byId('choices').append(b);
});
byId('back').addEventListener('click',()=>{byId('detail').hidden=true;document.querySelectorAll('.choice').forEach(b=>b.setAttribute('aria-expanded','false'));document.querySelector('.choice').focus();});
byId('copy').addEventListener('click',async()=>{
 const value=byId('message').value.trim();if(!value){byId('copyStatus').textContent='Najprv napíš svoj zámer.';byId('message').focus();return;}
 try{await navigator.clipboard.writeText(value);byId('copyStatus').textContent='Skopírované. Text môžeš vložiť do svojej správy.';}
 catch{byId('message').focus();byId('message').select();byId('copyStatus').textContent='Text je označený. Skopíruj ho pomocou Ctrl+C alebo ponuky svojho zariadenia.';}
});
// Standalone Engine + createScene lifecycle follows slapiar/CoolBabylon.
// Navigation remains usable when WebGL or the Babylon CDN is unavailable.
function mountGuider(){
 const B=window.BABYLON;if(!B)throw new Error('Babylon sa nenačítal');
 const canvas=byId('scene'),engine=new B.Engine(canvas,true,{stencil:true});
 let scene,observer;
 try{
 scene=new B.Scene(engine);scene.clearColor=new B.Color4(0,0,0,0);
 const camera=new B.ArcRotateCamera('camera',-Math.PI/2,1.3,12,new B.Vector3(0,1.1,0),scene);
 camera.lowerRadiusLimit=9;camera.upperRadiusLimit=16;camera.lowerBetaLimit=.8;camera.upperBetaLimit=1.5;
 camera.attachControl(canvas,true);camera.inputs.removeByType('ArcRotateCameraKeyboardMoveInput');
 new B.HemisphericLight('sky',new B.Vector3(0,1,-1),scene).intensity=1.1;
 const wood=new B.StandardMaterial('wood',scene);wood.diffuseColor=B.Color3.FromHexString('#af8050');
 const gold=new B.StandardMaterial('gold',scene);gold.diffuseColor=B.Color3.FromHexString('#bf984b');
 const base=B.MeshBuilder.CreateCylinder('island',{diameter:9,height:.25,tessellation:64},scene);base.position.y=-1.45;base.material=wood;
 entries.forEach((entry,i)=>{
  const x=(i%2)*3.6-1.8,y=2.8-Math.floor(i/2)*2.5;
  const root=new B.TransformNode(entry.id,scene);root.position.set(x,y,0);
  const board=B.MeshBuilder.CreateBox(entry.id+'-board',{width:3.15,height:1.8,depth:.16},scene);board.parent=root;
  const tex=new B.DynamicTexture(entry.id+'-label',{width:768,height:440},scene,false);const ctx=tex.getContext();
  ctx.fillStyle='#f1e6c9';ctx.fillRect(0,0,768,440);ctx.strokeStyle='#bd995d';ctx.lineWidth=12;ctx.strokeRect(16,16,736,408);
  ctx.fillStyle='#94723f';ctx.font='32px sans-serif';ctx.textAlign='center';ctx.fillText('0'+(i+1),384,110);
  ctx.fillStyle='#173a32';ctx.font='bold 55px sans-serif';ctx.fillText(entry.short,384,250);ctx.font='24px sans-serif';ctx.fillText('VSTÚPIŤ  →',384,350);tex.update();
  const mat=new B.StandardMaterial(entry.id+'-material',scene);mat.diffuseTexture=tex;mat.specularColor=B.Color3.Black();board.material=mat;
  board.actionManager=new B.ActionManager(scene);
  board.actionManager.registerAction(new B.ExecuteCodeAction(B.ActionManager.OnPickTrigger,()=>selectEntry(entry)));
  board.actionManager.registerAction(new B.ExecuteCodeAction(B.ActionManager.OnPointerOverTrigger,()=>{root.scaling.setAll(1.04);}));
  board.actionManager.registerAction(new B.ExecuteCodeAction(B.ActionManager.OnPointerOutTrigger,()=>{root.scaling.setAll(1);}));
  [-1.65,1.65].forEach(dx=>{const post=B.MeshBuilder.CreateBox(entry.id+'-post',{width:.12,height:2.1,depth:.22},scene);post.parent=root;post.position.x=dx;post.material=gold;});
 });
 observer=new ResizeObserver(()=>engine.resize());observer.observe(canvas.parentElement);
 const render=()=>scene.render();engine.runRenderLoop(render);
 const visibility=()=>document.hidden?engine.stopRenderLoop(render):engine.runRenderLoop(render);
 document.addEventListener('visibilitychange',visibility);
 window.addEventListener('pagehide',()=>{document.removeEventListener('visibilitychange',visibility);observer.disconnect();scene.dispose();engine.dispose();},{once:true});
 byId('sceneStatus').textContent='Vyber si bránu. Pohľad môžeš otočiť potiahnutím.';
 }catch(error){observer?.disconnect();scene?.dispose();engine.dispose();throw error;}
}
try{mountGuider();}catch(error){byId('sceneStatus').textContent='Pokračuj výberom v textovej navigácii.';console.warn('3D guider:',error.message);}
