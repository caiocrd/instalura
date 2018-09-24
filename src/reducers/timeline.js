//Funcao redutora
//Deve atualziar o estado da store para que as views escritas nela possa atualziar seus dados
//Essa função tem somente o estado das fotos

export function timeline(state=[], action){
    if(action.type === 'LISTA'){  
        return action.fotos;
    }
    if(action.type === 'LIKE'){
        const fotoLikeada = state.find(foto => foto.id === action.fotoId);
        fotoLikeada.likeada = !fotoLikeada.likeada;
        const possivelLiker = fotoLikeada.likers.find(likerNovo => likerNovo.login === action.liker.login);
        if(possivelLiker === undefined){
            fotoLikeada.likers.push(action.liker);
        }else{
            let novosLikers = fotoLikeada.likers.filter(likerNovo => likerNovo.login !== action.liker.login);
            fotoLikeada.likers = novosLikers;
        }
        return state;
    }
    if(action.type === 'COMENTAR'){
        const fotoLikeada = state.find(foto => foto.id === action.fotoId);
        fotoLikeada.comentarios.push(action.comentario);
    }

    if(action.type === 'PESQUISA'){  
        return action.fotos;
    }
    return state;
    
}