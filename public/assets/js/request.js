// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-analytics.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyA_iJrZIbWwPzAtWeP3HidzgQJwPRmZ_mY",
    authDomain: "seounbss.firebaseapp.com",
    projectId: "seounbss",
    storageBucket: "seounbss.appspot.com",
    messagingSenderId: "673321926585",
    appId: "1:673321926585:web:16402e692ddbc6e3c6c068",
    measurementId: "G-24YHBKSGYZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

let isBlocked = 0;
let song_length;
const userData = {};
const songData = {};
const blacklistsData = {};

const formBox = document.querySelector('.form-box')
const submitBtn = document.querySelector('#submit-btn');

const getBlacklist = () => {
    db.collection('blacklists').get().then((results) => {
        results.forEach((doc) => {
            const data = doc.data();
            let name;
            let school_number;
            for ([name, school_number] of Object.entries(data)) {
                blacklistsData[name] = school_number;
            }
        });
    });
}

const addContentToDB = (content, userName, schoolNumber) => {
    db.collection('request').doc('asdf').update({[userName + '__' + schoolNumber]: content });
}

const alertInfo = (promptMessage) => {
    new swal(
        'Info!',
        promptMessage,
        'info'
    );
}

const handleSubmit = (event) => {
    if (!navigator.onLine) {
        console.log('network error!')
        alert('네트워크 연결을 확인해 주세요!')
        return;
    }
    event.preventDefault();
    isBlocked = 0;
    const userName = document.getElementById('user-name').value;
    const schoolNumber = document.getElementById('school-number').value;
    const content = document.getElementById('request-content').value;

    if (content != '' || userName != '' || schoolNumber != '') {
        if (Object.keys(blacklistsData).includes(userName) || Object.values(blacklistsData).includes(schoolNumber)) {
            swal(
                'Error!',
                '블랙리스트에 등록되신 것 같습니다.',
                'error'
            );
            isBlocked = 1;
        }
    } else {
        alertInfo('입력란에 빈 곳이 있습니다!')
        isBlocked = 1;
    }

    if (isBlocked != 1) {
        userData[schoolNumber] = userName;
        console.log(content, userName, schoolNumber);
        addContentToDB(content, userName, schoolNumber);
        Swal.fire(
            'Thank you!',
            '노래가 신청되었습니다.!',
            'success'
        );
        formBox.reset();
    }
}

const handleLoad = () => {
    if (!navigator.onLine) {
        console.log('network error!')
        alert('네트워크 연결을 확인해 주세요!')
        return;
    }
    getBlacklist();
}

submitBtn.addEventListener('click', handleSubmit);
window.addEventListener('load', handleLoad);