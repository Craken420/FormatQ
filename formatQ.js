/*** Archivos ***/
const { leerCarpetaFiltrada } = require('./Utilerias/OperadoresArchivos/readDirOnlyFile')

/*** Operadores de archivos ***/
const pcrArchivos = require('./Utilerias/OperadoresArchivos/procesadorArchivos')
const recodificar = require('./Utilerias/Codificacion/contenidoRecodificado')

/*** Operadores de cadena ***/
const regEx  = require('./Utilerias/RegEx/jsonRgx')

const carpeta= 'Testing\\'

/***
 * Función que elimina los comentarios en linea intelisis, 
 * los saltos de linea vacio,
 * las tabulaciones y los espacios entre palabras mayor a uno.
 * A su vez agrega tabulacion al contenido de los componentes Intelisis
 * @param {} contenido a ser editado
 * @returns {} texto modificado con tabulador en contenido del componente
 ***/
const clsCodigoAddTab = texto => {
    texto = texto + '\n['
    texto = regEx.Borrar.clsTextoBasura(texto)
    texto = regEx.Agregar.addTabContenidoCmp(texto)
    texto = regEx.Borrar.clsIniCorcheteLineaVacia(texto)
    return texto
}

leerCarpetaFiltrada(carpeta, ['.vis','.frm','.esp','.tbl','.rep','.dlg'])
    .then(archivos => {
        archivos.forEach(archivo => {
             pcrArchivos.crearArchivo(
                archivo,
                clsCodigoAddTab(
                    recodificar.extraerContenidoRecodificado(archivo)
                )
            )
        })
    })
    .catch(e => console.error(e))