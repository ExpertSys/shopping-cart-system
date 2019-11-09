/* Default initializers */
let currPage = 1;
let itemsPerPage = 2;
let currCategory;
let province = 'ontario'; // Editing this will change your province tax.
let province_converter = {'ontario':0, 'quebec':1};
let sales_tax = [13, Math.round(9.975)];
let couponActive = false;
let coupon = (25 / 100);

/* Headers & Titles */
let content = document.getElementById("sectionItems");
let contentS = document.getElementById("content");
let getSummerTotal = document.getElementById("summerTotalItems");
let errorNotifier = document.querySelector(".errorNotifier");
let checkout = document.getElementById("bag-items");
let shipTotal = document.getElementById('ship-total');
let subTotal = document.getElementById('sub-total');
let taxTotal = document.getElementById('tax-total');
let changeProv = document.getElementById('prov-btn');
let totalCost = document.getElementById('total');
let signUpBtn = document.getElementById('coupon');

/* JQuery Elements */
$('.sizeBtn').hide();

/* Shopping Cart */
let n = ['#notification'];
let countdown = ['Please wait at least 3 seconds.'];
let shoppingCart = [];
let tempCart = [];
let tempBag = [];
let checkoutObj = [];
let lastClick = 0;
let clickTimer = 0;
let notificationTimer = 0;
let itemsInCart = 0;
let bagResults = '';
let results = '';
let resultsBtn = '';
let size;
let getResults = document.createElement('div');
getResults.innerHTML = (resultsBtn);

/* Toggles */
let menuActive = false;
let initialStart = false;

/* Store Category Selections */
let summerSelections = [
    {
        id: 1,
        title: 'Colorful Striped Dress',
        price: '$34.99 CAD',
            sizes:
            [
                ['[S]', 0],
                ['[M]', 1],
                ['[L]', 2]
            ],
        category: 'Summer',
        image: './images/item1@3x.png',
        imageVariation2: 'url2',
        imageVariation3: 'url3'
    },
    {
        id: 2,
        title: 'High Waist Cami Dress',
        price: '$25.99 CAD',
        sizes:
            [
                ['[S]', 5],
                ['[M]', 2],
                ['[L]', 7]
            ],
        category: 'Summer',
        image: './images/item2@3x.png',
        imageVariation2: 'url2',
        imageVariation3: 'url3'
    },
    {
        id: 3,
        title: 'Jordan\'s Camie Dress',
        price: '$25.99 CAD',
        sizes:
            [
                ['[S]', 4],
                ['[M]', 2],
                ['[L]', 9]
            ],
        category: 'Summer',
        image: './images/item2@3x.png',
        imageVariation2: 'url2',
        imageVariation3: 'url3'
    }
];
let getTotalItems = Object.keys(summerSelections).length;

/* Display all items from category */
let displayResults = obj => {
    for(let x = 0; x < obj.length; x++){
        if(obj[x].id <= itemsPerPage){
            let inStock = [...obj[x].sizes];
            let notInStock = [...obj[x].sizes];

            results +=  '<div class="item">';
            results +=  '<div class="section-items">';
            results +=  '<div class="browse-left">';
            results +=  '<img src="images/left-arrow@3x.png" width="23" height="31">';
            results +=  '</div>';
            results +=  '<img src="' + obj[x].image +'" width="311" height="329">';
            results +=  '<div class="browse-right">';
            results +=  '<img src="images/right@3x.png" width="23" height="31">';
            results +=  '</div>';
            results +=  '</div>';
            results +=  '<div class="section-desc">';
            results +=  '<div id="item-variations">';
            results +=  '<div id="v-one" class="variation v-active"></div>';
            results +=  '<div id="v-two" class="variation"></div>';
            results +=  '<div id="v-three" class="variation"></div>';
            results +=  '</div>';
            results +=  '<div id="' + obj[x].id +'" class="section-desc-info">';
            results +=  '<p>' + obj[x].title +'</p>';
            results +=  '<p class="item-price">' + obj[x].price +'</p>';

            if(obj[x].sizes[0][1] >= 1){
                notInStock.splice(0, 1);
                notInStock.splice(1, 1);
                notInStock.splice(2, 1);
                results += '<p class="size">' + 'Sizes: ' + inStock + '<p>';
            } else{
                notInStock.splice(0, 1);
                notInStock.splice(1, 1);
                notInStock.splice(2, 1);
                results += '<p class="size">' + 'Sizes: ' + inStock + '<p>';
            }
            results +=  '</div>';
            results +=  '<div class="section-desc-btn">';
            results +=  '<a href="#" class="addToCart">Add to bag</a>';
            results +=  '</div>';
            results +=  '</div>';
            results +=  '</div>';
        }
    }
    content.innerHTML = results;
}

/* Load additional items when requested */
let loadItems = () => {
    itemsPerPage++;
    let newResults = [];
    newResults = [...summerSelections];
    newResults.splice(0, itemsPerPage - 1);

    if(Object.keys(newResults).length <= 0){
        errorNotifier.innerHTML="No More Items";
        return false;
    } else{
        displayResults(newResults);
        addItemToCart();
        return true;
    }
}
let totalItemsPerPage = document.getElementById("load-products-btn");
totalItemsPerPage.addEventListener('click', loadItems);

/* Add new items to shopping cart */
let addItemToCart = () => { 
    let items = document.querySelectorAll(".addToCart");
    items.forEach((v) => {
        v.addEventListener("click", updateCartItems);
    });
}

/* Gather information about items and update cart initially */
let updateCartItems = (e) => {
    let {target} = e;
    let c = shoppingCart;
    let currDate = new Date();
    let t = currDate.getTime();
    
    let itemID = parseInt(target.parentElement.previousSibling.getAttribute("id"));
    let itemImage = target.parentElement.parentElement.previousSibling.children[1].getAttribute("src");
    let itemTitle = target.parentElement.previousSibling.children[0].innerText;
    let itemPrice = target.parentElement.previousSibling.children[1].innerText
    .replace('$', '');
    
    if(t - lastClick < 3500){
        $(n[0]).css('height', '30px');
        $(n[0]).css('background', '#CB4747');
        $(n[0]+' p').html(countdown[0]);
    } else{
        addItem(tempCart, c, itemID, itemTitle, itemPrice, itemImage);
    }
    clickTimer = t;
    calculateItemTotal(c);
    e.preventDefault();
}

/* Calculates the total cost, sum, tax */
let calculateItemTotal = (shoppingCart) => {
    let couponSystem = {
        'launchparty2020': {
            discount: 0.25
        }
    }
    let coup;
    let sum = shoppingCart.reduce((a, i) => a + parseFloat(i.price),0),
    t = !isNaN(sum) ? Math.round(sum * 100) / 100 : 'error',
    tax = sales_tax[province_converter[province]],
    dt = tax / 100,
    shipping = 3.99;
    final = Math.round(t*dt*100)/100 + Math.round((t+shipping*100)/100)+t;
    
    if(couponActive){
        let sumTotal = Math.round(final*100)/100;
        let c = sumTotal * (coupon);
        let cr = sumTotal - (Math.round(c * 100)/100);
        final = cr;
        document.getElementById('couponDisplay').innerHTML = '[Coupon Applied]';
        coup = couponSystem['launchparty2020'].discount;
    }
    subTotal.innerHTML = '$'+t+' CAD';
    taxTotal.innerHTML = t + '+' + tax + '%' + '+'+ shipping;
    totalCost.innerHTML = `$${Math.round(final*100)/100} CAD -(${coup*100}%)`;
}

/* Apply Coupon */
signUpBtn.addEventListener('click', function(){
    alert('You\'ve actived a 25% off coupon.');
    couponActive = true;
    calculateItemTotal(shoppingCart);
});

/* Change province and tax */
changeProv.addEventListener('click', function({target}){
    if(province==='ontario'){
        target.innerText='Change Province To Ontario';
        province = 'quebec';
    } else{
        target.innerHTML='Change Province To Quebec';
        province = 'ontario'; 
    }
    calculateItemTotal(shoppingCart);
});

/* Increase or Decrease cart quantity indicator */
let cartAmountDisplay = (config) =>{
    let el = document.querySelector('.cartCounter');
    switch(config){
        case 'add':
            $('#mobile-sales #search img').addClass('redHeart');
            break;

        case 'remove':
            $('#mobile-sales #search img').removeClass('redHeart');
            break;
    }
    return config;
}

/* Update cart with new items */
let addItem = (tCart, myCart, id, title, price, img) => {
    let currDate = new Date();
    let t = currDate.getTime();

    if(tCart.indexOf(id) === -1){
        tCart.push(id);
        if(!initialStart){
            if(size === undefined){
                size = 'S';
            } 
            /* Notification: {Element Name} Added. */
            $(n[0]).fadeIn(1000);
            $(n[0]).css('height', '30px');
            $(n[0]).css('background', '#000');
            $(n[0]+' p').html(`${title} added to cart.`);
            cartAmountDisplay('add');

            myCart.push({ id: id, title: title, price: price, image: img, size: size, quantity: 1 });
            initialStart = true;
        } else{
            if(t - lastClick < 3500){
                initialStart = false;
                $(n[0]).fadeIn(1000);
                $(n[0]).css('height', '30px');
                $(n[0]).css('background', '#CB4747');
                $(n[0]+' p').html(countdown[0]);
                
            } else{
            initialStart = false;

            /* Notification: {Element Name} Added. */
            $(n[0]).fadeIn(1000);
            $(n[0]).css('height', '30px');
            $(n[0]).css('background', '#000');
            $(n[0]+' p').html(`${title} added to cart.`);
            cartAmountDisplay('add');
            myCart.push({ id: id, title: title, price: price, image: img, size: size, quantity: 1 });
            }      
        }   
        lastClick = t;
    }
        else if(t - notificationTimer < 3000){
            initialStart = false;
            $(n[0]).fadeIn(1000);
            $(n[0]).css('height', '30px');
            $(n[0]).css('background', '#CB4747');
            $(n[0]+' p').html(countdown[0]);
            }
        else if(tCart.indexOf(id) > -1){
            myCart.map( e => {
                if(e.id === id){
                    cartAmountDisplay('add');
                    let r = tempBag.indexOf(parseInt(id));
                    tempBag.splice(r, 1);
                    if(e.id >= 1 && e.status == "Item Removed" || e.id === 0 && e.status == "Item Removed"){
                    delete e.title;
                    e.price = 0;
                    delete e.image;
                    delete e.size;
                    delete e.quantity;
                    e.id = 0;
                    $(n[0]).fadeIn(1000);
                    $(n[0]).css('height', '30px');
                    $(n[0]).css('background', '#000');
                    $(n[0]+' p').html(`${title} added to cart.`);
                    myCart.push({ id: id, title: title, price: price, image: img, size: size, quantity: 1 });
                    }
                }
                /* Notification: Item Exists. +1 Added */
                $(n[0]).fadeIn(1000);
                $(n[0]).css('height', '30px');
                $(n[0]).css('background', '#000');
                $(n[0]+' p').html(`${title} added to cart.`);
                if(e.id === id){
                    e.quantity++;
                }
            }
        )
    }
    displayBag(tCart, myCart, id, title, price, img);
    notificationTimer = t;
    setTimeout(function(){
    $(n[0]).css('height', '0px');
    $(n[0]).fadeOut(1000);
    }, 3000);
}

/* Display results for checkout screen */
let displayBag = (tCart, myCart, id, title, price, img) => {
    let myObj = myCart;
    let i = id;
    let t = title;
    let p = price;
    let im = img;
 
    let div = document.createElement('div');
    div.classList.add('cart-item');
    div.innerHTML = `<div class="bag-item inventory" id=${i}>
    <p class="deleteBagItem" id=${i} data-id=${i}>&times;</p>
    <div id="bag-item-image">
    <img src="${im}" width="140.5" height="140.78">
    </div>
    <div id="item-info">
    <p class="item-id">Item #${i}</p>
    <p class="item-desc">${t}</p>
    <p class="item-desc">Size: S</p>
    <p class="item-desc">${p}</p>
    </div>
    </div>
    `;
    checkout.appendChild(div);

    /* Delete item from shopoping cart */
    let deleteCartItems = document.querySelectorAll('.deleteBagItem');  
    
    for(let x = 0; x < deleteCartItems.length; x++){
        deleteCartItems[x].addEventListener('click', function({target}){
            let t = target.getAttribute('id')
            let m = myCart;
            let eleID = target.parentNode.getAttribute('id');
            let parentElementId = eleID;
            if(parseInt(t) === parseInt(parentElementId)){
                target.parentNode.remove();
                m.map(v => {
                    if(v.id === parseInt(t)){                                
                        delete v.title;
                        v.price = 0;
                        delete v.image;
                        delete v.size;
                        delete v.quantity;
                        calculateItemTotal(m); 
                        cartAmountDisplay('remove');
                        checkoutObj = [...myObj];
                        for(let z = 0; z < checkoutObj.length; z++){
                        if(!checkoutObj[z].hasOwnProperty("size")){
                            checkoutObj[z].status = 'Item Removed';
                            myObj = checkoutObj;
                            }
                        }
                    }
                });
            }
        });
    }
}

/* Configure item size */
let adjustClothingSize = () => {
    if(menuActive === false){
        $('.sizeBtn').fadeIn(100);
        menuActive = true;
    } else{
        $('.sizeBtn').fadeOut(100);
        menuActive = false;
    }
    $('.sizeBtn').click(function(){
        $(this).addClass('btnActive').siblings().removeClass('btnActive');
        $('#current-size').html('&nbsp;' + this.innerText);
        size = this.innerText;
    })
}
let sizeMenu = document.getElementById('size-chart');
sizeMenu.addEventListener('click', adjustClothingSize);

/* Automatic */
let counter = document.createElement('p');
    counter.className = "cartCounter";
    let heartContainer = document.getElementById('heart');
    heartContainer.appendChild(counter); 

(function (){
    displayResults([] = [...summerSelections]);
    contentS.append(getResults);
    getSummerTotal.innerHTML = getTotalItems;
    addItemToCart();
})();

