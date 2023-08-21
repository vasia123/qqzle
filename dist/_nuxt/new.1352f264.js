import{_ as $}from"./InputText.vue.216b243f.js";import{_ as j,u as L}from"./useUploadImage.936de92f.js";import{_ as A}from"./InputTextarea.vue.b05e898e.js";import{_ as E}from"./nuxt-link.6d369b8d.js";import{_ as S}from"./TitleCard.vue.205590db.js";import{_ as q}from"./ModalError.vue.90a3c968.js";import{f as M,g as P,r as o,o as d,c as _,b as l,w as V,i as s,F as z,l as k,a as w,m as F,t as O,d as I,q as Q,j as G,k as H,n as J,s as K}from"./entry.7dd48d94.js";import{u as W}from"./useFirebaseDB.43faeb14.js";const X={key:0},Y=["src"],Z={key:1},ee={class:"flex justify-between mt-8"},ae=["disabled"],se={key:0,class:"loading loading-spinner"},de=M({__name:"new",setup(te){const p=P(),{gamesAndQuestionsCol:U}=W(),{uploadFile:h,resizeImage:D}=L();let r;Array.isArray(p.params.gameId)?r=p.params.gameId.join(""):r=p.params.gameId;const i=o(""),c=o(""),u=o(""),t=o(!1),f=o(null),g=o(null),m=o(0),T=a=>{t.value=!0,f.value=a,D(a,e=>{const n=URL.createObjectURL(e);g.value=n,t.value=!1})},R=async a=>{const e=G(U,r),n=await H(e);if(n.exists()){const v=n.data(),b={name:c.value,image:a,description:u.value,questions:[]},y=[...v.rounds,b];await J(e,{rounds:y}),K("/admin/games/"+r+"/rounds")}else t.value=!1,i.value="Игра не найдена"},C=()=>{t.value=!0;try{if(f.value){const a=h(f.value);a.on("state_changed",e=>{m.value=e.bytesTransferred/e.totalBytes*100},e=>{console.error("Ошибка загрузки:",e),i.value=e.message},async()=>{const e=await Q(a.snapshot.ref);await R(e)})}else R("")}catch(a){t.value=!1,a instanceof Error?i.value=a.message:console.error("Unexpected error",a)}};return(a,e)=>{const n=$,v=j,b=A,y=E,N=S,B=q;return d(),_(z,null,[l(N,{title:"Добавление тура"},{default:V(()=>[l(n,{modelValue:s(c),"onUpdate:modelValue":e[0]||(e[0]=x=>k(c)?c.value=x:null),type:"text","label-title":"Название тура"},null,8,["modelValue"]),l(v,{"label-title":"Изображение тура",onFileSelected:T}),s(g)?(d(),_("div",X,[w("img",{src:s(g),alt:"Превью изображения"},null,8,Y)])):F("",!0),s(m)>0&&s(m)<100?(d(),_("div",Z," Загрузка: "+O(s(m))+"% ",1)):F("",!0),l(b,{modelValue:s(u),"onUpdate:modelValue":e[1]||(e[1]=x=>k(u)?u.value=x:null),"label-title":"Описание"},null,8,["modelValue"]),w("div",ee,[l(y,{class:"btn btn-ghost",to:"/admin/games/"+s(r)+"/rounds"},{default:V(()=>[I("Отмена")]),_:1},8,["to"]),w("button",{class:"btn btn-primary",disabled:s(t),onClick:C},[s(t)?(d(),_("span",se)):F("",!0),I(" Добавить тур ")],8,ae)])]),_:1}),l(B,{message:s(i)},null,8,["message"])],64)}}});export{de as default};