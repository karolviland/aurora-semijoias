/* Regras compartilhadas pelo menu e pelo catálogo. */
const CatalogSections = (() => {
 const sections={
  semijoias:{label:'Semijoias',models:['Anéis','Brincos','Colares','Conjuntos','Correntes','Pingentes','Pulseiras','Tornozeleiras']},
  'para-eles':{label:'Para eles',models:['Correntes','Pulseiras','Relógios']},
  prata:{label:'Prata 925',models:['Anéis','Brincos','Colares','Conjuntos','Correntes','Pingentes','Pulseiras','Tornozeleiras']},
  berloques:{label:'Berloques',models:['Signos','Profissões','Separadores']},
  relogios:{label:'Relógios',models:['Femininos','Masculinos','Infantis','Smartwatches']}
 };
 function category(p){return p.cat==='Berloques e pingentes'?(/^berloque\b/i.test(p.nome)?'Berloques':'Pingentes'):p.cat;}
 function sectionFor(p){
  if(p.secao&&sections[p.secao])return p.secao;
  if(category(p)==='Relógios')return 'relogios';
  if(category(p)==='Berloques')return 'berloques';
  if(p.vitrine==='para-eles'||p.publico==='para-eles')return 'para-eles';
  return p.mat==='Prata 925'?'prata':'semijoias';
 }
 function modelFor(p,section){
  if(section==='relogios')return p.modelo||(p.publico==='para-eles'?'Masculinos':p.publico==='para-elas'?'Femininos':'');
  if(section==='berloques')return p.modelo||(/^Berloque signo/i.test(p.nome)?'Signos':/^Berloque profissão/i.test(p.nome)?'Profissões':/^Berloque separador/i.test(p.nome)?'Separadores':'');
  return category(p);
 }
 function belongs(p,section){
  if(section==='para-eles')return p.secao==='para-eles'||p.vitrine==='para-eles'||p.publico==='para-eles';
  if(section==='relogios')return category(p)==='Relógios';
  if(section==='prata')return p.mat==='Prata 925';
  return sectionFor(p)===section;
 }
 function options(section,products){
  const configured=sections[section].models;
  // A valid menu selection must survive even when its inventory is empty.
  return ['Todas',...configured];
 }
 function state(section,model,products){
  section=sections[section]?section:'semijoias';
  if(section==='relogios')model=model==='Para eles'?'Masculinos':model==='Para elas'?'Femininos':model;
  return {section,model:options(section,products).includes(model)?model:'Todas'};
 }
 function filter(selected,products){return products.filter(p=>belongs(p,selected.section)&&(selected.model==='Todas'||modelFor(p,selected.section)===selected.model));}
 function url(selected){const q=new URLSearchParams({secao:selected.section});if(selected.model!=='Todas')q.set('modelo',selected.model);return 'catalogo.html?'+q.toString()+'#catalogo';}
 function fromLocation(location,products){
  const q=new URLSearchParams(location.search);let section=q.get('secao'),model=q.get('modelo')||q.get('cat')||'Todas';
  if(!section){
   section=q.has('men')||location.hash==='#para-eles'?'para-eles':q.get('cat')==='Relógios'?'relogios':location.hash==='#berloques'?'berloques':q.get('mat')==='Prata 925'||location.hash==='#prata'?'prata':'semijoias';
   if(q.has('men'))model=q.get('men');
   if(section==='relogios'&&(model==='Todas'||model==='Relógios'))model=q.get('publico')==='para-eles'?'Para eles':q.get('publico')==='para-elas'?'Para elas':'Todas';
   if(model==='Berloques e pingentes')model='Pingentes';
  }
  return state(section,model,products);
 }
 function fromLink(link,products){
  if(link.dataset.productId){const p=products.find(p=>p.id===link.dataset.productId);if(p)return state(sectionFor(p),modelFor(p,sectionFor(p)),products);}
  const href=link.getAttribute('href')||'';
  if(link.dataset.menCategory)return state('para-eles',link.dataset.menCategory,products);
  if(link.dataset.gotoCat||link.dataset.gotoMat){
   let section=link.dataset.gotoMat==='Prata 925'?'prata':'semijoias';let model=link.dataset.gotoCat||'Todas';
   if(model==='Berloques e pingentes')model='Pingentes';
   return state(section,model,products);
  }
  if(!href.startsWith('catalogo.html')&&!['#catalogo','#prata','#berloques','#para-eles'].includes(href))return null;
  const u=new URL(href,'https://store.example/');return fromLocation(u,products);
 }
 return {sections,category,sectionFor,modelFor,belongs,options,state,filter,url,fromLocation,fromLink};
})();
