import { delTodo, postTodo } from "./api.js";
import { sanitizeHtml } from "./sanitizeHtml.js";
import { formatDateToRu, formatDateToUs } from '../lib/formatDate/formatDate.js';
// import { format } from 'date-fns';

const country = `us`;

let userName;
export const setUserName = (userNewName) => {
  userName = userNewName;
};

export function renderTasks({ tasks, fetchAndRenderTasks }) {
  const appElement = document.getElementById(`app`);

  const formatDate = (date) => {
    return `${date.getDate() < 10 ? '0' + date.getDate() : date.getDate()}/${date.getMonth() < 10 ? '0' + date.getMonth() : date.getMonth()}/${date.getFullYear()} ${date.getHours() < 10 ? '0' + date.getHours() : date.getHours()}:${date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()}`;
  }

  const tasksHtml = tasks
    .map((task) => {
      return `
        <li class="task">
        <p class="task-text">
        ${sanitizeHtml(task.text)} (Создал: ${task.user?.name ?? "Неизвестно"})
        <button data-id="${
          task.id
        }" class="button delete-button">Удалить</button>
        </p>
        <p> <i>Задача создана: ${country === `ru` ? formatDateToRu(new Date(task.created_at)) : formatDateToUs(new Date(task.created_at))} </i> </p>
        </li>`;
    })
    .join("");

  const appHtml = `
    <h2>Пользователь: ${userName}</h2>
    <h1>Список задач</h1>
    <ul class="tasks" id="list">${tasksHtml}</ul>
    <br />
    <div class="form">
      <h3 class="form-title">Форма добавления</h3>
      <div class="form-row">
        Что нужно сделать:
        <input
          type="text"
          id="text-input"
          class="input"
          placeholder="Выпить кофе"
        />
      </div>
      <br />
      <button class="button" id="add-button">Добавить</button>
      </div>
      `;

  // <a href="login.html" id="link-to-link">Перейти на страницу логина</a>

  // const listElement = document.getElementById("list");
  appElement.innerHTML = appHtml;

  const deleteButtons = document.querySelectorAll(".delete-button");

  for (const deleteButton of deleteButtons) {
    deleteButton.addEventListener("click", (event) => {
      event.stopPropagation();

      const id = deleteButton.dataset.id;

      delTodo(id)
        .then((responseData) => {
          console.log(responseData);
          tasks = responseData.todos;
          renderTasks({ tasks, fetchAndRenderTasks });
        })
        .catch(() => {
          alert("Кажется, что-то пошло не так, попробуй позже");
          // TODO: Отправлять в систему сбора ошибок
          console.warn(error);
        });
    });
  }

  const buttonElement = document.getElementById("add-button");
  const textInputElement = document.getElementById("text-input");

  buttonElement.addEventListener("click", () => {
    if (textInputElement.value === "") {
      return;
    }

    buttonElement.disabled = true;
    buttonElement.textContent = "Элемент добавляется...";

    postTodo({
      text: textInputElement.value,
    })
      .then(() => {
        buttonElement.textContent = "Загружаю список…";
      })
      .then(() => {
        return fetchAndRenderTasks();
      })
      .then(() => {
        buttonElement.disabled = false;
        buttonElement.textContent = "Добавить";
        textInputElement.value = "";
      })
      .catch((error) => {
        buttonElement.disabled = false;
        buttonElement.textContent = "Добавить";

        alert(error.message);
        if (error.message === "Сервер упал") {
          // Пробуем снова, если сервер сломался
          postTodo(text);
        }
        // TODO: Отправлять в систему сбора ошибок
        console.warn(error.message);
      });
    // renderTasks({ tasks, fetchAndRenderTasks });
  });
}
