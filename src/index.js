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
    // document.querySelector('.login-btn').textContent = '';
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
const drawPostList = async (category) => {
  const frag = document.importNode(templates.postPage, true);
  const postListEl = frag.querySelector('.post-list');
  const materialCheckboxEls = frag.querySelectorAll('.material input[type="checkbox"]');
  const subjecCheckboxEls = frag.querySelectorAll('.subject input[type="checkbox"]');
  const shapeCheckboxEls = frag.querySelectorAll('.shape input[type="checkbox"]');
  const colorsCheckboxEls = frag.querySelectorAll('.colors input[type="checkbox"]');
  // 첫화면에 그려지게
  // ALL이 체크되어 있을때
  // 다른 checkbox 체크하면 ALL체크 풀리게
  // if(all이 checked면){전부출력}
  const params = {};
  if (category) {
    params.category = category;
  }
  const { data: postPage } = await api.get('/products', {
    params,
  });

  for (const { id, title, author, mainImgUrl } of postPage) {
    const frag = document.importNode(templates.postItem, true);
    const imgEl = frag.querySelector('.post-item-img');
    const titleEl = frag.querySelector('.post-item-title');
    const authorEl = frag.querySelector('.post-item-author');

    imgEl.setAttribute('src', mainImgUrl);
    titleEl.textContent = title;
    authorEl.textContent = author;

    imgEl.addEventListener('click', (e) => {
      drawPostDetail(id);
    });

    postListEl.appendChild(frag);
  }

  // 재료 체크 박스
  materialCheckboxEls.forEach((el) => {
    el.addEventListener('click', async (category) => {
      const params = {};
      if (category) {
        params.category = category;
      }
      const { data: postPage } = await api.get(`/products?category=${el.getAttribute('name')}`, {
        params,
      });

      for (const { id, title, author, mainImgUrl } of postPage) {
        const frag = document.importNode(templates.postItem, true);

        const imgEl = frag.querySelector('.post-item-img');
        const titleEl = frag.querySelector('.post-item-title');
        const authorEl = frag.querySelector('.post-item-author');

        imgEl.setAttribute('src', mainImgUrl);
        titleEl.textContent = title;
        authorEl.textContent = author;
        postListEl.textContent = '';
        postListEl.appendChild(frag);

        imgEl.addEventListener('click', (e) => {
          drawPostDetail(id);
        });
      }
      console.log(`products?category=${el.getAttribute('name')}`);
    });
  });

  // const {
  //   data: productList, // product 객체들을 담고있는 배열
  // } = await api.get('/products', {
  //   params: {
  //     category,
  //     subject,
  //     shape,
  //     colors,
  //   },
  // });

  // const subjectCheckboxEls = frag.querySelectorAll('.subject input');
  // subjectCheckboxEls.forEach((el) => {
  //   el.addEventListener('click', (e) => {
  //     console.log(`${e.target.getAttribute('name')}: ${e.target.checked}`);
  //   });
  // });

  rootEl.textContent = '';
  rootEl.appendChild(frag);
};

// 상세페이지
const drawPostDetail = async (itemId) => {
  const frag = document.importNode(templates.detailPage, true);
  const imgEl = frag.querySelector('.detail-page-img');
  const titleEl = frag.querySelector('.detail-page-title');
  const authorEl = frag.querySelector('.detail-page-author');
  const priceEl = frag.querySelector('.detail-page-price');
  const backEl = frag.querySelector('.back-btn');
  const orderEl = frag.querySelector('.order-btn');
  const cartEl = frag.querySelector('.cart-btn');

  const {
    data: { mainImgUrl, title, author, price },
  } = await api.get(`/products/${itemId}`, {
    params: {
      _embed: 'options',
    },
  });

  imgEl.setAttribute('src', mainImgUrl);
  titleEl.textContent = title;
  authorEl.textContent = author;
  priceEl.textContent = price;

  //뒤로가기
  backEl.addEventListener('click', (e) => {
    drawPostList();
  });

  //주문하기
  // orderEl.addEventListener('click', (e) => {
  //   drawMypage();
  // });

  // 장바구니
  cartEl.addEventListener('click', async () => {
    const frag = document.importNode(templates.cartItem, true);
    const imgEl = frag.querySelector('.cart-item-img');
    const titleEl = frag.querySelector('.cart-item-title');
    const priceEl = frag.querySelector('.cart-item-price');
    console.log(mainImgUrl);
    imgEl.setAttribute('src', mainImgUrl);
    // titleEl.textContent = title;
    // priceEl.textContent = price;

    // orderEl.addEventListener('click', async (e) => {
    //   const frag = document.importNode(templates.cartItem, true);
    //   const imgEl = frag.querySelector('.cart-item-img');
    //   const titleEl = frag.querySelector('.cart-item-title');
    //   const priceEl = frag.querySelector('.cart-item-price');

    //   const {
    //     data: { mainImgUrl, title, author, price },
    //   } = await api.get('/products', {
    //     params: {
    //       _embed: 'options',
    //     },
    //   });

    //   imgEl.setAttribute('src', mainImgUrl);
    //   titleEl.textContent = title;
    //   authorEl.textContent = author;

    //   // cartList.appendChild(frag);
    // });

    rootEl.textContent = '';
    rootEl.appendChild(frag);
  });

  rootEl.textContent = '';
  rootEl.appendChild(frag);
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
