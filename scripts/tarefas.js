const btnSubmit = document.getElementById('btn');
const btnCloseApp = document.getElementById('closeApp');
let tarefaInput = document.getElementById('novaTarefa');
let botaoLixo = document.querySelectorAll('.trash');
window.addEventListener('load', concluirTarefa);

userName();

for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith("tarefa-")) {
      const tarefa = JSON.parse(localStorage.getItem(key));
      // Adicionar a tarefa no HTML
      let divTarefas = document.getElementById('tarefas');
      let tarefaElement = document.createElement('li');
      let dataTarefa = new Date(tarefa.createdAt);
      tarefaElement.innerHTML = `
        <li class="tarefa" id="task-${tarefa.id}">
          <div class="not-done"></div>
          <div class="descricao">
            <p class="nome">${tarefa.description}</p>
            <p class="timestamp">Criada em: ${dataTarefa.toLocaleDateString()}</p>
          </div>
          <button class="trash" onclick="ativarLixeira('${tarefa.id}')">
            <img src="./assets/excluir.png" alt="lixeira">
          </button>
        </li>
      `;
      divTarefas.appendChild(tarefaElement);
    }
  };

//botão de finalizar seção
btnCloseApp.addEventListener('click', function (){
    localStorage.clear();
    window.location.href = '/index.html';
});

//função async para adicionar o nome de usuario no header
async function userName() {

    let settings = {
        method: "GET",
        headers: {
            "content-type": "application/json",
            "authorization": localStorage.getItem('token')
        }
    };

    const resposta = await fetch('https://todo-api.ctd.academy/v1/users/getMe', settings);

    let data = await resposta.json();
    console.log(data);

    if (resposta.ok) {
        document.getElementById('username').innerText = `${data.firstName} ${data.lastName}`;
    };
}



//botão para adicionar nova tarefa e validação da tarefa
btnSubmit.addEventListener('click', async (e) => {
    e.preventDefault();

    if(tarefaInput.value.length >= 5 && tarefaInput.value.trim() != ''){
        await criarTarefa(); 
        console.log(`Tarefa ${tarefaInput.value} criada`);
    } else {
       window.alert('A tarefa tem que possuir no minimo 5 caracteres');
    };
    
});

//função async para criar uma nova tarefa
async function criarTarefa() {

    let dados = {
        description: tarefaInput.value,
        completed: false
    };

    let settings = {
        method: "POST",
        headers: {
            "content-type": "application/json",
            "authorization": localStorage.getItem('token')
        },
        body: JSON.stringify(dados)
    };

    const resposta = await fetch('https://todo-api.ctd.academy/v1/tasks', settings);

    let data = await resposta.json();
    console.log(data);

    if (resposta.ok) {

        let divTarefas = document.getElementById('tarefas');
        let tarefa = document.createElement('li');
        let dataTarefa = new Date();

        tarefa.innerHTML = `
            <li class="tarefa" id="task-${data.id}">
            <div class="not-done"></div>
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
        concluirTarefa();
    }
};

async function ativarLixeira(id){

    let liTarefa = document.getElementById(`task-${id}`);

    let settings = {
        method: 'DELETE',
        headers: {
            "content-type": "application/json",
            "authorization": localStorage.getItem('token')
        }
    };

    const resposta = await fetch(`https://todo-api.ctd.academy/v1/tasks/${id}`, settings);
    let data = await resposta.json();
    console.log(data);

    if(resposta.ok){
        liTarefa.remove();
        localStorage.removeItem(`tarefa-${id}`);
    };
    
};

// Concluir uma tarefa


function concluirTarefa() {
    let notDone = document.querySelectorAll(".not-done");
    for (let i = 0; i < notDone.length; i++) {
      notDone[i].addEventListener("click", function() {
        this.parentElement.classList.toggle("riscado");
  
        //move para lista terminada
        let moveTarefa = this.parentNode;
        document.querySelector('.tarefas-terminadas').appendChild(moveTarefa);
  
        //adicionar botão de refazer
        let reloadButton = document.createElement("button");
        reloadButton.className = "recarregarTarefa";
        reloadButton.innerHTML = '<img src="./assets/reload.png" alt=""></img>'
        moveTarefa.insertBefore(reloadButton, moveTarefa.firstChild)

        //desabilita a div not-done
        this.remove();

      }); 
    }
  }
  
