
const hostURL = "https://webdev-hw-api.vercel.app/api/v2/todos";
const userURL = "https://wedev-api.sky.pro/api/user/login";

let token;

export const setToken = (newToken) => {
  token = newToken;
}

export function getTodos() {
  return fetch(hostURL, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((response) => {
    if (response.status === 401) {
      // token = prompt("Введите верный пароль");
      throw new Error("Нет авторизации");
    }
    return response.json();
  });
}

export function delTodo(id) {
  return fetch(hostURL + `/` + id, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((response) => response.json());
}

export function postTodo({ text }) {
  return fetch(hostURL, {
    method: "POST",
    body: JSON.stringify({
      text: text,
    }),
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((response) => {
    console.log(response);
    if (response.status === 201) {
      return response.json();
    }
    if (response.status === 400) {
      throw new Error(
        `Задачу "ничего" создать нельзя, займитесь чем-нибудь полезным`
      );
    }
    if (response.status === 500) {
      throw new Error("Сервер упал");
    }
  });

}

export function login({ login, password }) {
  return fetch(userURL, {
    method: "POST",
    body: JSON.stringify({
      login,
      password,
    }),
  }).then((response) => {
    return response.json();

    console.log(response);
    if (response.status === 201) {
      return response.json();
    }
    if (response.status === 400) {
      throw new Error(
        `Задачу "ничего" создать нельзя, займитесь чем-нибудь полезным`
      );
    }
    if (response.status === 500) {
      throw new Error("Сервер упал");
    }
  });
}

