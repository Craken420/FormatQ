/*** Archivos ***/
const leerCarpeta = require('./Utilerias/OperadoresArchivos/leerCarpeta')

/*** Operadores de archivos ***/
const filtro = require('./Utilerias/OperadoresArchivos/filtrarArchivos')
const pcrArchivos = require('./Utilerias/OperadoresArchivos/procesadorArchivos')
const recodificar = require('./Utilerias/Codificacion/contenidoRecodificado')

/*** Operadores de cadena ***/
const addTab = require('./Utilerias/OperarCadenas/clsBauraAddTabContenidoCmp')
const regEx  = require('./Utilerias/RegEx/jsonRgx')

const carpeta = 'Archivos\\'

leerCarpeta.obtenerArchivos(carpeta)
    .then(archivos => {
        filtro.filtrarExtension(archivos).forEach(archivo => {
             pcrArchivos.crearArchivo(
                'Testing\\'+ archivo.replace(regEx.expresiones.nomArchivoEnRuta, ''),
                addTab.clsCodigoAddTab(
                    recodificar.extraerContenidoRecodificado(archivo)
                )
            )
        })
    })
    .catch(e => console.error(e))