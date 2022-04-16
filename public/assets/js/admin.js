const url = 'http://localhost:8080'

const changeStatus = async (id, e) =>{
    const auth = e.checked
    const payload = {
        estado: auth,
        id: id
    }

    try {

        const response = await fetch(url +'/skaters',{
            headers: {
                'content-type': 'application/json'
            },
            method: 'PUT',
            body: JSON.stringify(payload)
        })
        return response

        
        
    } catch (err) {
        console.log(err.message);
        console.log(err.code);
        alert(err)
    }

    alert(response ? 'Usuario Aprobado' : 'Usuario en Revisión')


}