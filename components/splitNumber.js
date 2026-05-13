"use strict";(()=>{function e(t){return localStorage.getItem("splitNumber")?`${t}`.replace(/\B\B(?=([0-9]{3})+(?![0-9]))/g,localStorage.getItem("splitNumber")==="dot"?".":" "):`${t}`}var r=e;})();
