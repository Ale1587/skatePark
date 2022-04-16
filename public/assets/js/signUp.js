const form = document.querySelector('#form-register')
const inputs = document.querySelectorAll('#form-register input')
const photoForm = document.querySelector('#foto')
const url = 'http://localhost:8080'


const expresiones = {
    numeros: /^[0-9]+$/, // solo números
    usuario: /^[a-zA-Z\_\-]{1,40}$/, // Letras, pueden llevar acentos, guion y guion_bajo.
    texto: /^[a-zA-ZÀ-ÿ\s]{1,40}$/, // Letras y espacios, pueden llevar acentos.
    password: /^.{4,12}$/, // 4 a 12 digitos.
    correo: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
}


const validationForm = (e) => {

    switch (e.target.name) {
        case 'nombre':
            validationInput(expresiones.usuario, e.target, e.target.name)
            break;
        case 'correo':
            validationInput(expresiones.correo, e.target, e.target.name)
            break;
        case 'password':
            validationInput(expresiones.password, e.target, e.target.name)
            validationPassword2()
            break;
        case 'password2':
            validationPassword2()
            break;
        case 'experiencia':
            validationInput(expresiones.numeros, e.target, e.target.name)
            break;
        case 'especialidad':
            validationInput(expresiones.texto, e.target, e.target.name)
            break;
    }

}
const validationInput = (expresion, input, campo) => {
    if (expresion.test(input.value)) {
        document.querySelector(`#grupo__${campo}`).classList.remove('formulario__grupo-incorrecto')
        document.querySelector(`#grupo__${campo}`).classList.add('formulario__grupo-correcto')
        document.querySelector(`#grupo__${campo} i`).classList.remove('fa-times-circle')
        document.querySelector(`#grupo__${campo} i`).classList.add('fa-check-circle')
        document.querySelector(`#grupo__${campo} .formulario__input-error`).classList.remove('formulario__input-error-activo')
    } else {
        document.querySelector(`#grupo__${campo}`).classList.add('formulario__grupo-incorrecto')
        document.querySelector(`#grupo__${campo}`).classList.remove('formulario__grupo-correcto')
        document.querySelector(`#grupo__${campo} i`).classList.add('fa-times-circle')
        document.querySelector(`#grupo__${campo} i`).classList.remove('fa-check-circle')
        document.querySelector(`#grupo__${campo} .formulario__input-error`).classList.add('formulario__input-error-activo')
    }
}


const validationPassword2 = () => {
    const inputPassword = document.querySelector('#password').value // ojo acá hay que acceder al value
    const inputPassword2 = document.querySelector('#password2').value

    if (inputPassword !== inputPassword2) {
        document.querySelector(`#grupo__password2`).classList.add('formulario__grupo-incorrecto')
        document.querySelector(`#grupo__password2`).classList.remove('formulario__grupo-correcto')
        document.querySelector(`#grupo__password2 i`).classList.add('fa-times-circle')
        document.querySelector(`#grupo__password2 i`).classList.remove('fa-check-circle')
        document.querySelector(`#grupo__password2 .formulario__input-error`).classList.add('formulario__input-error-activo')
    } else {
        document.querySelector(`#grupo__password2`).classList.remove('formulario__grupo-incorrecto')
        document.querySelector(`#grupo__password2`).classList.add('formulario__grupo-correcto')
        document.querySelector(`#grupo__password2 i`).classList.remove('fa-times-circle')
        document.querySelector(`#grupo__password2 i`).classList.add('fa-check-circle')
        document.querySelector(`#grupo__password2 .formulario__input-error`).classList.remove('formulario__input-error-activo')
    }
}

const validationPhoto = (e) => {
    const foto = e.target.value

    const extension = foto.substring(foto.lastIndexOf('.'), foto.length)
    console.log('extension:' + extension);


    if (document.querySelector('#foto').getAttribute('accept').split(',').indexOf(extension) < 0) {
        alert('Archivo inválido. No se permite la extensión ' + extension);
    }

}

inputs.forEach((input) => {
    input.addEventListener('keyup', validationForm)
    input.addEventListener('blur', validationForm)
})

photoForm.addEventListener('change', validationPhoto)

form.addEventListener('submit', (e) => {
        e.preventDefault()
    const payload = new FormData(form)
    payload.delete('password2')


     callApi(payload)
     
    
})


const callApi = async (payload) => {

    try {

        const response = await fetch(url + '/skaters', {
            method: 'POST',
            body: payload
        })
        const a = await response.json()
        console.log(a);
        location.href = `${url}/signin`
        return a


    } catch (err) {
        alert(`Ha ocucrrido un error... ${err.message}`)
    }
}
