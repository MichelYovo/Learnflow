/** Default: light theme. Only honor an explicit user choice from localStorage. */
export const themeInitScript = `(function(){try{var k='lf-theme';var t=localStorage.getItem(k);if(t!=='dark'){t='light'}var r=document.documentElement;r.dataset.theme=t;r.classList.toggle('dark',t==='dark');r.style.colorScheme=t}catch(e){}})();`;
