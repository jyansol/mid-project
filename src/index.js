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
const logoEl = document.querySelector('.logo');
const loginBtn = document.querySelector('.login-btn');
const signUpnBtn = document.querySelector('.sign-up-btn');

logoEl.addEventListener('click', (e) => {
  drawMainForm();
});

// Enter를 클릭하면 homepage를 그리는 함수
const drawMainForm = async () => {
  const frag = document.importNode(templates.homePage, true);
  const enterBtn = frag.querySelector('.enter-btn');

  //enterBtn
  enterBtn.addEventListener('click', async (e) => {
    // e.preventDefault();
    const frag = document.importNode(templates.postPage, true);
    rootEl.textContent = '';
    rootEl.appendChild(frag);
  });

  //loginBtn
  loginBtn.addEventListener('click', (e) => {
    const frag = document.importNode(templates.loginForm, true);
    rootEl.textContent = '';
    rootEl.appendChild(frag);
  });

  //signUpBtn
  signUpnBtn.addEventListener('click', (e) => {
    const frag = document.importNode(templates.signForm, true);
    rootEl.textContent = '';
    rootEl.appendChild(frag);
  });

  rootEl.textContent = '';
  rootEl.appendChild(frag);
};

const drawLoginForm = async () => {
  const frag = document.importNode(templates.loginForm, true);
  const loginBtn = document.querySelector('.login-btn');
  loginBtn.addEventListener('click', (e) => {
    rootEl.textContent = '';
    rootEl.appendChild(frag);
  });
};
drawLoginForm();

if (localStorage.getItem('token')) {
  drawPostList();
} else {
  drawMainForm();
}

// 페이지 그리는 함수 작성 순서
// 1. 템플릿 복사
// 2. 요소 선택
// 3. 필요한 데이터 불러오기
// 4. 내용 채우기
// 5. 이벤트 리스너 등록하기
// 6. 템플릿을 문서에 삽입
