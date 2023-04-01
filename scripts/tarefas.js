const btnSubmit = document.getElementById('btn');
const btnCloseApp = document.getElementById('closeApp');

btnCloseApp.addEventListener('click', function (){
    window.location.href = '/index.html';
})

//função async para adicionar o nome de usuario no header
async function userName() {

    let settings = {
        method: "GET",
        headers: {
            "content-type": "application/json",
            "authorization": localStorage.getItem('token')
        }
    }

    const resposta = await fetch('https://todo-api.ctd.academy/v1/users/getMe', settings);

    let data = await resposta.json();
    console.log(data)

    if (resposta.ok) {
        document.getElementById('username').innerText = `${data.firstName} ${data.lastName}`;
    }
}

userName();

btnSubmit.addEventListener('click', async (e) => {
    e.preventDefault();
    console.log('tarefa criada')
    await criarTarefa();
})

async function criarTarefa() {

let tarefaInput = document.getElementById('novaTarefa');

    let dados = {
        description: tarefaInput.value,
        completed: false
    }

    let settings = {
        method: "POST",
        headers: {
            "content-type": "application/json",
            "authorization": localStorage.getItem('token')
        },
        body: JSON.stringify(dados)
    }

    const resposta = await fetch('https://todo-api.ctd.academy/v1/tasks', settings);

    let data = await resposta.json();
    console.log(data);

    if (resposta.ok) {
        let divTarefas = document.getElementById('tarefas');
        let tarefa = document.createElement('li');
        let dataTarefa = new Date();

        tarefa.innerHTML = `
            <li class="tarefa">
            <div class="not-done"></div>
            <div class="descricao">
            <p class="nome">${data.description}</p>
            <p class="timestamp">Criada em: ${dataTarefa.toLocaleDateString()}</p>
            </div>
            </li>
        `
        divTarefas.appendChild(tarefa);
    }
}
