import { encrypt_text, decrypt_text } from './crypto.js';

export function session_set() { //세션 저장
    let session_id = document.querySelector("#typeEmailX");
    let session_pass = document.querySelector("#typePasswordX"); // DOM 트리에서 pass 검색
    let random = new Date(); // 랜덤 타임스탬프

    if (sessionStorage) {
        const objString = JSON.stringify(obj); // 객체 -> JSON 문자열 변환
        let en_text = encrypt_text(objString); // 암호화

        sessionStorage.setItem("Session_Storage_test", session_id.value);
        sessionStorage.setItem("Session_Storage_object", objString);
        sessionStorage.setItem("Session_Storage_pass", en_text);
    } 
    else {
        alert("세션 스토리지 지원 x");
    }
}

export function session_set2(obj) { //세션 저장
    let session_id = document.querySelector("#typeEmailX");
    let session_pass = document.querySelector("#typePasswordX"); // DOM 트리에서 pass 검색
    let random = new Date(); // 랜덤 타임스탬프

    if (sessionStorage) {
        const objString = JSON.stringify(obj); // 객체 -> JSON 문자열 변환
        let en_text = encrypt_text(objString); // 암호화

        sessionStorage.setItem("Session_Storage_test", session_id.value);
        sessionStorage.setItem("Session_Storage_object", objString);
        sessionStorage.setItem("Session_Storage_pass", en_text);
    } 
    else {
        alert("세션 스토리지 지원 x");
    }
}

export function session_get() { //세션 읽기
    if (sessionStorage) {
        return sessionStorage.getItem("Session_Storage_pass");
    }
    else {
        alert("세션 스토리지 지원 x");
    }
}

export function session_check() { //세션 검사
    if (sessionStorage.getItem("Session_Storage_id")) {
        alert("이미 로그인 되었습니다.");
        location.href='../LOGIN/login.html'; // 로그인된 페이지로 이동
    }
}

function session_del() {//세션 삭제
    if (sessionStorage) {
    sessionStorage.removeItem("Session_Storage_test");
    alert('로그아웃 버튼 클릭 확인 : 세션 스토리지를 삭제합니다.');
    } 
    else {
        alert("세션 스토리지 지원 x");
    }
}