const mysql = require('mysql')

const { database } = require('./keys')

const { promisify } = require('util')

const conexion = mysql.createPool(database);


conexion.getConnection((error, connection) => {
	if (error)
		console.log('Problemas de conexion con mysql', error.code)
	if(connection) connection.release()
	console.log("Conectado a la BD")
})

conexion.query = promisify(conexion.query)

module.exports = conexion