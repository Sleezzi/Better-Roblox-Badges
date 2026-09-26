"use strict";(()=>{var T=Object.create;var n=Object.defineProperty;var x=Object.getOwnPropertyDescriptor;var M=Object.getOwnPropertyNames;var N=Object.getPrototypeOf,L=Object.prototype.hasOwnProperty;var u=(t,e)=>()=>(e||t((e={exports:{}}).exports,e),e.exports);var H=(t,e,s,r)=>{if(e&&typeof e=="object"||typeof e=="function")for(let l of M(e))!L.call(t,l)&&l!==s&&n(t,l,{get:()=>e[l],enumerable:!(r=x(e,l))||r.enumerable});return t};var d=(t,e,s)=>(s=t!=null?T(N(t)):{},H(e||!t||!t.__esModule?n(s,"default",{value:t,enumerable:!0}):s,t));var v=u(i=>{"use strict";var S=Symbol.for("react.transitional.element"),k=Symbol.for("react.fragment");function p(t,e,s){var r=null;if(s!==void 0&&(r=""+s),e.key!==void 0&&(r=""+e.key),"key"in e){s={};for(var l in e)l!=="key"&&(s[l]=e[l])}else s=e;return e=s.ref,{$$typeof:S,type:t,key:r,ref:e!==void 0?e:null,props:s}}i.Fragment=k;i.jsx=p;i.jsxs=p});var o=u((j,m)=>{"use strict";m.exports=v()});var a=d(o());function R({container:t={className:""},name:e="",options:s,selectProps:r={className:""}}){let l=Math.random().toString(36).slice(2);return(0,a.jsxs)("div",{className:`select-group ${t.className}`,...t,children:[(0,a.jsx)("label",{htmlFor:l,className:"select-label text-label",children:e}),(0,a.jsxs)("div",{className:"rbx-select-group select-group",children:[(0,a.jsx)("select",{className:"input-field rbx-select select-option",name:e,id:l,...r,children:s.map((c,E)=>(0,a.jsx)("option",{value:c.value,children:c.text},E))}),(0,a.jsx)("span",{className:"icon-arrow icon-down-16x16"})]})]})}var A=R;})();
/*! Bundled license information:

react/cjs/react-jsx-runtime.production.js:
  (**
   * @license React
   * react-jsx-runtime.production.js
   *
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)
*/
