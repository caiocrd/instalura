import Pubsub from 'pubsub-js';
import {listagem, like, comentar, pesquisar, notificar} from '../actions/actionCreator'

export default class TimelineApi{

    constructor(fotos){
        this.fotos = fotos;
    }

    static lista(urlPerfil){
        return (dispatch => {
            fetch(urlPerfil)
            .then(response => response.json())
            .then(fotos => {
                dispatch(listagem(fotos));
                return fotos;
            })
        });
    }

    static like(fotoId, liker){
        return (dispatch => {
            fetch(`https://instalura-api.herokuapp.com/api/fotos/${fotoId}/like?X-AUTH-TOKEN=${localStorage.getItem('auth-token')}`,{method:'POST'})
            .then(response => {
                if(response.ok){
                    return response.json();
                }
            })
            .then(liker => {
                dispatch(like(fotoId, liker));
                return liker;
                
            });
        });
        
    }

    static comentar(fotoId, comentario){
        return (dispatch => {
            const requestInfo = {
                method:'POST',
                body:JSON.stringify({texto:comentario}),
                headers:new Headers({
                    'Content-type' : 'application/json' 
                })
            };
            fetch(`https://instalura-api.herokuapp.com/api/fotos/${fotoId}/comment?X-AUTH-TOKEN=${localStorage.getItem('auth-token')}`,requestInfo)
            .then(response => {
                if(response.ok){
                    return response.json();
                }
            })
            .then(comentario => {
                dispatch(comentar(fotoId, comentario));
                return comentario;
            });
        });
        
    }

    static pesquisar(login){
        return (dispatch => {
            
            fetch(`https://instalura-api.herokuapp.com/api/public/fotos/${login}`)
            .then(response => response.json())
            .then(fotos => {
                if(fotos.length === 0){
                    dispatch(notificar("Nenhuma foto encontrada"));
                }
                dispatch(listagem(fotos));
                return fotos;
            })
        });
    }
    

}