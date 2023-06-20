const submitBtn = document.querySelector('#submit-btn');

const handleSubmit = (event) => {
    if (!navigator.onLine) {
        console.log('network error!')
        alert('네트워크 연결을 확인해 주세요!')
        return;
    }

    event.preventDefault();

    const songTitle = document.getElementById('song-name').value;
    const singer = document.getElementById('artist').value;
    const name = document.getElementById('user-name').value;
    const studentNumber = document.getElementById('school-number').value;

    // Create a request object
    const request = {
        name,
        studentNumber,
        songTitle,
        singer,
    };

    // Send the request to the server
    fetch('https://port-0-seounbss-backend-otjl2cli677tyd.sel4.cloudtype.app/song-request', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
    })
    .then(response => {
        if (response.ok) {
            // Request successful
            Swal.fire({
                icon: 'success',
                title: 'Thank you!',
                text: '노래가 신청되었습니다.!',
            })
            .then(() => {
                location.reload();
            });  
        } else {
            // Request failed
            response.json().then(data => {
                Swal.fire(
                    'Error!',
                    data.error,
                    'error'
                );
            });
        }
    })
    .catch(error => {
        Swal.fire(
            'Info!',
            'An error occurred while making the request.  ' + error,
            'info'
        );
        console.error(error);
    });
}

const handleLoad = () => {
    if (!navigator.onLine) {
        console.log('network error!')
        alert('네트워크 연결을 확인해 주세요!')
        return;
    }
}

submitBtn.addEventListener('click', handleSubmit); // Add the Event to the Button.
window.addEventListener('load', handleLoad); // Add the Event when user load the page.