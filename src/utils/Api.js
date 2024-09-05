function checkResponse(res) {
  if (res.ok) {
    return res.json();
  }
  return Promise.reject(`Error: ${res.status}`);
}

class Api {
  constructor({ baseUrl, headers, userBaseUrl }) {
    this._baseUrl = baseUrl;
    this._headers = headers;
    this._userBaseUrl = userBaseUrl; 
  }

  getUserInfo() {
    return fetch(`${this._userBaseUrl}/users/me`, {
      headers: this._headers,
    }).then(checkResponse);
  }

  getAppInfo() {
    return Promise.all([this.getUserInfo(), this.getInitialCards()]);
  }

  getInitialCards() {
    return fetch(`${this._baseUrl}/cards`, {
      headers: this._headers,
    }).then(checkResponse);
  }
  
  addCard({ name, link }) {
    return fetch(`${this._baseUrl}/cards`, {
      method: "POST",
      headers: {
        ...this._headers,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        link,
      }),
    }).then(checkResponse);
  }


  editUserInfo({ name, about, }) {
    return fetch(`${this._userBaseUrl}/users/me`, {
      method: "PATCH",
      headers: {
        ...this._headers,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        about,
      }),
    }).then(checkResponse);
  }

  editAvatarInfo(avatar) {
    return fetch(`${this._userBaseUrl}/users/me/avatar`, {
      method: "PATCH",
      headers: {
        ...this._headers,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        avatar,
      }),
    }).then(checkResponse);
  }

  changeLikeStatus(id, isLiked) {
    return fetch(`${this._userBaseUrl}/cards/${id}/likes`, {
      method: isLiked ? "DELETE" : "PUT",
      headers: {
        ...this._headers,
        'Content-Type': 'application/json',
      },
    }).then(checkResponse);
  }

  deleteCard(id) {
    return fetch(`${this._userBaseUrl}/cards/${id}`, {
      method: "DELETE",
      headers: this._headers,
    }).then(checkResponse);
  }

}

export default Api;
