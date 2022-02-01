const myModal = new bootstrap.Modal("#transaction-modal");
let logged = sessionStorage.getItem("logged");
const session = localStorage.getItem("session");

let data = {
    transactions: []
};

document.getElementById("button-logout").addEventListener("click", logout);

//ADICIONAR LANÇAMENTO
document.getElementById("transaction-form").addEventListener("submit", function (e) {
    e.preventDefault();

    const value = parseFloat(document.getElementById("value-input").value);
    const description = document.getElementById("description-input").value;
    const date = document.getElementById("date-input").value;
    const type = document.querySelector('input[name="type-input"]:checked').value;
    const id = data.transactions.length + 1;

    data.transactions.unshift({
        id: id, value: value, type: type, description: description, date: date
    });

    saveData(data);
    e.target.reset();
    myModal.hide();

    getTransactions();

    alert("Lançamento Adicionado com sucesso.");

});

checkLogged();

function checkLogged() {
    if (session) {
        sessionStorage.setItem("logged", session);
        logged = session;
    }

    if (!logged) {
        window.location.href = "index.html";
        return;
    }

    const dataUser = localStorage.getItem(logged);
    if (dataUser) {
        data = JSON.parse(dataUser);
    }

    getTransactions();

}

function logout() {
    sessionStorage.removeItem("logged");
    localStorage.removeItem("session");

    window.location.href = "index.html";
}

function getTransactions() {
    const transactions = data.transactions;
    let transactionsHtml = ``;

    if (transactions.length) {
        transactions.forEach((item) => {
            let type = "Entrada";

            if (item.type === "2") {
                type = "Saída"
            }

            transactionsHtml += `
                <tr>
                    <th scope="row">${item.date}</th>
                    <td>${item.value.toFixed(2)}</td>
                    <td>${type}</td>
                    <td>${item.description}</td>
                    <td><button type="button" class="btn button-default btn-remove-item" id="remove-btn-${item.id}">Remover</button></td>
                    <td><button type="button" class="btn button-default btn-atualizar-item" id="att-btn-${item.id}">Atualizar</button></td>
                </tr>            
            `
        })
    }

    document.getElementById("transactions-list").innerHTML = transactionsHtml;
    addEventButtonsRemoveItems();
}

function saveData(data) {
    localStorage.setItem(data.login, JSON.stringify(data))
}

function addEventButtonsRemoveItems() {
    const transactions = data.transactions;

    transactions.forEach((item) => {
        document.getElementById(`remove-btn-${item.id}`).addEventListener("click", function (e) {
            e.preventDefault();

            var response = confirm("Deseja remover o item selecionado?");

            if (!response)
                return

            var id = getIdToRemove(e.target.id);

            data.transactions = data.transactions.filter(function (value) {
                return value.id != id;
            });

            saveData(data);
            getTransactions();

            alert("Item removido com sucesso!")
        });

    });
}

function getIdToRemove(str) {
    return str.replace("remove-btn-", "");
}
//teste
///