(()=>{var e={};e.id=789,e.ids=[789],e.modules={101:(e,t,r)=>{"use strict";r.d(t,{_4:()=>n,f:()=>a});var o=r(92782);let s=process.env.STRIPE_SECRET_KEY;process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;let i=!s,n=s?new o.A(s,{apiVersion:"2024-12-18.acacia",typescript:!0}):null;async function a(e,t="usd"){if(i||!n)return console.log("[DEMO MODE] Payment Intent simulado criado"),{id:`pi_demo_${Date.now()}`,client_secret:`pi_demo_${Date.now()}_secret_demo`,amount:Math.round(100*e),currency:t,status:"succeeded"};try{return await n.paymentIntents.create({amount:Math.round(100*e),currency:t,automatic_payment_methods:{enabled:!0}})}catch(e){throw console.error("Erro ao criar Payment Intent:",e),e}}},3295:e=>{"use strict";e.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},7462:(e,t,r)=>{"use strict";r.d(t,{HP:()=>n,ll:()=>i});var o=r(88909);let s=process.env.DATABASE_URL,i=s?(0,o.lw)(s):null,n=!s},10846:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},28354:e=>{"use strict";e.exports=require("util")},29294:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-async-storage.external.js")},41098:(e,t,r)=>{"use strict";r.d(t,{BE:()=>p,Er:()=>c,HU:()=>d,ZT:()=>_,oC:()=>l});var o=r(87806),s=r(77412),i=r(85663);let n=process.env.JWT_SECRET||"demo-secret-key-not-for-production-use-only",a=new TextEncoder().encode(n);async function d(e,t,r){return await new o.P({userId:e,email:t,role:r}).setProtectedHeader({alg:"HS256"}).setIssuedAt().setExpirationTime("7d").sign(a)}async function u(e){try{let{payload:t}=await (0,s.V)(e,a);return t}catch(e){return null}}async function c(e){let t=await i.Ay.genSalt(10);return i.Ay.hash(e,t)}async function p(e,t){return i.Ay.compare(e,t)}async function l(e){let t=e.headers.get("authorization");if(!t||!t.startsWith("Bearer "))return{error:"N\xe3o autorizado",status:401};let r=t.substring(7),o=await u(r);return o?{user:o}:{error:"Token inv\xe1lido",status:401}}async function _(e){let t=await l(e);return"error"in t?t:"admin"!==t.user.role?{error:"Acesso negado. Apenas administradores.",status:403}:{user:t.user}}process.env.JWT_SECRET},44870:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},45466:(e,t,r)=>{"use strict";r.r(t),r.d(t,{patchFetch:()=>y,routeModule:()=>_,serverHooks:()=>g,workAsyncStorage:()=>m,workUnitAsyncStorage:()=>E});var o={};r.r(o),r.d(o,{GET:()=>p,POST:()=>l});var s=r(96559),i=r(48088),n=r(37719),a=r(32190),d=r(7462),u=r(41098),c=r(101);async function p(e){if(d.HP)return console.log("[DEMO MODE] GET /api/orders - retornando dados simulados"),a.NextResponse.json({orders:[],demoMode:!0,message:"Em modo demonstra\xe7\xe3o. Os pedidos s\xe3o salvos no navegador (localStorage)."});let t=await (0,u.oC)(e);if("error"in t)return a.NextResponse.json({error:t.error},{status:t.status});try{let e;return e="admin"===t.user.role?await (0,d.ll)`
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
        GROUP BY o.id
        ORDER BY o.created_at DESC
      `:await (0,d.ll)`
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
        WHERE o.user_id = ${t.user.userId}
        GROUP BY o.id
        ORDER BY o.created_at DESC
      `,a.NextResponse.json({orders:e})}catch(e){return console.error("Erro ao buscar pedidos:",e),a.NextResponse.json({error:"Erro ao buscar pedidos"},{status:500})}}async function l(e){try{let{items:t,shippingInfo:r,userId:o}=await e.json();if(!t||0===t.length)return a.NextResponse.json({error:"Carrinho vazio"},{status:400});if(!r)return a.NextResponse.json({error:"Informa\xe7\xf5es de envio obrigat\xf3rias"},{status:400});let s=t.reduce((e,t)=>e+t.price*t.quantity,0),i=.1*s,n=s+9.99+i,u=`NP3D-${Date.now()}-${Math.random().toString(36).substr(2,9).toUpperCase()}`,p=await (0,c.f)(n);if(d.HP){console.log("[DEMO MODE] POST /api/orders - criando pedido simulado");let e={id:Date.now(),order_number:u,status:"pending",subtotal:s,shipping:9.99,tax:i,total:n,created_at:new Date().toISOString(),payment_status:"pending",stripe_payment_intent_id:p.id};return a.NextResponse.json({order:e,clientSecret:p.client_secret,demoMode:!0,message:"Pedido criado em modo demonstra\xe7\xe3o. Salve no localStorage do navegador."})}let l=(await (0,d.ll)`
      INSERT INTO orders (
        user_id, order_number, status, subtotal, shipping, tax, total,
        shipping_first_name, shipping_last_name, shipping_email, shipping_phone,
        shipping_address, shipping_city, shipping_state, shipping_zip_code, shipping_country,
        payment_method, payment_status, stripe_payment_intent_id
      )
      VALUES (
        ${o||null}, ${u}, 'pending', ${s}, ${9.99}, ${i}, ${n},
        ${r.firstName}, ${r.lastName}, ${r.email}, ${r.phone},
        ${r.address}, ${r.city}, ${r.state}, ${r.zipCode}, ${r.country},
        'stripe', 'pending', ${p.id}
      )
      RETURNING *
    `)[0];for(let e of t)await (0,d.ll)`
        INSERT INTO order_items (
          order_id, product_id, product_name, quantity, unit_price,
          selected_color, selected_size, selected_material, subtotal
        )
        VALUES (
          ${l.id}, ${e.product.id}, ${e.product.name.en}, ${e.quantity}, ${e.price},
          ${e.selectedColor}, ${e.selectedSize}, ${e.selectedMaterial}, ${e.price*e.quantity}
        )
      `;return a.NextResponse.json({order:l,clientSecret:p.client_secret})}catch(e){return console.error("Erro ao criar pedido:",e),a.NextResponse.json({error:"Erro ao criar pedido"},{status:500})}}let _=new s.AppRouteRouteModule({definition:{kind:i.RouteKind.APP_ROUTE,page:"/api/orders/route",pathname:"/api/orders",filename:"route",bundlePath:"app/api/orders/route"},resolvedPagePath:"/workspaces/Print3D/app/api/orders/route.ts",nextConfigOutput:"",userland:o}),{workAsyncStorage:m,workUnitAsyncStorage:E,serverHooks:g}=_;function y(){return(0,n.patchFetch)({workAsyncStorage:m,workUnitAsyncStorage:E})}},55511:e=>{"use strict";e.exports=require("crypto")},55591:e=>{"use strict";e.exports=require("https")},63033:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},78335:()=>{},79646:e=>{"use strict";e.exports=require("child_process")},81630:e=>{"use strict";e.exports=require("http")},94735:e=>{"use strict";e.exports=require("events")},96487:()=>{}};var t=require("../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),o=t.X(0,[447,368,987,782],()=>r(45466));module.exports=o})();