import Pubsub from 'pubsub-js';

export default class TimelineApi{

    constructor(fotos){
        this.fotos = fotos;
    }

    static lista(urlPerfil){
        return (dispatch => {
            fetch(urlPerfil)
            .then(response => response.json())
            .then(fotos => {
                dispatch({type: 'LISTA', fotos});
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
                dispatch({type:'LIKE', fotoId, liker})
                
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
                dispatch({type: 'COMENTAR', fotoId, comentario});
                
            });
        });
        
    }

    subscribe(callback){
        Pubsub.subscribe('timeline', (topico, fotos) => {
            callback(fotos);
        });
    }

}