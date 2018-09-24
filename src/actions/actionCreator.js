export function listagem(fotos){
    return {type: 'LISTA', fotos}
}

export function like(fotoId, liker){
    return {type:'LIKE', fotoId, liker}
}

export function comentar(fotoId, comentario){
    return {type: 'COMENTAR', fotoId, comentario}
}
