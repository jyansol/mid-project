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
const signUpBtn = document.querySelector('.sign-up-btn');
const oilsBtn = document.querySelector('.oils-btn');
const logoutBtn = document.querySelector('.logout-btn');

logoEl.addEventListener('click', (e) => {
  drawMainForm();
});

// Enter를 클릭하면 homepage를 그리는 함수
const drawMainForm = async () => {
  const frag = document.importNode(templates.homePage, true);
  const enterBtn = frag.querySelector('.enter-btn');

  //enterBtn을 누르면 postPage가 출력되는 이벤트
  enterBtn.addEventListener('click', async (e) => {
    drawPostList();
  });

  //loginBtn을 누르면 로그인 폼이 나타나는 이벤트
  loginBtn.addEventListener('click', (e) => {
    if (localStorage.getItem('token')) {
      alert('로그인됨');
      drawMainForm();
    } else {
      drawLoginForm();
    }
  });

  //로그아웃 버튼을 누르면 token이 사라지게
  logoutBtn.addEventListener('click', (e) => {
    localStorage.removeItem('token');
    drawMainForm();
  });

  //signUpBtn을 누르면 회원가입 폼이 나타나는 이벤트
  signUpBtn.addEventListener('click', (e) => {
    const frag = document.importNode(templates.signForm, true);
    rootEl.textContent = '';
    rootEl.appendChild(frag);
  });

  rootEl.textContent = '';
  rootEl.appendChild(frag);
};

// 로그인 폼이 나타나고, 로그인되는 함수
const drawLoginForm = async () => {
  const frag = document.importNode(templates.loginForm, true);
  const formEl = frag.querySelector('.login-form');

  // 전송버튼을 누르면
  formEl.addEventListener('submit', async (e) => {
    console.log('haha');
    e.preventDefault();
    const username = e.target.elements.username.value;
    const password = e.target.elements.password.value;

    const res = await api.post('/users/login', {
      username,
      password,
    });

    localStorage.setItem('token', res.data.token);
    drawMainForm();
  });

  rootEl.textContent = '';
  rootEl.appendChild(frag);
};
// drawLoginForm();

// 상품 리스트 출력
const drawPostList = async () => {
  const frag = document.importNode(templates.postPage, true);
  rootEl.textContent = '';
  rootEl.appendChild(frag);
  loginBtn.addEventListener('click', async (e) => {
    // if (localStorage.getItem('token')) {
    // }
  });
};

// 로그인 함수

// HomePage에서 버튼을 누르면 조건에 맞는 상품이 보여지는 함수
const drawPostDetail = async () => {
  const frag = document.importNode(templates.postPage, true);
  const postList = frag.querySelector('.post-list');
  const btn = frag.querySelector('.post-list');
  oilsBtn.addEventListener('click', async (e) => {});
};

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
