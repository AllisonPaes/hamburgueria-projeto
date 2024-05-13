const menu = document.getElementById("menu")
const cartBtn = document.getElementById("cart-btn")
const cartModal = document.getElementById("cart-modal")
const cartItemsContainer = document.getElementById("cart-items")
const cartTotal = document.getElementById("cart-total")
const checkoutBtn = document.getElementById("checkout-btn")
const closeModalBtn = document.getElementById("close-modal-btn")
const cartCounter = document.getElementById("cart-count")
const addressInput = document.getElementById("address")
const addressWarn = document.getElementById("address-warn")

let cart = [];

// Abrir o modal do carrinho
cartBtn.addEventListener("click", function () {
    updateCartModal();
    cartModal.style.display = "flex"
    
})

// fechar o modal quando clicar fora 

cartModal.addEventListener("click", function(event){
    if(event.target === cartModal){
        cartModal.style.display = "none"
    }
})

// Fechar o modal no botão

closeModalBtn.addEventListener("click", function(){
    cartModal.style.display = "none"
})


menu.addEventListener("click", function(event){
    let parentButton = event.target.closest(".add-to-cart-btn")

    if(parentButton){
        const name = parentButton.getAttribute("data-name")
        const price = parseFloat(parentButton.getAttribute("data-price"))
        addToCart(name, price)    
    }   
})

// Função para adicionar ao carrinho

function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name,
            price,
            quantity: 1,
        });
    }

    updateCartModal();
}


// Atualizar o carrinho visualmente
function updateCartModal(){
    cartItemsContainer.innerHTML = "";
    let total = 0;


    cart.forEach(item => {
        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col")
        
        cartItemElement.innerHTML = `
            <div class="flex items-center justify-between">
                <div>
                    <p class="font-medium">${item.name}</p>
                    <p>Qtd: ${item.quantity}</p>
                    <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
                </div>

            
                <button class="remove-cart-btn" data-name="${item.name}">
                    Remover
                </button>
            
            </div>
        `

        total += item.price * item.quantity;

        cartItemsContainer.appendChild(cartItemElement)


    })

    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

    cartCounter.innerText = cart.length;

}

// Remover o item do carrinho 
cartItemsContainer.addEventListener("click", function (event){
    if(event.target.classList.contains("remove-cart-btn")){
        const name = event.target.getAttribute("data-name")

        removeItemCart(name);
    }
})

function removeItemCart(name){
    const index = cart.findIndex(item => item.name === name);

    if(index !== -1){
        const item = cart[index];

        if(item.quantity > 1){
            item.quantity -= 1;
            updateCartModal();
            return;
        }

        cart.splice(index, 1);
        updateCartModal();
    }

}

addressInput.addEventListener("input", function(event){
    let inputValue = event.target.value;

    if(inputValue !== ""){
        addressWarn.classList.add("hidden")
    }
})

// Finalizar pedido e Horario da hamburgueria
checkoutBtn.addEventListener("click", function(){

    const isOpen = checkRestaurantOpen();
    if(!isOpen){
        alert("HAMBURGUERIA FECHADA NO MOMENTO!")
        return;
    }

    
    if(cart.length === 0) return;
    if(addressInput.value === ""){
       addressWarn.classList.remove("hidden") 
       return;
    }


// Agrupa os itens do carrinho pelo nome do produto e calcula o total para cada tipo de produto
const groupedCart = cart.reduce((acc, item) => {
    if (!acc[item.name]) {
        acc[item.name] = { ...item, totalQuantity: item.quantity };
    } else {
        acc[item.name].totalQuantity += item.quantity;
    }
    return acc;
}, {});

// Calcula o valor total para cada tipo de produto e o valor total geral do carrinho
let totalValue = 0;
const formattedItems = Object.values(groupedCart).map((item) => {
    const subtotal = item.price * item.totalQuantity;
    totalValue += subtotal;
    return `${item.name} - Quantidade: ${item.totalQuantity} - Subtotal: R$${subtotal.toFixed(2)}`;
}).join('\n');

// Adiciona o valor total geral e o endereço à mensagem
const message = `Produtos:
${formattedItems}

Valor Total: R$${totalValue.toFixed(2)}

Endereço:
${addressInput.value}`;

// Encode a mensagem para que possa ser passada como parâmetro na URL do WhatsApp
const encodedMessage = encodeURIComponent(message);

// Número de telefone para o qual você deseja enviar a mensagem
const phone = "5581982344291";

// Abre uma nova janela com o link do WhatsApp contendo a mensagem
window.open(`https://wa.me/${phone}?text=${encodedMessage}`, "_blank");

// Limpa o carrinho e atualiza o modal do carrinho
cart = [];
updateCartModal();

})


// Verificar a hora e alterar o horario
function checkRestaurantOpen(){
    const data = new Date();
    const hora = data.getHours();
    return hora >= 18 && hora < 23; 
}

const spanItem = document.getElementById("data-span")
const isOpen = checkRestaurantOpen();

if (isOpen){
    spanItem.classList.remove("bg-red-500")
    spanItem.classList.add("bg-green-600")
}else{
    spanItem.classList.remove("bg-gree-600")
    spanItem.classList.add("bg-red-500")
}