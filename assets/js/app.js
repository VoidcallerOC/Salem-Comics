const products=[
 {title:'Long Box Finds',type:'Back issues · Salem shelves',price:'Ask at the counter',image:'assets/img/salem-shop-01.jpg'},
 {title:'Marvel & DC',type:'New arrivals · Superheroes',price:'Fresh every week',image:'assets/img/salem-shop-03.jpg'},
 {title:'Dungeons & Dragons',type:'Collectibles · Tabletop',price:'Curated picks',image:'assets/img/salem-shop-09.jpg'},
 {title:'Graphic Novels',type:'Collected editions · Staff picks',price:'Browse the shelf',image:'assets/img/salem-shop-11.jpg'}
];
const grid=document.querySelector('#productGrid');
products.forEach(p=>{const card=document.createElement('article');card.className='product-card';card.innerHTML=`<div class="product-art" style="background-image:url('${p.image}')"><strong>${p.title}</strong></div><div class="product-info"><div class="product-type">${p.type}</div><div class="product-title">${p.title}</div><div class="product-price">${p.price}</div></div>`;grid.appendChild(card)});
const menuButton=document.querySelector('#menuButton'),mobileMenu=document.querySelector('#mobileMenu');menuButton.addEventListener('click',()=>{const open=mobileMenu.classList.toggle('open');menuButton.setAttribute('aria-expanded',open)});mobileMenu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>mobileMenu.classList.remove('open')));
