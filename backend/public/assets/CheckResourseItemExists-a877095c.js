import{a4 as p}from"./index-9ca6b9fc.js";async function i(s,t,c,r){const e=s.replace(/([A-Z])/g," $1"),o=e.charAt(0).toUpperCase()+e.slice(1,e.length-1);try{return await p.get(`http://127.0.0.1:8007/api/${s}/findBy/${t}?value=${c}`),r?r(new Error(`${o} with such ${t} already exists`)):!0}catch(n){if(n.response){if(r)return r()}else if(n.request){if(r)return r(new Error("Server validation error, please try later"));throw new Error("NETWORK_ERR")}}}export{i};
