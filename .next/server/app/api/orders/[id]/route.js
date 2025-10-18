(()=>{var e={};e.id=413,e.ids=[413],e.modules={3295:e=>{"use strict";e.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},7462:(e,r,t)=>{"use strict";t.d(r,{HP:()=>a,ll:()=>n});var s=t(88909);let o=process.env.DATABASE_URL,n=o?(0,s.lw)(o):null,a=!o},10846:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},29294:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-async-storage.external.js")},41098:(e,r,t)=>{"use strict";t.d(r,{BE:()=>p,Er:()=>c,HU:()=>u,ZT:()=>x,oC:()=>l});var s=t(87806),o=t(77412),n=t(85663);let a=process.env.JWT_SECRET||"demo-secret-key-not-for-production-use-only",i=new TextEncoder().encode(a);async function u(e,r,t){return await new s.P({userId:e,email:r,role:t}).setProtectedHeader({alg:"HS256"}).setIssuedAt().setExpirationTime("7d").sign(i)}async function d(e){try{let{payload:r}=await (0,o.V)(e,i);return r}catch(e){return null}}async function c(e){let r=await n.Ay.genSalt(10);return n.Ay.hash(e,r)}async function p(e,r){return n.Ay.compare(e,r)}async function l(e){let r=e.headers.get("authorization");if(!r||!r.startsWith("Bearer "))return{error:"N\xe3o autorizado",status:401};let t=r.substring(7),s=await d(t);return s?{user:s}:{error:"Token inv\xe1lido",status:401}}async function x(e){let r=await l(e);return"error"in r?r:"admin"!==r.user.role?{error:"Acesso negado. Apenas administradores.",status:403}:{user:r.user}}process.env.JWT_SECRET},44870:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},55511:e=>{"use strict";e.exports=require("crypto")},63033:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},78335:()=>{},96487:()=>{},98367:(e,r,t)=>{"use strict";t.r(r),t.d(r,{patchFetch:()=>y,routeModule:()=>l,serverHooks:()=>R,workAsyncStorage:()=>x,workUnitAsyncStorage:()=>E});var s={};t.r(s),t.d(s,{GET:()=>c,PUT:()=>p});var o=t(96559),n=t(48088),a=t(37719),i=t(32190),u=t(7462),d=t(41098);async function c(e,{params:r}){let t=await (0,d.oC)(e);if("error"in t)return i.NextResponse.json({error:t.error},{status:t.status});try{let e=await (0,u.ll)`
      SELECT o.*,
        json_agg(
          json_build_object(
            'id', oi.id,
            'product_name', oi.product_name,
            'quantity', oi.quantity,
            'unit_price', oi.unit_price,
            'selected_color', oi.selected_color,
            'selected_size', oi.selected_size,
            'selected_material', oi.selected_material,
            'subtotal', oi.subtotal
          )
        ) as items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE o.id = ${r.id}
      GROUP BY o.id
    `;if(0===e.length)return i.NextResponse.json({error:"Pedido n\xe3o encontrado"},{status:404});let s=e[0];if("admin"!==t.user.role&&s.user_id!==t.user.userId)return i.NextResponse.json({error:"Acesso negado"},{status:403});return i.NextResponse.json({order:s})}catch(e){return console.error("Erro ao buscar pedido:",e),i.NextResponse.json({error:"Erro ao buscar pedido"},{status:500})}}async function p(e,{params:r}){let t=await (0,d.ZT)(e);if("error"in t)return i.NextResponse.json({error:t.error},{status:t.status});try{let{status:t}=await e.json();if(!["pending","processing","shipped","delivered","cancelled"].includes(t))return i.NextResponse.json({error:"Status inv\xe1lido"},{status:400});let s=await (0,u.ll)`
      UPDATE orders
      SET status = ${t}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${r.id}
      RETURNING *
    `;if(0===s.length)return i.NextResponse.json({error:"Pedido n\xe3o encontrado"},{status:404});return i.NextResponse.json({order:s[0]})}catch(e){return console.error("Erro ao atualizar pedido:",e),i.NextResponse.json({error:"Erro ao atualizar pedido"},{status:500})}}let l=new o.AppRouteRouteModule({definition:{kind:n.RouteKind.APP_ROUTE,page:"/api/orders/[id]/route",pathname:"/api/orders/[id]",filename:"route",bundlePath:"app/api/orders/[id]/route"},resolvedPagePath:"/workspaces/Print3D/app/api/orders/[id]/route.ts",nextConfigOutput:"",userland:s}),{workAsyncStorage:x,workUnitAsyncStorage:E,serverHooks:R}=l;function y(){return(0,a.patchFetch)({workAsyncStorage:x,workUnitAsyncStorage:E})}}};var r=require("../../../../webpack-runtime.js");r.C(e);var t=e=>r(r.s=e),s=r.X(0,[447,368,987],()=>t(98367));module.exports=s})();