const url = 'http://localhost:8080'

const getData = async () => {

    try {
        const respuesta = await fetch(url + '/skaters')

        if (respuesta.status === 200) {
            const datos = await respuesta.json()
            console.log(datos);

            let tbody = document.querySelector('#cuerpo')

            tbody.innerHTML = ''

            datos.forEach((e, i) => {
                if(e.estado == true){
                    e.estado = 'Aprobado'
                }else{
                    e.estado = 'En revisón'
                }
                tbody.innerHTML += `
                
                <tr>
                    <td>${i + 1}</td>
                    <td class="imagen_skater" style="background-image:url('/assets/img/${e.foto}');"></td>
                    <td>${e.nombre}</td>
                    <td>${e.anos_experiencia}</td>
                    <td>${e.especialidad}</td>
                    <td>${e.estado}</td>
                </tr>
                `
            })
        }

    } catch (err) {
        console.log(err);
    }

 

}



getData();