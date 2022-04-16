
const form = document.querySelector('#form')
const url = 'http://localhost:8080'
const storageToken = 'jwt-token'
const label = document.querySelector('#error')

// función fecth

const getJwt = async (payload) => {
    // 4. envío de datos 
    try {
        const response = await fetch(url + '/signin', {
            method: 'POST',
            body: payload
        })
        // 5. recepción de respuesta 
        const token  = await response.json()
        localStorage.setItem(storageToken, token)
        window.location.href = `${url}/dashboard`
        return token

    } catch (err) {
        alert('Error: ' + err.message)
    }
}

const submitHandler = (e) => {
    // 1. prevenir el comportamiento por defecto
    e.preventDefault()

    // 2. capturar los datos ingresados por el usuario
    const payload = new FormData(form)

    // 3. envío los datos con fetch/post
    getJwt(payload)

    // 4. agregar el token el storage

    

}

// escuchar el evento del form
form.addEventListener('submit', submitHandler)
