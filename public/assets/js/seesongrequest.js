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
    fetch('https://port-0-seounbss-backend-otjl2cli677tyd.sel4.cloudtype.app/view-request')
    .then(response => response.json())
    .then(data => {
        console.log(data);
        if (data.length === 0) {
            // No requested songs
            createSongLabel('No songs have been requested.');
        } else {
            // Display requested songs
            const list = document.createElement('ul');
            list.className = 'songList';
    
            data.forEach(song => {
                createSongLabel(`${song.songTitle} - ${song.singer}`);
            });
        }
    })
    .catch(error => {
        console.error('An error occurred while fetching requested songs:', error);
    });
}

const handleLoad = () => {
    if (!navigator.onLine) {
        console.log('network error!')
        alert('네트워크 연결을 확인해 주세요!')
        return;
    }
    getSongList();
}

window.addEventListener('load', handleLoad);
