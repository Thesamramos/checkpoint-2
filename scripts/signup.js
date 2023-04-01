const form = document.getElementById('form');
const nome = document.getElementById('nome');
const erroNome = document.getElementById('msg-nome');
const sobrenome = document.getElementById('sobrenome');
const errosobrenome = document.getElementById('msg-sobrenome');
const email = document.getElementById('email');
const erroEmail = document.getElementById('msg-email');
const senha = document.getElementById('senha');
const erroSenha = document.getElementById('msg-senha');
const senha2 = document.getElementById('senha2');
const erroSenha2 = document.getElementById('msg-senha2');

//envio do formulario de cadastro
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  //validação do formulario
  if (nome.value.trim() === '') {
    erroNome.innerText = 'Insira seu nome';
    nome.classList.add('erro');
  } else {
    erroNome.innerText = '';
    nome.classList.remove('erro');
  }

  if (sobrenome.value.trim() === '') {
    errosobrenome.innerText = 'Insira seu sobrenome';
    sobrenome.classList.add('erro');
  } else {
    errosobrenome.innerText = '';
    sobrenome.classList.remove('erro');
  }

  if (email.value.trim() === '') {
    erroEmail.innerText = 'Insira seu email';
    email.classList.add('erro');
  } else if (!isValidEmail(email.value.trim())) {
    erroEmail.innerText = 'O email informado não é válido';
    email.classList.add('erro');
  } else {
    erroEmail.innerText = '';
    email.classList.remove('erro');
  }

  if (senha.value.trim() === '') {
    erroSenha.innerText = 'Insira sua senha';
    senha.classList.add('erro');
  } else if (senha.value.length < 8) {
    erroSenha.innerText = 'A senha deve conter no minimo 4 caracteres';
    senha.classList.add('erro');
  } else {
    erroSenha.innerText = '';
    senha.classList.remove('erro');
  }

  if (senha2.value.trim() === '') {
    erroSenha2.innerText = 'Insira sua senha novamente';
    senha2.classList.add('erro');
  } else if (senha.value != '' && senha2.value != '' && senha2.value != senha.value) {
    erroSenha2.innerText = 'A senha dever ser igual a anterior';
    senha2.classList.add('erro');
  } else {
    erroSenha2.innerText = '';
    senha2.classList.remove('erro');
  }

  //If para enviar as informações validadas para a função
  if(nome.value.trim() !== '' && sobrenome.value.trim() !== '' && email.value.trim() !== '' && senha.value.length >= 8 && senha2.value.length >= 8 && senha.value.trim() !== '' && senha2.value.trim() !== ''){
    await registrarUser(nome.value, sobrenome.value, email.value, senha.value);
  }
  
});

//função async para registrar o novo usuario
async function registrarUser() {

  let dados = {
    firstName: nome.value,
    lastName: sobrenome.value,
    email: email.value,
    password: senha.value
  }

  const dadosJson = JSON.stringify(dados);

  let settings = {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: dadosJson
  }

  const resposta = await fetch('https://todo-api.ctd.academy/v1/users', settings)

  let data = await resposta.json();
  console.log(data);

  if (resposta.ok) {
    window.location.href = '/index.html';
  }
}

function isValidEmail(email) {
  // Implementar aqui uma validação mais robusta para o email, se necessário
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}