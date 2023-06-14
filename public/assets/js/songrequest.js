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

let isBlocked = 0;
let isSeventeen = false, isBTS = false, isIDLE = false;
let song_length;
const userData = {};
const songData = {};
const blacklistsData = {};
const seventeens = ['세븐틴', '세븐틴 17', '세븐틴17', 'seventeen', 'SVT', '17', 'BSS', '부석순', '호시'];
const BTS = ['BTS', '방탄', '방탄소년단', '비티에스', 'B TS', 'B T S', 'B TS', '방 탄'];
const IDLE = ['아이들', '여자아이들', '(여자)아이들', 'G-IDLE', '(G)-IDLE', 'IDLE'];

const submitBtn = document.querySelector('#submit-btn');

const getSongList = () => {
    db.collection(date).get().then(querySnapShot => {
        querySnapShot.forEach(doc => {
            const data = Object.values(doc.data())[0];
            
            userData[data.schoolNumber] = data.userName; songData[data.songName] = data.artistName;
            if (seventeens.includes(data.artistName)) {
                isSeventeen = true;
            }
            if (BTS.includes(data.artistName)) {
                isBTS = true;
            }
            if (IDLE.includes(data.artistName)) {
                isIDLE = true;
            }
        });
    });
    console.log(userData, songData);
}

const getBlacklist = () => {
    db.collection('blacklists').get().then((results) => {
        results.forEach((doc) => {
            const data = doc.data();
            let name; let school_number;
            for ([name, school_number] of Object.entries(data)) {
                blacklistsData[name] = school_number;
            }
        });
    });
}

const addSongToList = (songName, artistName, userName, schoolNumber) => {
    userData[schoolNumber] = userName; songData[songName] = artistName;
    db.collection(date).add({
        noneObj: {
            songName: songName,
            artistName: artistName,
            userName: userName,
            schoolNumber:schoolNumber
        }
    });
}

const alertInfo = (promptMessage) => {
    Swal.fire(
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
    const songName = document.getElementById('song-name').value;
    const artist = document.getElementById('artist').value;
    const userName = document.getElementById('user-name').value;
    const schoolNumber = document.getElementById('school-number').value;
    
    db.collection(date).get().then((results) => {
        song_length = results.size;
    }).then(() => {
        if (songName === '' || artist === '' || userName === '' || schoolNumber === '') {
            alertInfo('입력란에 빈 곳이 있습니다!')
            isBlocked = 1;
        }
        if (songName === '' || artist === '' || userName === '' || schoolNumber === '') {
            alertInfo('입력란에 빈 곳이 있습니다!')
            isBlocked = 1;
        } else {
            if (Object.keys(blacklistsData).includes(userName) || Object.values(blacklistsData).includes(schoolNumber)) {
                Swal.fire(
                    'Error!',
                    '블랙리스트에 등록되신 것 같습니다. 최근 신청 시 주의사항을 위반한 적이 있는지 확인해주세요.',
                    'error'
                );
                isBlocked = 1;
            }
            const dayOfWeek = today.getDay();
            if (song_length >= 10) {
                alertInfo("오늘 신청 개수를 초과했습니다.");
               isBlocked = 1;
            }
            if (dayOfWeek === 0 || dayOfWeek === 6) {
                 alertInfo('주말에는 신청을 받지 않습니다.');
                 isBlocked = 1;
            }
            if (Object.keys(userData).includes(schoolNumber)) {
                alertInfo('이미 신청하셨습니다.');
                isBlocked = 1;
            }
            if (Object.keys(songData).includes(songName)) {
                alertInfo('이미 신청된 노래입니다');
                isBlocked = 1;
            }
            console.log('isSeventeenRequested: ', isSeventeen);
            if (seventeens.map((artistName) => artistName.toUpperCase()).includes(artist.toUpperCase()) && isSeventeen) {
                alertInfo('동일한 가수의 신청곡이 있습니다.');
                isBlocked = 1;
            }
            console.log('isBTSRequested', isBTS);
            if (BTS.map((artistName) => {artistName.toLocaleUpperCase()}).includes(artist.toUpperCase()) && isBTS) {
                alertInfo('동일한 가수의 신청곡이 있습니다.');
                isBlocked = 1;
            }
            console.log('isIDLERequested', isIDLE);
            if (IDLE.map((artistName) => {artistName.toLocaleUpperCase()}).includes(artist.toUpperCase()) && isIDLE) {
                alertInfo('동일한 가수의 신청곡이 있습니다.');
                isBlocked = 1;
            }
            if (Object.values(songData).map((artistName) => artistName.toUpperCase()).includes(artist.toUpperCase())) {
                alertInfo('동일한 가수의 신청곡이 있습니다.');
                isBlocked = 1;
            }
        }
    }).then(() => {
        if (isBlocked != 1) {
            userData[schoolNumber] = userName;
            addSongToList(songName, artist, userName, schoolNumber);
            Swal.fire({
                icon: 'success',
                title: 'Thank you!',
                text: '노래가 신청되었습니다.!',
            }).then(() => {
                location.reload();
            });
        }
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

submitBtn.addEventListener('click', handleSubmit); // Add the Event to the Button.
window.addEventListener('load', handleLoad); // Add the Event when user load the page.
