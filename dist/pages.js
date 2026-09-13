document.querySelectorAll('[data-project-filter]').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('[data-project-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));renderProjects(button.dataset.projectFilter);const count=projects.filter(p=>button.dataset.projectFilter==='All'||p.type===button.dataset.projectFilter).length;document.querySelector('#project-count').textContent=`${count} project${count===1?'':'s'}`;}));
const archiveList=document.querySelector('#archive-list');
if(archiveList){archiveList.innerHTML=projects.map((p,i)=>`<a class="archive-row reveal" href="/projects/#project/${p.id}/drawings"><span class="archive-number">0${i+1}</span><img src="/assets/${p.image}" alt="${p.name} — reference image" loading="lazy"><div><span class="eyebrow">${p.location.toUpperCase()}</span><h2>${p.name}</h2><p>Architecture · Elevations · Structure<br>Electrical · Plumbing · Interiors</p></div><span class="archive-total">18<small>DRAWINGS</small></span><span class="archive-arrow">↗</span></a>`).join('');observeReveals();}
const enquiryForm=document.querySelector('#enquiry-form');
if(enquiryForm){
 let step=1,brief=null;
 const stepFields=[...enquiryForm.querySelectorAll('fieldset')];
 function clearErrors(){enquiryForm.querySelectorAll('[aria-invalid]').forEach(f=>f.removeAttribute('aria-invalid'));document.querySelector('#form-error').textContent='';}
 function showStep(n){
  step=n;stepFields.forEach((f,i)=>{f.hidden=i!==n-1;f.disabled=i!==n-1});
  [1,2].forEach(i=>{const label=document.querySelector(`#step-label-${i}`);label.classList.toggle('active',i===n);if(i===n)label.setAttribute('aria-current','step');else label.removeAttribute('aria-current');});
  clearErrors();const legend=stepFields[n-1].querySelector('legend');legend.focus({preventScroll:true});scrollToSection(document.querySelector('.enquiry-panel'));
 }
 function validateStep(){
  clearErrors();const fields=stepFields[step-1].querySelectorAll('input,select,textarea');
  for(const field of fields){
   if(field.required&&!['checkbox','radio'].includes(field.type))field.value=field.value.trim();
   field.setCustomValidity('');
   if(field.name==='message'&&field.value.length<15)field.setCustomValidity('Please describe your idea in at least 15 characters.');
   if(!field.checkValidity()){
    field.setAttribute('aria-invalid','true');
    const messages={service:'Choose a service to continue.',location:'Enter your project location.',name:'Enter your name.',email:'Enter a valid email address.',demoConsent:'Confirm that you understand this is a demo before previewing your brief.'};
    document.querySelector('#form-error').textContent=messages[field.name]||field.validationMessage;
    field.focus();field.reportValidity();return false;
   }
  }
  return true;
 }
 enquiryForm.addEventListener('input',e=>{e.target.setCustomValidity?.('');clearErrors()});
 document.querySelector('#next-step').addEventListener('click',()=>{if(validateStep())showStep(2)});
 document.querySelector('#previous-step').addEventListener('click',()=>showStep(1));
 const selectedService=new URLSearchParams(location.search).get('service');
 if(selectedService){[...enquiryForm.elements.service].find(e=>e.value===selectedService)?.click()}
 document.querySelector('#fill-demo').addEventListener('click',()=>{enquiryForm.elements.service.value='Complete home';enquiryForm.elements.location.value='DHA, Lahore';enquiryForm.elements.area.value='1 kanal';enquiryForm.elements.timeline.value='Still exploring';enquiryForm.elements.name.value='Sample Client';enquiryForm.elements.email.value='client@example.com';enquiryForm.elements.phone.value='';enquiryForm.elements.message.value='We are imagining a family home with four bedrooms, an open courtyard and warm, natural materials. We would like to explore architecture, interiors and a complete working drawing set.';enquiryForm.elements.demoConsent.checked=false;showStep(1);document.querySelector('#fill-demo').textContent='Sample brief added ✓';});
 function briefEntries(){return [['Service',brief.service],['Location',brief.location],['Plot / covered area',brief.area||'To be discussed'],['Timeline',brief.timeline],['Name',brief.name],['Email',brief.email],['Phone / WhatsApp',brief.phone||'Not provided'],['Project idea',brief.message]];}
 enquiryForm.addEventListener('submit',e=>{e.preventDefault();if(step===1){if(validateStep())showStep(2);return;}if(!validateStep())return;stepFields.forEach(f=>f.disabled=false);brief=Object.fromEntries(new FormData(enquiryForm).entries());stepFields[0].disabled=true;const summary=document.querySelector('#enquiry-summary');summary.replaceChildren();for(const [label,value]of briefEntries()){const row=document.createElement('div'),dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=label;dd.textContent=value;row.append(dt,dd);summary.append(row)}document.querySelector('#enquiry-form-wrap').hidden=true;document.querySelector('#enquiry-result').hidden=false;document.querySelector('#enquiry-result-title').focus({preventScroll:true});document.querySelector('.enquiry-panel').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});});
 document.querySelector('#edit-brief').addEventListener('click',()=>{document.querySelector('#enquiry-result').hidden=true;document.querySelector('#enquiry-form-wrap').hidden=false;showStep(2)});
 document.querySelector('#new-brief').addEventListener('click',()=>{enquiryForm.reset();brief=null;document.querySelector('#enquiry-result').hidden=true;document.querySelector('#enquiry-form-wrap').hidden=false;document.querySelector('#fill-demo').textContent='Try a sample brief ↗';if(selectedService){[...enquiryForm.elements.service].find(e=>e.value===selectedService)?.click()}showStep(1)});
 document.querySelector('#download-brief').addEventListener('click',()=>{if(!brief)return;const contents='ARCHCELL — PROJECT ENQUIRY PREVIEW\nDEMO ONLY: This enquiry has not been sent.\n\n'+briefEntries().map(([label,value])=>label.toUpperCase()+'\n'+value).join('\n\n')+'\n\nPrepared locally in your browser.\n';const url=URL.createObjectURL(new Blob([contents],{type:'text/plain;charset=utf-8'}));const link=document.createElement('a');link.href=url;link.download='archcell-project-brief.txt';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000)});
}
document.querySelectorAll('.site-header nav a,.mobile-nav a,.footer-navigation a,.header-cta').forEach(a=>{if(a.pathname===location.pathname)a.setAttribute('aria-current','page')});
// Cross-document view transitions are progressive enhancement; links work without them.
window.addEventListener('pageshow',()=>document.querySelector('.page-transition').classList.remove('active'));
