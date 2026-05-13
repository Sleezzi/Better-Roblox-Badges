"use strict";(()=>{var T=Object.create;var c=Object.defineProperty;var m=Object.getOwnPropertyDescriptor;var x=Object.getOwnPropertyNames;var M=Object.getPrototypeOf,L=Object.prototype.hasOwnProperty;var u=(t,e)=>()=>(e||t((e={exports:{}}).exports,e),e.exports);var H=(t,e,l,r)=>{if(e&&typeof e=="object"||typeof e=="function")for(let s of x(e))!L.call(t,s)&&s!==l&&c(t,s,{get:()=>e[s],enumerable:!(r=m(e,s))||r.enumerable});return t};var d=(t,e,l)=>(l=t!=null?T(M(t)):{},H(e||!t||!t.__esModule?c(l,"default",{value:t,enumerable:!0}):l,t));var v=u(i=>{"use strict";var N=Symbol.for("react.transitional.element"),S=Symbol.for("react.fragment");function p(t,e,l){var r=null;if(l!==void 0&&(r=""+l),e.key!==void 0&&(r=""+e.key),"key"in e){l={};for(var s in e)s!=="key"&&(l[s]=e[s])}else l=e;return e=l.ref,{$$typeof:N,type:t,key:r,ref:e!==void 0?e:null,props:l}}i.Fragment=S;i.jsx=p;i.jsxs=p});var o=u((j,E)=>{"use strict";E.exports=v()});var a=d(o());function R({container:t={},name:e,options:l,selectProps:r={}}){let s=Math.random().toString(36).slice(2);return(0,a.jsxs)("div",{className:`select-group ${t.className||""}`,...t,children:[(0,a.jsx)("label",{htmlFor:s,className:"select-label text-label",children:e}),(0,a.jsxs)("div",{className:"rbx-select-group select-group",children:[(0,a.jsx)("select",{className:"input-field rbx-select select-option",name:e,id:s,...r,children:l.map((n,k)=>(0,a.jsx)("option",{value:n.value,children:n.text}))}),(0,a.jsx)("span",{className:"icon-arrow icon-down-16x16"})]})]})}var A=R;})();
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
