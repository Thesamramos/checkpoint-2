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

    if(resposta.ok){
        document.getElementById('username').innerText = `${data.firstName} ${data.lastName}`;
    }
}

userName();
