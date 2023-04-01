const form = document.getElementById('form');
const email = document.getElementById('inputEmail');
const erroEmail = document.getElementById('msg-email');
const senha = document.getElementById('inputPassword');
const erroSenha = document.getElementById('msg-senha');
const btn = document.getElementById('btn');
const formFields = document.querySelectorAll('input');

//loop para liberar e desabilitar o botão
let formIsValid = false;

  formFields.forEach(field => {
    field.addEventListener('input', () => {
      formIsValid = true;

      formFields.forEach(field => {
        if (field.value === '') {
          formIsValid = false;
        }

        if(!isValidEmail(email.value.trim())){
            formIsValid = false;
        }
      });

      if (formIsValid) {
        btn.disabled = false;
      } else {
        btn.disabled = true;
      }
    });
  });

//envio do formulario de login
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  //validação do formulario
  if(email.value.trim() === ''){
    erroEmail.innerText = 'Insira seu email';
    email.classList.add('erro');
  }else if (!isValidEmail(email.value.trim())){
    erroEmail.innerText = 'O email informado não é válido';
    email.classList.add('erro');
  }else {
    erroEmail.innerText = '';
    email.classList.remove('erro');
  }

  if(senha.value.trim() === ''){
    erroSenha.innerText = 'Insira sua senha';
    senha.classList.add('erro');
  }else {
    erroSenha.innerText = '';
    senha.classList.remove('erro');
  }  

  //If para enviar as informações validadas para a função
  if(email.value.trim() !== '' && senha.value.length >= 8 && senha.value.trim() !== ''){
    await loginUser(email.value, senha.value);
  }
});

//função async para logar
async function loginUser() {
  
  let dados = {
    email: email.value,
    password: senha.value
  }

  let settings = {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(dados)
  }

  const resposta = await fetch('https://todo-api.ctd.academy/v1/users/login', settings)

  if (resposta.ok) {
    let data = await resposta.json();
    console.log(data);
    localStorage.setItem('token', data.jwt);
    window.location.href = '/tarefas.html';
  }

}

function isValidEmail(email) {
  // Implementar aqui uma validação mais robusta para o email, se necessário
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}