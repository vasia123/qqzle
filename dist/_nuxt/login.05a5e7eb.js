import{_ as g}from"./ModalError.vue.90a3c968.js";import{a2 as m,a3 as f,K as v,f as x,r as _,o as n,c,a as e,i as r,d as p,b,F as y,s as w,p as k,e as M,_ as A}from"./entry.7dd48d94.js";import{u as B}from"./auth.e858c391.js";function S(){const{$auth:s}=v();return{registerUser:async()=>{try{const t=new m;t.addScope("profile"),t.addScope("email");const o=await f(s,t);if(o)return o.user}catch{return null}return null}}}const C=""+globalThis.__publicAssetsURL("images/logo_500.png"),a=s=>(k("data-v-7fefd781"),s=s(),M(),s),F=a(()=>e("div",{class:"bg-image z-0 inset-0 absolute"},null,-1)),I={class:"relative z-10"},U={class:"flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0 h-screen"},E=a(()=>e("a",{href:"#",class:"flex items-center mb-6 text-2xl font-semibold text-gray-900 text-white logo-text"},[e("img",{class:"w-8 h-8 mr-2",src:C,alt:"logo"}),p(" Easy Квизи ")],-1)),N={class:"w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700"},T={class:"p-6 space-y-4 md:space-y-6 sm:p-8"},V={class:"grid space-y-4"},z=["disabled"],L={key:0,id:"google",xmlns:"http://www.w3.org/2000/svg",width:"20",height:"20",class:"mr-2",preserveAspectRatio:"xMidYMid",viewBox:"0 0 256 262"},P=a(()=>e("path",{fill:"#4285F4",d:"M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"},null,-1)),R=a(()=>e("path",{fill:"#34A853",d:"M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"},null,-1)),$=a(()=>e("path",{fill:"#FBBC05",d:"M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"},null,-1)),j=a(()=>e("path",{fill:"#EB4335",d:"M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"},null,-1)),G=[P,R,$,j],H={key:1,class:"loading loading-spinner"},K=x({__name:"login",setup(s){const{registerUser:i}=S(),t=B(),o=_(!1),d=_("");async function u(){o.value=!0;const l=await i();l?(t.setUser(l),w("/")):d.value="не получилось аутентифицировать пользователя!"}return(l,W)=>{const h=g;return n(),c(y,null,[F,e("section",I,[e("div",U,[E,e("div",N,[e("div",T,[e("div",V,[e("button",{class:"btn btn-active btn-primary",disabled:r(o),onClick:u},[r(o)?(n(),c("span",H)):(n(),c("svg",L,G)),p(" Войти ")],8,z)])])])])]),b(h,{message:r(d)},null,8,["message"])],64)}}});const J=A(K,[["__scopeId","data-v-7fefd781"]]);export{J as default};
