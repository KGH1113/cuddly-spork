// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-analytics.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDQQoIH6vzenSsJ0Ed_ZJNf3OWuuy5WIBk",
    authDomain: "seounbs-songrequest.firebaseapp.com",
    databaseURL: "https://seounbs-songrequest-default-rtdb.firebaseio.com",
    projectId: "seounbs-songrequest",
    storageBucket: "seounbs-songrequest.appspot.com",
    messagingSenderId: "420727992792",
    appId: "1:420727992792:web:7c21a7b390df30088702ad",
    measurementId: "G-5E8XMFQY83"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

const today = new Date();
let date;
if (today.getMonth()[0] != '0') {
    date = today.getFullYear() + '_' + '0'+(today.getMonth() + 1) + '_' + today.getDate();
} else {
    date = today.getFullYear() + '_' + (today.getMonth() + 1) + '_' + today.getDate();
}
// const date = 'test';
const userData = {};
const songData = {};
const blacklistsData = {};

const songListItems = document.querySelector('.wraper');

const Toast = Swal.mixin({
    toast: true,
    position: 'bottom-right',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
});

const createSongLabel = (content) => {
    const li = document.createElement('li');
    li.setAttribute('class', 'song-label');
    li.addEventListener('click', (event) => {
        console.log('copied!');
        navigator.clipboard.writeText(content);
        Toast.fire({
            icon: 'success',
            title: '복사되었습니다.'
        });
    });
    li.innerHTML = content;
    songListItems.appendChild(li);
}

const getSongList = () => {
    db.collection(date).get().then(querySnapShot => {
        querySnapShot.forEach(doc => {
            const data = Object.values(doc.data())[0];

            userData[data.schoolNumber] = data.userName; songData[data.songName] = data.artistName;
            createSongLabel(`${data.songName} - ${data.artistName}`);
            console.log(userData, songData);
        });
    });
}

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

const handleLoad = () => {
    if (!navigator.onLine) {
        console.log('network error!')
        alert('네트워크 연결을 확인해 주세요!')
        return;
    }
    getBlacklist();
    getSongList();
}

window.addEventListener('load', handleLoad);
