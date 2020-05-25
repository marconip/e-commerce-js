//mostrar e esconder a loja
var lojaTitulo = document.querySelector(".loja-titulo");
lojaTitulo.onclick = function () {
    var lojaProdutos = document.querySelector(".loja-produtos");
    if (lojaProdutos.classList.contains("show") && lojaTitulo.children[2].classList.contains("rotacao")) {
        lojaProdutos.classList.remove("show");
        lojaTitulo.children[2].classList.remove("rotacao");
    } else {
        lojaProdutos.classList.add("show");
        lojaTitulo.children[2].classList.add("rotacao");
    }
};


//adicionar produto no carrinho
var produtos = document.querySelectorAll(".product .btn-buy");
produtos.forEach(function (el) {
    el.onclick = function () {
        var boxProduto = el.parentElement;
        document.querySelector(".cart").classList.remove("d-none");
        document.querySelector(".cart").classList.add("anime-aparecer");
        boxProduto.classList.add("selected");
        boxProduto.children[3].setAttribute("disabled", "disabled");

        //gerar produto dentro do carrinho
        var itens = document.createElement("div");
        itens.className = "items";
        itens.dataset.target = boxProduto.dataset.target;

        var imgCapa = document.createElement('img');
        imgCapa.src = boxProduto.children[0].src;
        imgCapa.alt = boxProduto.children[0].alt;

        var itensInf = document.createElement("div");
        itensInf.className = "items-info";

        var titulo3 = document.createElement("h3");
        titulo3.innerHTML = boxProduto.children[1].innerHTML;

        var inputQtd = document.createElement("input");
        inputQtd.type = "number";
        inputQtd.name = "quantity";
        inputQtd.pattern = "[0-9]*";
        inputQtd.inputmode = "numeric";
        inputQtd.value = "1";
        inputQtd.onchange = function () { inputQdt(this) };

        var link = document.createElement("a");
        link.href = "javascript:void(0)";
        link.innerHTML = "Excluir";
        link.classList = "excluir";

        var paragrafo = document.createElement("p");
        paragrafo.classList = "items-price";
        paragrafo.dataset.price = boxProduto.children[2].children[0].innerHTML;
        paragrafo.innerHTML = boxProduto.children[2].innerHTML;

        itens.appendChild(imgCapa);
        itens.appendChild(itensInf);
        itens.appendChild(paragrafo);

        itensInf.appendChild(titulo3);
        itensInf.appendChild(inputQtd);
        itensInf.appendChild(link);

        document.querySelector(".bag").appendChild(itens);

        resumoTotal();
        excluir();
    }
});

//CEP
var cep = document.querySelector(".zipcode");
var cepInput = document.querySelector(".zipcode input");
var cepBotao = document.querySelector(".zipcode button");
var cepNaoSei = document.querySelector(".zipcode a");
var cepEscolhas = document.querySelector(".zipcode-choices");
var cepNumeros = document.querySelector(".zipcode-numbers");
//click no botão "OK" do frete
cepBotao.onclick = function () {
    if (cepInput.value == "73073-073" || cepInput.value == "83083-083" || cepInput.value == "93093-093") {
        cep.classList.remove("erro");
        cepEscolhas.classList.remove("hide");
        cepNumeros.classList.add("hide");
    } else {
        cep.classList.add("erro");
        cepEscolhas.classList.add("hide");
        cepNumeros.classList.remove("hide");
        document.querySelector(".resume-shipping").classList.add("d-none");
    }
};
//click no texto "não sei meu cep"
cepNaoSei.onclick = function () {
    if (cepNumeros.classList.contains("hide")) {
        cepNumeros.classList.remove("hide");
    } else {
        cepNumeros.classList.add("hide");
    }
};


//Remover itens do carrinho
function excluir() {
    var excluir = document.querySelectorAll(".excluir");

    excluir.forEach(function (est) {
        est.onclick = function () {
            var produtoTodo = est.parentElement.parentElement;

            var listaProdLoja = document.querySelector(".product[data-target='" + produtoTodo.dataset.target + "']");
            listaProdLoja.classList.remove("selected");
            listaProdLoja.children[3].removeAttribute("disabled");

            produtoTodo.remove();

            if (document.querySelectorAll(".bag .items").length == 0) {
                document.querySelector(".cart").classList.add("d-none");
            };

            resumoTotal();
        }
    })
};


//SOMA dos itens total dentro do Carrinho (click no input de quantidade)
function inputQdt(input) {
    var valorItensTotal = 0;
    var qtd = input;//input quantidade
    var valor = input.parentElement.nextElementSibling;//div pai span valor (preço do produto)

    valorItensTotal += (parseFloat(valor.dataset.price.replace(",", ".")) * parseInt(qtd.value));//parseFloat: pega 1ponto de dezena - parseInt: numeros inteiros sem fração

    input.parentElement.nextElementSibling.children[0].innerHTML = valorItensTotal.toFixed(2).toString().replace(".", ",");

    if (qtd.value == 0) {
        qtd.nextElementSibling.click();
    };

    resumoTotal();
};


//opcoes de frete, click nos radios buttons
var cepValores = document.querySelectorAll(".zipcode-choices input");
cepValores.forEach(function (cepV) {
    cepV.onclick = function () {
        resumoTotal();
    }
});


//Resumo total dos itens
function resumoTotal() {
    var valorResumo = 0;
    var items = document.querySelectorAll(".items");
    items.forEach(function (item) {
        var valor = item.children[2].children[0];//span valor (preço do produto)
        var valorTodosItens = document.querySelector(".resume-value span");
        var valorTotalFrete = document.querySelector(".resume-cep span");
        var valorFreteApartir = document.querySelector(".shipping-info span");
        var resumoFrete = document.querySelector(".resume-shipping");
        var txtFreteAdd = document.querySelector(".shipping-add");
        var txtFreteFree = document.querySelector(".shipping-free");
        var FreteFreeRadio = document.querySelector(".zipcode-free");
        var tiposFrete = document.querySelectorAll(".zipcode-choices .radios");

        valorResumo += (parseFloat(valor.innerHTML.replace(",", ".")));
        document.querySelector(".resume-value span").innerHTML = valorResumo.toFixed(2).toString().replace(".", ",");
        document.querySelector(".resume-total").innerHTML = valorResumo.toFixed(2).toString().replace(".", ",");

        //texto para frete grátis       
        var paraGratis = 0;
        //obs.: 'parseFloat' converte uma string em valores numericos
        if (parseFloat(valorTodosItens.innerHTML.replace(",", ".")) >= parseFloat(valorFreteApartir.innerHTML.replace(",", "."))) {
            txtFreteAdd.classList.add("d-none");//remove texto valor faltante
            resumoFrete.classList.add("autoselecionado");//coloca cor verde Resumo Total do frete 
            resumoFrete.classList.remove("d-none");//mostra no Resumo Total o valor frete
            txtFreteFree.classList.remove("d-none");//mostra texto ganhou frete grátis
            FreteFreeRadio.classList.remove("d-none");//mostra radio button frete gratis selecionado
            tiposFrete.forEach(function (cadaFrete) {//TODAS AS ESCOLHAS DE FRETE
                cadaFrete.classList.add("desabilitado");//coloca cor cinza opções frete (meio agado) 
                cadaFrete.children[0].setAttribute("disabled", "disabled");//desabilita opções de frete pago (radios button)
            });
            tiposFrete[2].classList.add("autoselecionado");//Escolha frete gratis, coloca cor verde
            tiposFrete[2].children[0].checked = true;//Escolha frete gratis, seleciona radio button
            valorTotalFrete.innerHTML = "0,00";//Resumo total, reescreve o frete valor = 0
        } else {
            txtFreteAdd.classList.remove("d-none");
            resumoFrete.classList.remove("autoselecionado");
            resumoFrete.classList.add("d-none");
            txtFreteFree.classList.add("d-none");
            FreteFreeRadio.classList.add("d-none");
            tiposFrete.forEach(function (cadaFrete) {
                cadaFrete.classList.remove("desabilitado");
                cadaFrete.children[0].removeAttribute("disabled");
            });
            tiposFrete[2].classList.remove("autoselecionado");
            tiposFrete[2].children[0].checked = false;
        }
        paraGratis += (parseFloat(valorFreteApartir.innerHTML.replace(",", ".")) - parseFloat(valorTodosItens.innerHTML.replace(",", ".")));
        document.querySelector(".shipping-add span").innerHTML = paraGratis.toFixed(2).toString().replace(".", ",");

        //soma valores total
        var cepSelecionado = document.querySelector(".radios input:checked");

        //Após o click nos radios buttons
        if (cepSelecionado != null || cepSelecionado != undefined) {
            var valorTotal = 0;
            resumoFrete.classList.remove("d-none");
            valorTotalFrete.innerHTML = cepSelecionado.value;

            //mostra Total (soma todos itens + frete)
            valorTotal += (parseFloat(valorTodosItens.innerHTML.replace(",", ".")) + parseFloat(valorTotalFrete.innerHTML.replace(",", ".")));
            document.querySelector(".resume-total").innerHTML = "R$ " + valorTotal.toFixed(2).toString().replace(".", ",");
        };

        //itens total por input quantidade
        var inputItens = document.querySelectorAll(".items input");
        qtdItensValorTotal = 0;
        inputItens.forEach(function (inputItens) {
            qtdItensValorTotal += parseInt(inputItens.value);
        });
        document.querySelector(".resumo-itens").innerHTML = qtdItensValorTotal + (qtdItensValorTotal == 1 ? " item" : " items");

    });
};