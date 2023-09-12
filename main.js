import { getTodos } from "./api.js";
import { renderLogin } from "./renderLogin.js";
import { renderTasks } from "./renderTasks.js";

let tasks = [];

const fetchAndRenderTasks = () => {
  getTodos()
    .then((responseData) => {
      tasks = responseData.todos;
      renderTasks({ tasks, fetchAndRenderTasks });
    })
    .catch((error) => {
      if (error.message === "Нет авторизации") {
        // Пробуем снова, если пароль не подошел
        // fetchAndRenderTasks();
      }

      if (window.navigator.onLine === false) {
        alert("Проблемы с интернетом, проверьте подключение");
      }
    });
};

renderLogin({ fetchAndRenderTasks });
