const products=[
 {title:'Hidden Gems',type:'Featured selection',price:'Ask at the counter',image:'assets/img/gallery-01.jpg'},
 {title:'Featured Arrivals',type:'New arrivals · Featured',price:'Fresh every week',image:'assets/img/gallery-03.jpg'},
 {title:'Tabletop Finds',type:'Collectibles · Tabletop',price:'Curated picks',image:'assets/img/gallery-09.jpg'},
 {title:'Graphic Novels',type:'Collected editions · Staff picks',price:'Browse the shelf',image:'assets/img/gallery-11.jpg'}
];
const grid=document.querySelector('#productGrid');
products.forEach(p=>{const card=document.createElement('article');card.className='product-card';card.innerHTML=`<div class="product-art" style="background-image:url('${p.image}')"><strong>${p.title}</strong></div><div class="product-info"><div class="product-type">${p.type}</div><div class="product-title">${p.title}</div><div class="product-price">${p.price}</div></div>`;grid.appendChild(card)});
const menuButton=document.querySelector('#menuButton'),mobileMenu=document.querySelector('#mobileMenu');menuButton.addEventListener('click',()=>{const open=mobileMenu.classList.toggle('open');menuButton.setAttribute('aria-expanded',open)});mobileMenu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>mobileMenu.classList.remove('open')));
