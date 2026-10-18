const CatalogNavigation={start({products,render,close}){
 const C=CatalogSections;
 let selected=C.fromLocation(location,products),shown=CONFIG.porPagina;
 const catalog=document.getElementById('catalogo');
 const chips=document.getElementById('filtros-cat');
 function paint(){
  if(!catalog)return;
  const list=C.filter(selected,products);
  document.getElementById('catalog-section').textContent=C.sections[selected.section].label;
  document.getElementById('catalog-title').textContent=selected.model==='Todas'?'Todas as peças':selected.model;
  document.title=C.sections[selected.section].label+' — '+(selected.model==='Todas'?'Todas as peças':selected.model)+' | '+CONFIG.nomeCompleto;
  chips.innerHTML=C.options(selected.section,products).map(model=>`<button class="chip ${model===selected.model?'on':''}" data-model="${model}" aria-pressed="${model===selected.model}">${model}</button>`).join('');
  render('#grid-catalogo',list.slice(0,shown));
  document.getElementById('contador').textContent=list.length+' '+(list.length===1?'peça':'peças')+(list.length>shown?' — mostrando '+shown:'');
  document.getElementById('catalog-empty').hidden=list.length>0;
  document.getElementById('btn-mais').hidden=shown>=list.length;
  document.querySelectorAll('.delicate-menu a, .mmenu a').forEach(a=>{
   const target=C.fromLink(a,products);
   const parent=a.matches('.delicate-menu>.nav-item>a');
   const active=target&&target.section===selected.section&&(parent||target.model===selected.model);
   a.classList.toggle('section-active',!!active);
   if(active)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');
  });
  catalog.classList.add('in');
 }
 function navigate(next,push=true){
  if(!catalog){location.href=C.url(next);return;}
  selected=next;shown=CONFIG.porPagina;
  if(push)history.pushState(null,'',C.url(selected));
  close();paint();catalog.scrollIntoView({behavior:'smooth',block:'start'});
 }
 // Atualiza também os destinos para abrir links em nova aba corretamente.
 document.querySelectorAll('a[href]').forEach(a=>{const target=C.fromLink(a,products);if(target){a.href=C.url(target);delete a.dataset.gotoCat;delete a.dataset.gotoMat;delete a.dataset.menCategory;}});
 document.addEventListener('click',e=>{
  if(e.defaultPrevented||e.button>0||e.ctrlKey||e.metaKey||e.shiftKey||e.altKey)return;
  const a=e.target.closest('a[href]');if(!a||a.target==='_blank')return;
  const next=C.fromLink(a,products);if(!next)return;
  e.preventDefault();navigate(next);
 });
 if(catalog){
  chips.addEventListener('click',e=>{const b=e.target.closest('[data-model]');if(b)navigate(C.state(selected.section,b.dataset.model,products));});
  document.getElementById('btn-mais').addEventListener('click',()=>{shown+=CONFIG.porPagina;paint();});
  window.addEventListener('popstate',()=>{selected=C.fromLocation(location,products);shown=CONFIG.porPagina;paint();});
  window.addEventListener('hashchange',()=>{selected=C.fromLocation(location,products);shown=CONFIG.porPagina;paint();});
  paint();
 }
}};
