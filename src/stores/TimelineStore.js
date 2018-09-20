import Pubsub from 'pubsub-js';

export default class TimelineStore{

    constructor(fotos){
        this.fotos = fotos;
    }

    lista(urlPerfil){
        fetch(urlPerfil)
        .then(response => response.json())
            .then(fotos => {
                this.fotos = fotos;
                Pubsub.publish('timeline', this.fotos);

       });
    }

    like(fotoId, liker){
        fetch(`https://instalura-api.herokuapp.com/api/fotos/${fotoId}/like?X-AUTH-TOKEN=${localStorage.getItem('auth-token')}`,{method:'POST'})
        .then(response => {
            if(response.ok){
                return response.json();
            }
        })
        .then(liker => {

            const fotoLikeada = this.fotos.find(foto => foto.id === fotoId);
            fotoLikeada.likeada = !fotoLikeada.likeada;
            const possivelLiker = fotoLikeada.likers.find(likerNovo => likerNovo.login === liker.login);
            if(possivelLiker === undefined){
                fotoLikeada.likers.push(liker);
            }else{
                let novosLikers = fotoLikeada.likers.filter(likerNovo => likerNovo.login !== liker.login);
                fotoLikeada.likers = novosLikers;
            }

            Pubsub.publish('timeline', this.fotos);
        });
    }

    comentar(fotoId, comentario){
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
            const fotoLikeada = this.fotos.find(foto => foto.id === fotoId);
            fotoLikeada.comentarios.push(comentario);
            Pubsub.publish('timeline', this.fotos);
          });
    }

    subscribe(callback){
        Pubsub.subscribe('timeline', (topico, fotos) => {
            callback(fotos);
        });
    }

}