const btnSubmit = document.getElementById('btn');
const btnCloseApp = document.getElementById('closeApp');
let tarefaInput = document.getElementById('novaTarefa');
let botaoLixo = document.querySelectorAll('.trash');

userName();
carregarTarefas();

//Tarefas do LocalStorage
function carregarTarefas() {
    const divTarefas = document.getElementById('tarefas');
    const tarefasConcluidas = document.querySelector('.tarefas-terminadas');
  
    // Percorre todas as chaves do localStorage
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
  
      // Verifica se a chave começa com "tarefa-"
      if (key.startsWith('tarefa-')) {
        const tarefa = JSON.parse(localStorage.getItem(key));
        const dataTarefa = new Date(tarefa.createdAt);
  
        // Cria um novo elemento li para a tarefa e adiciona na lista de tarefas
        const liTarefa = document.createElement('li');
        liTarefa.setAttribute('id', `task-${tarefa.id}`);
        liTarefa.classList.add('tarefa');
        liTarefa.innerHTML = `
          <div class="not-done" onclick="concluirTarefa('${tarefa.id}')"></div>
          <div class="descricao">
            <p class="nome">${tarefa.description}</p>
            <p class="timestamp">Criada em: ${dataTarefa.toLocaleDateString()}</p>
          </div>
          <button class="trash" onclick="ativarLixeira('${tarefa.id}')">
            <img src="./assets/excluir.png" alt="lixeira">
          </button>
        `;
        divTarefas.appendChild(liTarefa);
      }
  
      // Verifica se a chave começa com "tarefa-concluida-"
      if (key.startsWith('concluida-')) {
        const tarefa = JSON.parse(localStorage.getItem(key));
        const dataTarefa = new Date(tarefa.createdAt);
  
        // Cria um novo elemento li para a tarefa concluída e adiciona na lista de tarefas concluídas
        const liTarefa = document.createElement('li');
        liTarefa.setAttribute('id', `task-${tarefa.id}`);
        liTarefa.classList.add('tarefa');
        liTarefa.innerHTML = `
            <button class="seta" onclick="voltarTarefa('${tarefa.id}')">
            <img src="./assets/seta-para-cima.png" alt="seta">
            </button>
          <div class="descricao">
            <p class="nome">${tarefa.description}</p>
            <p class="timestamp">Concluída em: ${dataTarefa.toLocaleDateString()}</p>
          </div>
          <button class="trash" onclick="ativarLixeira('${tarefa.id}')">
            <img src="./assets/excluir.png" alt="lixeira">
          </button>
        `;
        tarefasConcluidas.appendChild(liTarefa);
      }
    }
  }

//botão de finalizar seção
btnCloseApp.addEventListener('click', function () {
    localStorage.clear();
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

//botão para adicionar nova tarefa e validação da tarefa
btnSubmit.addEventListener('click', async (e) => {
    e.preventDefault();

    if (tarefaInput.value.length >= 5 && tarefaInput.value.trim() != '') {
        await criarTarefa();
        console.log(`Tarefa ${tarefaInput.value} criada`);
    } else {
        window.alert('A tarefa tem que possuir no minimo 5 caracteres');
    }
})

//função async para criar uma nova tarefa
async function criarTarefa() {

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
            <li class="tarefa" id="task-${data.id}">
            <div class="not-done" onclick="concluirTarefa('${data.id}')"></div>
            <div class="descricao">
            <p class="nome">${data.description}</p>
            <p class="timestamp">Criada em: ${dataTarefa.toLocaleDateString()}</p>
            </div>
            <button class="trash" onclick="ativarLixeira('${data.id}')">
            <img src="./assets/excluir.png" alt="lixeira">
            </button>
            </li>
        `
        divTarefas.appendChild(tarefa);
        localStorage.setItem(`tarefa-${data.id}`, JSON.stringify(data));
    }
}

//função async para excluir tarefa
async function ativarLixeira(id) {

    let liTarefa = document.getElementById(`task-${id}`);

    let settings = {
        method: 'DELETE',
        headers: {
            "content-type": "application/json",
            "authorization": localStorage.getItem('token')
        }
    }

    const resposta = await fetch(`https://todo-api.ctd.academy/v1/tasks/${id}`, settings);
    let data = await resposta.json();
    console.log(data);

    if (resposta.ok) {
        liTarefa.remove();
        localStorage.removeItem(`tarefa-${id}`);
    }

    if(resposta.ok){
        localStorage.removeItem(`concluida-${id}`);
    }
};

//função async para marcar como concluida a tarefa
async function concluirTarefa(id) {

    let liTarefa = document.getElementById(`task-${id}`);

    let settings = {
        method: 'PUT',
        headers: {
            "content-type": "application/json",
            "authorization": localStorage.getItem('token')
        },
        body: JSON.stringify({ "completed": true })
    }
    const resposta = await fetch(`https://todo-api.ctd.academy/v1/tasks/${id}`, settings);
    let data = await resposta.json();
    console.log(data);

    liTarefa.remove();
    localStorage.removeItem(`tarefa-${id}`);
    if (resposta.ok) {

        let tarefaTerminada = document.createElement('div');
        let tarefasTerminadas = document.querySelector('.tarefas-terminadas');
        let dataTarefaTerminada = new Date();

        tarefaTerminada.innerHTML = ` 
        <li class="tarefa" id="task-${data.id}">
        <button class="seta" onclick="voltarTarefa('${data.id}')">
        <img src="./assets/seta-para-cima.png" alt="seta">
        </button>
        <div class="descricao">
        <p class="nome">${data.description}</p>
        <p class="timestamp">Concluida em: ${dataTarefaTerminada.toLocaleDateString()}</p>
        </div>
        <button class="trash" onclick="ativarLixeira('${data.id}')">
        <img src="./assets/excluir.png" alt="lixeira">
        </button>
        </li>
    `
        tarefasTerminadas.appendChild(tarefaTerminada);
        localStorage.setItem(`concluida-${id}`, JSON.stringify(data));
    }
};

//função async para marcar como pedente a tarefa
async function voltarTarefa(id) {

    let tarefaTerminada = document.getElementById(`task-${id}`);

    let settings = {
        method: 'PUT',
        headers: {
            "content-type": "application/json",
            "authorization": localStorage.getItem('token')
        },
        body: JSON.stringify({ "completed": false })
    }
    const resposta = await fetch(`https://todo-api.ctd.academy/v1/tasks/${id}`, settings);
    let data = await resposta.json();
    console.log(data);

    tarefaTerminada.remove();
    localStorage.removeItem(`concluida-${id}`);
    if (resposta.ok) {

        let divTarefas = document.getElementById('tarefas');
        let tarefa = document.createElement('li');
        let dataTarefa = new Date();

        tarefa.innerHTML = `
            <li class="tarefa" id="task-${data.id}">
            <div class="not-done" onclick="concluirTarefa('${data.id}')"></div>
            <div class="descricao">
            <p class="nome">${data.description}</p>
            <p class="timestamp">Criada em: ${dataTarefa.toLocaleDateString()}</p>
            </div>
            <button class="trash" onclick="ativarLixeira('${data.id}')">
            <img src="./assets/excluir.png" alt="lixeira">
            </button>
            </li>
        `
        divTarefas.appendChild(tarefa);
        localStorage.setItem(`tarefa-${data.id}`, JSON.stringify(data));
    }

};