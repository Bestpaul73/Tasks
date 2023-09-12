import { login, setToken } from "./api.js";
import { setUserName } from './renderTasks.js';

export const renderLogin = ({ fetchAndRenderTasks }) => {
  const appElement = document.getElementById(`app`);
  const loginHtml = `
    <h1>Страница входа</h1>
    <div class="form">
      <h3 class="form-title">Форма входа</h3>
      <div class="form-row">
        <input type="text" id="login-input" class="input" placeholder="Логин" />
        <input
          type="text"
          id="password-input"
          class="input"
          placeholder="Пароль"
        />
      </div>
      <br />
      <button class="button" id="login-button">Войти</button>
      </div>
      `;
      
  appElement.innerHTML = loginHtml;

  const buttonElement = document.getElementById("login-button");
  const loginInputElement = document.getElementById("login-input");
  const passwordInputElement = document.getElementById("password-input");

  buttonElement.addEventListener(`click`, () => {
    // console.log(`000`);
    login({
      login: loginInputElement.value,
      password: passwordInputElement.value,
    })
      .then((responseData) => {
        console.log(responseData);
        setToken(responseData.user.token);
        setUserName(responseData.user.name);
        console.log(responseData.user);
      })
      .then(() => {
        // console.log(`111`);
        fetchAndRenderTasks();
      });
  });
};
