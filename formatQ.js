const fs = require('fs')
const iconvlite = require('iconv-lite')
const path = require('path')

//const carpeta = 'C:/Users/lapena/Documents/Luis Angel/Intelisis/Intelisis3100/Reportes MAVI/'
const nuevaCarpeta= 'ArchivosNEW/'
const carpeta= 'Archivos/'
const recodificacion = 'Latin1'

function crearExpresion (arreglo, posicion) {
    let regEx = arreglo[posicion].replace(/(\(\n|#\,\.##\n|\n)/g, '\\n').replace(/\s(?!\\n)/g, '\\s').replace(/\*/g, '\\*').replace(/\+/g, '\\+').replace(/\(/g, '\\(').replace(/\)/g, '\\)').replace(/\[/g, '\\[').replace(/\]/g, '\\]').replace(/\{/g, '\\{').replace(/\}/g, '\\}').replace(/\\n\\n/g, '\\n').replace(/\./g, '\\.')
    return new RegExp(`${regEx}`, `gi`)
}

function transformar (texto) {
    texto = texto + '\n['
    texto =  texto.replace(/;.*/g, '')
    texto = texto.replace(/((?=[\ \t])|^\s+|$)+/mg, '')
    
     
    let obj = texto.match(/(?<=\[.*\])[^~]*?(?=\[(?!\]))/g)
    for (key in obj) {
       
        let expresion = crearExpresion(obj, key)
        let remplazo = obj[key].replace(/^(?=\w)/gm, '\t')
        texto = texto.replace(expresion, remplazo)
        // let clsContinue = obj[key].replace(/<CONTINUA>[^~]*?<CONTINUA>/g, '')
        // texto = texto.replace(expresion, clsContinue)
        // let clsBR = obj[key].replace(/<BR>/g, '\n')
        // texto = texto.replace(expresion, clsBR)
    }
   
    return texto
}

function recodificar(archivo, recodificacion) {
    return iconvlite.decode(fs.readFileSync(archivo), recodificacion)
}

function remplazarTexto (archivo, texto) {
   
    texto = texto.replace(/\[/g, ' \n[')
    fs.writeFile(nuevaCarpeta+archivo.replace(/.*(\/|\\)/, ''), texto.replace(/\[(?=$)|\[(?=\n)/g, ''), function (err) {
        if (err) {
            return console.log(err)
        }
        console.log('Archivo : ' + archivo.replace(/.*(\/|\\)/, ''))
    })
}

function filtrarExtension (archivos) {
    return archivos.filter(archivo => /\.vis|\.frm|\.esp|\.tbl|\.rep|\.dlg$/i.test(archivo))
}

function comprobar (carpeta, archivos) {
    contador = 0
    filtrarExtension(archivos).map(function(archivo) {
        return path.join(carpeta, archivo)
    }).filter(function(archivo) {
        console.log('Filtrando contenido del archivo No. ' + contador++ + ' archivo: ' + archivo.replace(/.*(\/|\\)/, ''))
        return fs.statSync(archivo).isFile()
    }).forEach(function(archivo) {
        remplazarTexto(archivo, transformar(recodificar(archivo, recodificacion)))
    })
}

fs.readdir(carpeta, function(error, archivos) {
    if (error) throw error
    console.log('Cargando espera...')
    comprobar(carpeta, archivos)
})