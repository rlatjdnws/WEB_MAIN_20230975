document.getElementById("search_btn").addEventListener('click', search_message);

// function search_message(){
//     alert("검색을 수행합니다!");
// }

// const search_message_msg = () => {
//     const c = '검색을 수행합니다';
//     alert(c);
// };

const search_message = () => {
    const c = '검색을 수행합니다';
    alert(c);
};

// let search_message = () => {
//     const c = '검색을 수행합니다';
//     alert(c);
// };

function googleSearch() {
    const searchTerm = document.getElementById("search_input").value; // 검색어로 설정

    if (searchTerm.length === 0) {
        alert("검색어를 입력해주세요.");
        return false; // 검색어가 비어있으면 함수 종료
    }

    const badwords = ["바보", "멍청이", "바보멍청이"];

    for (let i = 0; i < badwords.length; i++) {
        if (searchTerm.includes(badwords[i])) {
            alert("검색어에 금지된 단어가 포함되어 있습니다.");
            return false; // 금지된 단어가 포함되어 있으면 함수 종료
        }
    }

    const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchTerm)}`;
    // 새 창에서 구글 검색을 수행
    window.open(googleSearchUrl, "_blank"); // 새로운 창에서 열기.
    return false;
}   