import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/syslogin/login',
    method: 'post',
    withCredentials: 'true',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/syslogin/login/user/info',
    method: 'get',
    withCredentials: 'true',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/syslogin/loginout',
    withCredentials: 'true',
    method: 'post'
  })
}

export function initVerifyCode(fosV) {
  return request({
    url: '/syslogin/initVerifyCode',
    method: 'get',
    responseType: 'json',
    withCredentials: 'true',
    params: { fosV }
  })
}

export function getMoveRoute() {
  return request({
    url: '/syslogin/getMoveRoute',
    method: 'get',
    responseType: 'json',
    withCredentials: 'true'
  })
}
