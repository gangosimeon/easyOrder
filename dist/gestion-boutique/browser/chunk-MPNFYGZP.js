function s(n,t,c=t){if(!n)return"";let e="/image/upload/",o=n.indexOf(e);if(o===-1)return n;let i=o+e.length,r=`w_${t},h_${c},c_fill,q_auto,f_auto/`;return n.slice(0,i)+r+n.slice(i)}export{s as a};
