const form = document.querySelector('#formulario_datos_participante')
const inputs = document.querySelectorAll('#formulario_datos_participante input')
const storageToken = 'jwt-token'
const url = 'http://localhost:8080'
const token = localStorage.getItem(storageToken)
const btnActualizar = document.querySelector('#actualizar')
const btnEliminar = document.querySelector('#eliminar')
const datos = new FormData(form)

const changeInfoSkater = async (payload) => {
    // ruta fetch put para el cambio de información
    try {

        const response = await fetch(url + '/skater', {
            headers: {
                'content-type': 'application/json'
            },
            method: 'PUT',
            body: JSON.stringify(payload)
        })
        const changes = await response.json()
        localStorage.removeItem(storageToken)
        window.location.href = url
        return changes

    } catch (err) {
        alert(`Ha ocucrrido un error... ${err.message}`)
    }
}

const deleteCount = async (payload) =>{

    try {

        const response = await fetch(url + '/skater', {
            headers: {
                'content-type': 'application/json'
            },
            method: 'DELETE',
            body: JSON.stringify(payload)
        })
       
        localStorage.removeItem(storageToken)
        window.location.href = url
        return response
        
    } catch (err) {
        alert(`Ha ocucrrido un error... ${err.message}`)
        console.log(err.message);
        console.log(err.code);

    }
}


btnActualizar.addEventListener('click', (e) => {
    e.preventDefault()
    if (form.password.value === form.password2.value) {
        if (form.password.value.length > 3 || form.password.value.length > 13) {
            const payload = {
                email: form.correo.value,
                nombre: form.nombre.value,
                password: form.password.value,
                experiencia: form.experiencia.value,
                especialidad: form.especialidad.value
            }
            changeInfoSkater(payload)
        } else {
            alert('La contraseña tiene que ser de 4 a 12 dígitos')
        }

    } else {
        alert('Contraseñas no coinciden');
    }
})

btnEliminar.addEventListener('click', (e) => {
    e.preventDefault()
    const payload = {
                email: form.correo.value,
                nombre: form.nombre.value,
                password: form.password.value,
                experiencia: form.experiencia.value,
                especialidad: form.especialidad.value
            }
    deleteCount(payload)
})

const tokenValidation = async (data) => {
    try {
        const response = await fetch(url + '/validation', {
            headers: {
                'content-type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(data)
        })
        const infoback = await response.json()
        console.log(infoback);
        return infoback

    } catch (error) {
        alert('Error: ' + error.message)
        console.log(`error código ${error.code}: ${error.message}`)

    }
}

const tokenRecoverd = async () => {
    if (token) {
        const data = {
            token: token
        }
        const resApi = await tokenValidation(data)
        if (resApi.email) {
            form.correo.value = resApi.email
            form.nombre.value = resApi.nombre
            form.password.value = resApi.password
            form.password2.value = resApi.password
            form.experiencia.value = resApi.experiencia
            form.especialidad.value = resApi.especialidad
            localStorage.setItem(storageToken, resApi.token)
        }
    } else {
        localStorage.removeItem(storageToken)
        location.href = `${url}/signin`
        // console.log('pasó al else que debe borrar el token');
    }

}


tokenRecoverd()








