import { session_set, session_get, session_check } from './session.js';
import { encrypt_text, decrypt_text } from './crypto.js';
import { generateJWT, checkAuth } from './jwt_token.js';

function init(){ // 로그인 폼에 쿠키에서 가져온 아이디 입력
    const emailInput = document.getElementById('typeEmailX');
    const idsave_check = document.getElementById('idSaveCheck');

    let get_id = getCookie("id");

    if(get_id) {
        emailInput.value = get_id;
        idsave_check.checked = true;
    }

    session_check(); // 세션 유무 검사
}

document.addEventListener('DOMContentLoaded', () => {
    init(); 
})


function init_logined(){
    if(sessionStorage){
        decrypt_text(); // 복호화 함수
    }
    else{
        alert("세션 스토리지 지원 x");
    }
}

const check_xss = (input) => {
    // DOMPurify 라이브러리 로드 (CDN 사용)
    const DOMPurify = window.DOMPurify;
    // 입력 값을 DOMPurify로 sanitize
    const sanitizedInput = DOMPurify.sanitize(input);
    // Sanitized된 값과 원본 입력 값 비교
    if (sanitizedInput !== input) {
    // XSS 공격 가능성 발견 시 에러 처리
    alert('XSS 공격 가능성이 있는 입력값을 발견했습니다.');
    return false;
    }
    // Sanitized된 값 반환
    return sanitizedInput;
};

function setCookie(name, value, expiredays) {
    var date = new Date();
    date.setDate(date.getDate() + expiredays);
    document.cookie = escape(name) + "=" + escape(value) + "; expires=" + date.toUTCString() + "; path=/" + ";SameSite=None; Secure";
}

function getCookie(name) {
    var cookie = document.cookie;
    console.log("쿠키를 요청합니다.");

    if (cookie != "") {
        var cookie_array = cookie.split("; ");
        for ( var index in cookie_array) {
            var cookie_name = cookie_array[index].split("=");
            if (cookie_name[0] == "id") {
                return cookie_name[1];
            }
        }
    }
    return ;
}

const check_input = () => {
    const loginForm = document.getElementById('login_form');
    const loginBtn = document.getElementById('login_btn');
    const emailInput = document.getElementById('typeEmailX');
    const passwordInput = document.getElementById('typePasswordX');
    const c = '아이디, 패스워드를 체크합니다';
    alert(c);
    const emailValue = emailInput.value.trim();
    const passwordValue = passwordInput.value.trim();
    const sanitizedPassword = check_xss(passwordValue);
    // check_xss 함수로 비밀번호 Sanitize
    const sanitizedEmail = check_xss(emailValue);
    // check_xss 함수로 비밀번호 Sanitize
    const idsave_check = document.getElementById('idSaveCheck');
        const payload = {
        id: emailValue,
        exp: Math.floor(Date.now() / 1000) + 3600 // 1시간 (3600초)
    };
    const jwtToken = generateJWT(payload);
    
    if (emailValue.length < 5) {
        alert('아이디는 최소 5글자 이상 입력해야 합니다.');
        return false;
    }

    if (passwordValue.length < 12) {
        alert('비밀번호는 반드시 12글자 이상 입력해야 합니다.');
        return false;
    }

    const hasSpecialChar = passwordValue.match(/[!,@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/) !== null;

    if (!hasSpecialChar) {
        alert('패스워드는 특수문자를 1개 이상 포함해야 합니다.');
        return false;
    }

    const hasUpperCase = passwordValue.match(/[A-Z]+/) !== null;
    const hasLowerCase = passwordValue.match(/[a-z]+/) !== null;

    if (!hasUpperCase || !hasLowerCase) {
        alert('패스워드는 대소문자를 1개 이상 포함해야 합니다.');
        return false;
    }

    if (!sanitizedEmail) {
        // Sanitize된 비밀번호 사용
        return false;
        }
    if (!sanitizedPassword) {
        // Sanitize된 비밀번호 사용
        return false;
        }  
        
    if(idsave_check.checked == true) {
        alert("쿠키를 저장합니다.", emailValue);
        setCookie("id", emailValue, 1); 
        alert("쿠키 값 :" + emailValue);
    }
    
    else{ // 아이디 체크 x
        setCookie("id", emailValue.value, 0); //날짜를 0 - 쿠키 삭제
    }
        
    console.log('이메일:', emailValue);
    console.log('비밀번호:', passwordValue);
    session_set(); // 세션 생성
    localStorage.setItem('jwt_token', jwtToken);
    loginForm.submit();
};

function login_failed() {
    // 현재 로그인 실패 횟수를 쿠키에서 가져오기
    let failCount = 0;
    const cookies = document.cookie.split("; ");
    for (let i = 0; i < cookies.length; i++) {
        const [name, value] = cookies[i].split("=");
        if (name === "login_fail") {
            failCount = parseInt(decodeURIComponent(value)) || 0;
            break;
        }
    }

    // 실패 횟수 1 증가
    failCount++;
    // 쿠키에 실패 횟수 저장 (1일간 유지)
    setCookie("login_fail", failCount, 1);

    // 화면에 실패 횟수 및 제한 상태를 표시할 요소 찾기(없으면 생성)
    let infoElem = document.getElementById("login_info");
    if (!infoElem) {
        infoElem = document.createElement("div");
        infoElem.id = "login_info";
        infoElem.style.color = "red";
        // 로그인 폼 바로 위에 삽입
        const loginForm = document.getElementById("login_form");
        loginForm.parentNode.insertBefore(infoElem, loginForm);
    }

    // 실패 횟수가 3회 이상이면 로그인 제한
    if (failCount >= 3) {
        // 로그인 버튼 비활성화
        const loginBtn = document.getElementById("login_btn");
        loginBtn.disabled = true;

        infoElem.innerText = `로그인 실패 횟수: ${failCount}회. 3회 이상으로 로그인 제한되었습니다.`;
    } else {
        infoElem.innerText = `로그인 실패 횟수: ${failCount}회.`;
    }
}

    
document.getElementById("login_btn").addEventListener('click', check_input);