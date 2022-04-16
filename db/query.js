const pool = require('./../config/conexion')

const newUser = async (payload, foto) => {

    try {

        const newSkater = queryPayload(payload, foto)
        const data = Object.values(newSkater)

        const querySql = {
            text: `INSERT INTO skaters (email, nombre, password, anos_experiencia, especialidad, foto, estado) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING*;`,
            values: data
        }

        const results = await pool.query(querySql)
        return results.rows[0]

    } catch (err) {
        console.log(`estoy en este error: ${err.code}`);
        console.log(`estoy en este error: ${err.message}`);
        if (err.code == 23505) {
            return { message: 'Mail ya en uso' }
        } else { return err.message }
    }

}


const queryPayload = (payload, foto) => {

    user = {
        email: payload.correo,
        nombre: payload.nombre,
        password: payload.password,
        experiencia: parseInt(payload.experiencia),
        especialidad: payload.especialidad,
        foto: foto,
        estado: false
    }

    return user
    
}

const getSkaters = async () => {
    try {

        const results = await pool.query(
            ` SELECT * FROM skaters`
        )

        return results.rows


    } catch (err) {
        console.log(err.code);
        console.log(err.message);
        return err;
    }
}

const skatersData = async () =>{
    try {

        const results = await pool.query(
            ` SELECT * FROM skaters`
        )

        return results.rows


    } catch (err) {
        console.log(err.code);
        console.log(err.message);
        return err;
    }
}

const foundSkater = async (payload) => {
    const skaters = await skatersData()
    const skaterFound = skaters.find(e => e.email == payload.email)
    const idSkater = skaterFound.id
    return idSkater
}

const editSkater = async (payload) => {
    try {
        const id = await foundSkater(payload)
        const data = {
            email: payload.email,
            nombre: payload.nombre,
            password: payload.password,
            experiencia: parseInt(payload.experiencia),
            especialidad: payload.especialidad
        }
        const result = await pool.query(
            `UPDATE skaters SET
            email = '${data.email}',
            nombre = '${data.nombre}',
            password = '${data.password}',
            anos_experiencia = ${data.experiencia},
            especialidad = '${data.especialidad}'
            WHERE id = ${id} RETURNING*;`
        )
        return result.rows
    } catch (err) {
        console.log(err.code);
        console.log(err.message);
        return err;
    }
}

const deleteSkater = async (payload) =>{

    try {
        const id = await foundSkater(payload)
        const result = await pool.query(
            ` DELETE FROM skaters WHERE id = ${id}`
        )
        return result.rowCount
    } catch (err) {
        console.log(err.code);
        console.log(err.message);
        return err;
    }
}

const setUserStatus = async (estado, id) =>{
    const result = await pool.query(
        `UPDATE skaters set estado = ${estado} WHERE id = ${id} RETURNING*`
    )
    return result.rows[0]
}



module.exports = { newUser, getSkaters, editSkater, deleteSkater, setUserStatus }