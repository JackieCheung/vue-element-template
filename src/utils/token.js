const TOKEN_KEY = 'Vue-Element-Token'

export function getToken () {
  return window.localStorage.getItem(TOKEN_KEY)
}

export function setToken (token) {
  window.localStorage.setItem(TOKEN_KEY, token)
}

export function removeToken () {
  window.localStorage.removeItem(TOKEN_KEY)
}
