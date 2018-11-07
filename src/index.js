import '@babel/polyfill'; // 이 라인을 지우지 말아주세요!

import axios from 'axios';

const api = axios.create({
  baseURL: process.env.API_URL,
});

api.interceptors.request.use(function(config) {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers = config.headers || {};
    config.headers['Authorization'] = 'Bearer ' + token;
  }
  return config;
});

const templates = {
  homePage: document.querySelector('#home-page').content,
  loginForm: document.querySelector('#login-form').content,
  signForm: document.querySelector('#sign-up-form').content,
  postPage: document.querySelector('#post-page').content,
  postItem: document.querySelector('#post-item').content,
  detailPage: document.querySelector('#detail-page').content,
  cartPage: document.querySelector('#cart-page').content,
  cartItem: document.querySelector('#detail-page').content,
  myPage: document.querySelector('#my-page').content,
  mypageItem: document.querySelector('#my-page-item').content,
  payPage: document.querySelector('#pay-page').content,
  payPageItem: document.querySelector('#pay-page-item').content,
};

const rootEl = document.querySelector('.root');
const frag = document.importNode(templates.homePage, true);
rootEl.appendChild(frag);

// 페이지 그리는 함수 작성 순서
// 1. 템플릿 복사
// 2. 요소 선택
// 3. 필요한 데이터 불러오기
// 4. 내용 채우기
// 5. 이벤트 리스너 등록하기
// 6. 템플릿을 문서에 삽입
