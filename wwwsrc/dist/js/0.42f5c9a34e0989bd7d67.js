webpackJsonp([0,1],{52:function(t,e,o){"use strict";function i(t){o(55)}Object.defineProperty(e,"__esModule",{value:!0});var n=o(57),a=o(58),s=o(13),r=i,l=s(n.a,a.a,!1,r,"data-v-397ad480",null);e.default=l.exports},54:function(t,e,o){"use strict";function i(t){o(63)}Object.defineProperty(e,"__esModule",{value:!0});var n=o(66),a=o(67),s=o(13),r=i,l=s(n.a,a.a,!1,r,null,null);e.default=l.exports},55:function(t,e,o){var i=o(56);"string"==typeof i&&(i=[[t.i,i,""]]),i.locals&&(t.exports=i.locals);o(51)("37c3d873",i,!0)},56:function(t,e,o){e=t.exports=o(50)(void 0),e.push([t.i,".bt[data-v-397ad480]{color:#000}.list[data-v-397ad480]{margin-bottom:1rem}.q-list[data-v-397ad480]{border:none}.delete[data-v-397ad480]{color:#be0505;margin-bottom:.5rem}",""])},57:function(t,e,o){"use strict";var i=o(12);e.a={name:"todo",components:{QBtn:i.b,QCollapsible:i.c,QList:i.j,QItemMain:i.f,QItemSide:i.g,QItemTile:i.h,Dialog:i.a,QItem:i.e},data:function(){return{}},computed:{todos:function(){return this.$store.state.todos},info:function(){return this.$store.state.info}},methods:{toggleComplete:function(t){var e={userId:this.info._id,todoId:t};this.$store.dispatch("toggleComplete",e)},addItem:function(){var t=this;i.a.create({title:"Add a ToDo Item",form:{title:{type:"text",label:"Task",model:""},description:{type:"text",label:"Description",model:""}},buttons:[{label:"Cancel",color:"negative"},{label:"Add Item",handler:function(e){t.$store.dispatch("addTodo",e)}}]})},deleteTask:function(t){var e=this,o={todoId:t,userId:this.info._id};swal("Are you sure you want to delete this?",{buttons:{cancel:"Nope!",delete:!0}}).then(function(t){switch(t){case"delete":e.$store.dispatch("deleteTodo",o),swal("Welp, that's gone forever");break;case"cancel":default:return}})}},mounted:function(){}}},58:function(t,e,o){"use strict";var i=function(){var t=this,e=t.$createElement,o=t._self._c||e;return o("div",{staticClass:"todo"},[o("q-btn",{staticClass:"full-width bt",attrs:{push:"",icon:"note_add"},on:{click:t.addItem}},[t._v("Add New Item")]),t._v(" "),t._l(t.todos,function(e){return o("div",[o("q-list",[e.completed?o("div",[o("q-item",[o("q-item-side",{attrs:{left:""}},[o("q-btn",{staticClass:"list",attrs:{small:"",push:"",color:"green-9",round:"",icon:"done"},on:{click:function(o){t.toggleComplete(e._id)}}})],1),t._v(" "),o("q-item-main"),t._v(" "),o("q-item-side",{attrs:{right:""}},[o("q-btn",{staticClass:"delete",attrs:{small:"",push:"",round:"",icon:"delete"},on:{click:function(o){t.deleteTask(e._id)}}})],1)],1),t._v(" "),o("q-collapsible",{attrs:{indent:"",label:e.title},on:{click:function(o){t.toggleComplete(e._id)}}},[o("div",[o("p",[t._v(t._s(e.description))])])])],1):o("div",[o("q-item",[o("q-item-side",{attrs:{left:""}},[o("q-btn",{staticClass:"list",attrs:{push:"",small:"",color:"red-9",round:"",icon:"clear"},on:{click:function(o){t.toggleComplete(e._id)}}})],1),t._v(" "),o("q-item-main"),t._v(" "),o("q-item-side",{attrs:{right:""}},[o("q-btn",{staticClass:"delete",attrs:{small:"",push:"",round:"",icon:"delete"},on:{click:function(o){t.deleteTask(e._id)}}})],1)],1),t._v(" "),o("q-collapsible",{attrs:{indent:"",label:e.title},on:{click:function(o){t.toggleComplete(e._id)}}},[o("div",[o("p",[t._v(t._s(e.description))])])])],1)])],1)})],2)},n=[],a={render:i,staticRenderFns:n};e.a=a},63:function(t,e,o){var i=o(64);"string"==typeof i&&(i=[[t.i,i,""]]),i.locals&&(t.exports=i.locals);o(51)("c4d45646",i,!0)},64:function(t,e,o){e=t.exports=o(50)(void 0),e.push([t.i,".src{color:#fff}.quo{padding-top:4rem}.clock,.quo{color:#fff;text-shadow:0 0 3px #000}.clock{font-size:10rem}.quo-mobile{padding-top:2rem}.clock-mobile,.quo-mobile{color:#fff;text-shadow:0 0 3px #000}.clock-mobile{font-size:5rem}.topbar{background-color:hsla(0,0%,100%,.2);color:#000}.logo-container{width:50%;height:242px;-webkit-perspective:800px;perspective:800px;position:absolute;top:30%;left:60%;-webkit-transform:translateX(-50%) translateY(-50%);transform:translateX(-50%) translateY(-50%)}.logo-container-mobile{width:75%;top:20%}.logo-container-mobile,.quote-container{height:242px;-webkit-perspective:800px;perspective:800px;position:absolute;left:50%;-webkit-transform:translateX(-50%) translateY(-50%);transform:translateX(-50%) translateY(-50%)}.quote-container{width:50%;top:50%}.logo{position:absolute;-webkit-transform-style:preserve-3d;transform-style:preserve-3d}.back{background-image:url("+o(65)+");background-attachment:fixed;background-repeat:no-repeat;background-size:cover}",""])},65:function(t,e,o){t.exports=o.p+"img/seaBackground.b4cd6bc.jpg"},66:function(t,e,o){"use strict";function i(t,e,o){var i=o>0?1:-1;return{roll:Math.atan2(e,i*Math.sqrt(Math.pow(o,2)+.001*Math.pow(t,2)))*l,pitch:-Math.atan2(t,Math.sqrt(Math.pow(e,2)+Math.pow(o,2)))*l}}var n=o(52),a=o(12),s=a.o.viewport,r=a.p.position,l=180/Math.PI;e.a={name:"index",components:{QLayout:a.i,QToolbar:a.l,QToolbarTitle:a.m,QBtn:a.b,QIcon:a.d,QList:a.j,QListHeader:a.k,QItem:a.e,QItemSide:a.g,QItemMain:a.f,Todo:n.default,Dialog:a.a},data:function(){return{orienting:window.DeviceOrientationEvent&&!this.$q.platform.is.desktop,rotating:window.DeviceMotionEvent&&!this.$q.platform.is.desktop,moveX:0,moveY:0,rotateY:0,rotateX:0,logging:!0,h:0,s:0,m:0}},computed:{rand:function(){return"statics/pics/"+this.$store.state.rand+".jpg"},position:function(){var t="rotateX("+this.rotateX+"deg) rotateY("+this.rotateY+"deg)";return{top:this.moveY+"px",left:this.moveX+"px","-webkit-transform":t,"-ms-transform":t,transform:t}},info:function(){return this.$store.state.info},photo:function(){return this.$store.state.photo},quote:function(){return this.$store.state.quote}},methods:{launch:function(t){Object(a.q)(t)},move:function(t){var e=s(),o=e.width,i=e.height,n=r(t),a=n.top,l=n.left,c=i/2,d=o/2;this.moveX=(l-d)/d*-30,this.moveY=(a-c)/c*-30,this.rotateY=l/o*40*2-40,this.rotateX=-(a/i*40*2-40)},rotate:function(t){if(t.rotationRate&&null!==t.rotationRate.beta&&null!==t.rotationRate.gamma)this.rotateX=.7*t.rotationRate.beta,this.rotateY=-.7*t.rotationRate.gamma;else{var e=t.acceleration.x||t.accelerationIncludingGravity.x,o=t.acceleration.y||t.accelerationIncludingGravity.y,n=t.acceleration.z||t.accelerationIncludingGravity.z-9.81,a=i(e,o,n);this.rotateX=.7*a.roll,this.rotateY=-.7*a.pitch}},orient:function(t){null===t.beta||null===t.gamma?(window.removeEventListener("deviceorientation",this.orient,!1),this.orienting=!1,window.addEventListener("devicemotion",this.rotate,!1)):(this.rotateX=.7*t.beta,this.rotateY=-.7*t.gamma)},logout:function(){var t=this;a.a.create({title:"Are you sure you want to logout?",message:"Currently logged in as "+this.info.name,buttons:["Cancel",{label:"logout",handler:function(e){t.$store.dispatch("logout")}}]})},login:function(){var t=this;a.a.create({title:"Login",message:"Need an account? Press the 'Register' button below",position:"left",form:{email:{type:"email",label:"Email",model:""},password:{type:"password",label:"Password",model:""}},buttons:[{label:"Cancel",color:"negative"},{label:"Login",color:"positive",handler:function(e){t.$store.dispatch("login",e)}},{label:"Register",handler:function(){t.register()}}]})},register:function(){var t=this;a.a.create({title:"Register",message:"Already have an account? Press the 'Login' button below",position:"right",form:{name:{type:"text",label:"Name",model:""},email:{type:"email",label:"Email",model:""},password:{type:"password",label:"Password",model:""}},buttons:[{label:"Cancel",color:"negative"},{label:"Register",handler:function(e){t.$store.dispatch("register",e)}}]})},startTime:function(){var t=new Date;this.h=t.getHours(),this.m=t.getMinutes(),this.s=t.getSeconds(),this.m=this.checkTime(this.m),this.s=this.checkTime(this.s);setTimeout(this.startTime,500)},checkTime:function(t){return t<10&&(t="0"+t),t}},mounted:function(){var t=this;this.$nextTick(function(){t.orienting?window.addEventListener("deviceorientation",t.orient,!1):t.rotating?window.addEventListener("devicemove",t.rotate,!1):document.addEventListener("mousemove",t.move)}),this.$store.state.info._id&&this.$store.dispatch("getUserTodos",this.info._id),this.startTime()},beforeDestroy:function(){this.orienting?window.removeEventListener("deviceorientation",this.orient,!1):this.rotating?window.removeEventListener("devicemove",this.rotate,!1):document.removeEventListener("mousemove",this.move)}}},67:function(t,e,o){"use strict";var i=function(){var t=this,e=t.$createElement,o=t._self._c||e;return o("q-layout",{ref:"layout",staticClass:"back",style:{backgroundImage:"url("+t.rand+")"},attrs:{view:"lHh Lpr fff","left-class":{"bg-grey-2":!0}}},[o("q-toolbar",{staticClass:"glossy topbar",attrs:{slot:"header"},slot:"header"},[null!=t.info._id?o("div",[o("q-btn",{attrs:{flat:""},on:{click:function(e){t.$refs.layout.toggleLeft()}}},[o("q-icon",{attrs:{name:"menu"}})],1)],1):t._e(),t._v(" "),o("q-toolbar-title",[t._v("\n      Inspire\n    ")]),t._v(" "),null==t.info._id?o("div",[o("q-btn",{attrs:{flat:"",link:""},on:{click:t.login}},[o("q-icon",{attrs:{name:"person"}})],1)],1):o("div",[o("q-btn",{attrs:{flat:"",link:""},on:{click:t.logout}},[o("q-icon",{attrs:{name:"person"}})],1)],1)],1),t._v(" "),null!=t.info._id?o("div",{attrs:{slot:"left"},slot:"left"},[o("div",[o("todo")],1)]):t._e(),t._v(" "),o("div",{staticClass:"layout-padding logo-container non-selectable no-pointer-events mobile-hide desktop-only"},[o("div",{staticClass:"logo",style:t.position},[o("h1",{staticClass:"clock text-bold"},[t._v(t._s(t.h)+":"+t._s(t.m))])])]),t._v(" "),o("div",{staticClass:"layout-padding quote-container non-selectable no-pointer-events mobile-hide desktop-only"},[o("div",{staticClass:"quo",style:t.position},[o("h4",{staticClass:"desktop-only"},[t._v(t._s(t.quote.quote))]),t._v(" "),o("p",{staticClass:"desktop-only"},[t._v("-"+t._s(t.quote.author))])])]),t._v(" "),o("div",{staticClass:"layout-padding logo-container-mobile non-selectable no-pointer-events desktop-hide mobile-only"},[o("div",{staticClass:"logo-mobile"},[o("h1",{staticClass:"clock-mobile text-bold"},[t._v(t._s(t.h)+":"+t._s(t.m))]),t._v(" "),o("div",{staticClass:"quo-mobile"},[o("h4",[t._v(t._s(t.quote.quote))]),t._v(" "),o("h5",[t._v("-"+t._s(t.quote.author))])])])]),t._v(" "),o("div",{staticClass:"fixed-bottom-right absolute-bottom-right"},[o("a",{staticClass:"src",attrs:{href:"//unsplash.com/",target:"_blank"}},[t._v("Image From Unsplash.com")])])],1)},n=[],a={render:i,staticRenderFns:n};e.a=a}});