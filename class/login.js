import { Domain } from "../internal/requestHandler.js"; 
export class Login {
    constructor() {
        this.HTML = document.createElement('form');
        this.id = 'formLogin';
        this.container = document.getElementById('container');
        this.container.appendChild(this.formInit());
        this.getValues();
    }

    formInit() {
        let title = document.createElement('h1');
        title.id = 'title';
        title.textContent = 'Welcome to GraphQL'
        this.HTML.appendChild(title);
        let loginBlock = document.createElement('div');
        loginBlock.id = 'loginBlock';
        let login = document.createElement('input');
        login.name = 'login';
        login.type = 'text';
        login.id = 'login';
        login.placeholder = 'username/email';
        loginBlock.appendChild(login);
        let password = document.createElement('input');
        password.name = 'password';
        password.type = 'password';
        password.id = 'password';
        password.placeholder = 'password';
        loginBlock.appendChild(password);
        let submit = document.createElement('button');
        submit.id = 'submit';
        submit.textContent = 'login'
        loginBlock.appendChild(submit);
        this.HTML.appendChild(loginBlock);
        return this.HTML;
    }

    getValues() {
        this.HTML.addEventListener('submit', (e)=>{
            let form = new FormData(this.HTML);
            let data = Object.fromEntries(form.entries())
            this.checkCreds(e,data.login,data.password);
        });
    }

    checkCreds(e,login,password){
            e.preventDefault();
                fetch(`${Domain}/api/auth/signin`, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization:
                      "Basic " + btoa(String(`${login}:${password}`)),
                  },
                }).then(async (response) =>{
                    const Data = await response.json();
                    if (!response.ok) {
                        localStorage.removeItem('jwt');
                        alert("didn't worked");
                    }else{
                        localStorage.setItem("jwt", Data);
                    }
                    location.reload();
                })
                .catch(err=>console.log(err))
        }
    }
    
