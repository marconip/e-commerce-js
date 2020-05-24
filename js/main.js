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
    var produtoLista = document.querySelectorAll(".product");

    excluir.forEach(function (est) {
        est.onclick = function () {
            var produtoTodo = est.parentElement.parentElement;

            produtoLista[produtoTodo.dataset.target-1].classList.remove("selected");
            produtoLista[produtoTodo.dataset.target-1].children[3].removeAttribute("disabled");

            produtoTodo.remove();

            if (document.querySelectorAll(".bag .items").length == 0) {
                document.querySelector(".cart").classList.add("d-none");
            };

            resumoTotal();
        }
    })
};

//SOMA dos itens total dentro do Carrinho
function inputQdt(input) {
    var valorItensTotal = 0;
    var qtd = input;//input quantidade
    var valor = input.parentElement.nextElementSibling;//div pai span valor

    valorItensTotal += (parseFloat(valor.dataset.price) * parseInt(qtd.value));

    input.parentElement.nextElementSibling.children[0].innerHTML = valorItensTotal.toFixed(2).toString().replace(".", ",");

    if (qtd.value == 0) {
        qtd.nextElementSibling.click();
    };

    resumoTotal();
};


//Resumo total dos itens
function resumoTotal() {
    var valorResumo = 0;
    var items = document.querySelectorAll(".items");
    items.forEach(function (item) {
        var valor = item.children[2].children[0];//span valor
        valorResumo += (parseFloat(valor.innerHTML));

        document.querySelector(".resume-value span").innerHTML = valorResumo.toFixed(2).toString().replace(".", ",");
        document.querySelector(".resume-total").innerHTML = valorResumo.toFixed(2).toString().replace(".", ",");

        //Soma total valor de itens + frete    /////////////        
        var valorTodosItens = document.querySelector(".resume-value span");
        var valorTotalFrete = document.querySelector(".resume-cep span");
        var valorFreteApartir = document.querySelector(".shipping-info span");
        var resumoFrete = document.querySelector(".resume-shipping");

        //soma valores total
        var cepSelecionado = document.querySelector(".radios input:checked");

        if (cepSelecionado != null || cepSelecionado != undefined) {
            var valorTotal = 0;
            resumoFrete.classList.remove("d-none");
            valorTotalFrete.innerHTML = cepSelecionado.value;

            //mostra Total (soma todos itens + frete)
            valorTotal += (parseFloat(valorTodosItens.innerHTML.replace(",", ".")) + parseFloat(valorTotalFrete.innerHTML.replace(",", ".")));
            document.querySelector(".resume-total").innerHTML = "R$ " + valorTotal.toFixed(2).toString().replace(".", ",");
        };


        //texto para frete grátis
        var txtFreteAdd = document.querySelector(".shipping-add");
        var txtFreteFree = document.querySelector(".shipping-free");
        var tiposFrete = document.querySelectorAll(".zipcode-choices .radios");
        var paraGratis = 0;
        paraGratis += (parseFloat(valorFreteApartir.innerHTML.replace(",", ".")) - parseFloat(valorTodosItens.innerHTML.replace(",", ".")));

        if (valorTodosItens.innerHTML >= valorFreteApartir.innerHTML) {
            txtFreteAdd.classList.add("d-none");
            txtFreteFree.classList.remove("d-none");
            resumoFrete.classList.remove("d-none");
            resumoFrete.classList.add("autoselecionado");
            tiposFrete.forEach(function (cadaFrete) {
                cadaFrete.classList.add("desabilitado");
                cadaFrete.children[0].setAttribute("disabled", "disabled");
            });
            tiposFrete[2].classList.remove("desabilitado");
            tiposFrete[2].classList.add("autoselecionado");
            tiposFrete[2].children[0].checked = true;
        } else {
            resumoFrete.classList.remove("autoselecionado");
            txtFreteAdd.classList.remove("d-none");
            txtFreteFree.classList.add("d-none");
            tiposFrete[2].classList.remove("autoselecionado");
            tiposFrete[2].children[0].checked = false;
            tiposFrete.forEach(function (cadaFrete) {
                cadaFrete.classList.remove("desabilitado");
                cadaFrete.children[0].removeAttribute("disabled");
            });
        }
        document.querySelector(".shipping-add span").innerHTML = paraGratis.toFixed(2).toString().replace(".", ",");


        ////itens total por input
        var inputItens = document.querySelectorAll(".items input");
        itensvalorTotal = 0;
        inputItens.forEach(function (inputItens) {
            itensvalorTotal += parseInt(inputItens.value);
        });
        document.querySelector(".resumo-itens").innerHTML = itensvalorTotal + (itensvalorTotal == 1 ? " item" : " items");

    });
};

//opcoes de frete
var cepValores = document.querySelectorAll(".zipcode-choices input");
cepValores.forEach(function (cepV) {
    cepV.onclick = function () {
        resumoTotal();
    }
});