"use strict";document.addEventListener("DOMContentLoaded",function(){var e=!1,t=document.querySelector(".exposition__img-container-js"),o=document.querySelector(".exposition__img-js"),n=document.querySelectorAll(".exposition__item"),r=document.querySelectorAll(".exposition__header"),i=300*Math.random();var s=new IntersectionObserver(function(t){t.forEach(function(t){e||(e=!0);var o=t.target;requestIdleCallback(function(){t.isIntersecting?o.classList.add("exposition__img-container--visible"):o.classList.remove("exposition__img-container--visible")},{timeout:1e3})})},{root:null,rootMargin:"0px 0px -100px 0px",threshold:0}),c=new IntersectionObserver(function(e){e.forEach(function(e){var t=document.querySelector(".exposition__img-js");e.isIntersecting&&e.intersectionRatio<.8&&e.target.dataset.picture&&o.getAttribute("src")!==e.target.dataset.picture?(t.classList.remove("fadedOut"),t.classList.toggle("fadeIn"),t.classList.toggle("fadeIn2"),t.setAttribute("src",e.target.dataset.picture)):(!e.isIntersecting||e.intersectionRatio>.7)&&t.classList.add("fadedOut")})},{threshold:[0],rootMargin:"-25% 0px -25% 0px"});n.forEach(function(e){return c.observe(e)}),r.forEach(function(e){return c.observe(e)}),s.observe(t),window.addEventListener("scroll",getDebouncer(function(){var e=t.getBoundingClientRect().y,o=Math.floor(Math.abs(e)/15)+i,n="hsl(".concat(o,", 59%, 27%)");t.style.backgroundColor=n}))});
"use strict";var getDebouncer=function(n){for(var r=arguments.length,e=new Array(r>1?r-1:0),t=1;t<r;t++)e[t-1]=arguments[t];var a;return function(){var r=e;a&&window.cancelAnimationFrame(a),a=window.requestAnimationFrame(function(){n.apply(this,r)})}};
"use strict";Element.prototype.matches||(Element.prototype.matches=Element.prototype.msMatchesSelector||Element.prototype.webkitMatchesSelector);