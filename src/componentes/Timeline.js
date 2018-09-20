import React, { Component } from 'react';
import FotoItem from './FotoItem';
import Pubsub from 'pubsub-js';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'; 

export default class Timeline extends Component {

    constructor(props){
      super(props);
      this.state = {fotos:[]};
      this.login = this.props.login;
    }

    componentWillMount(){
        Pubsub.subscribe('timeline', (topico, fotos) => {
            this.setState({fotos});
        });

        Pubsub.subscribe('atualiza-liker', (topico, infoLiker) => {
            const fotoLikeada = this.state.fotos.find(foto => foto.id === infoLiker.fotoId);
            fotoLikeada.likeada = !fotoLikeada.likeada;
            const possivelLiker = fotoLikeada.likers.find(liker => liker.login === infoLiker.liker.login);
            if(possivelLiker === undefined){
                fotoLikeada.likers.push(infoLiker.liker);
            }else{
                let novosLikers = fotoLikeada.likers.filter(liker => liker.login !== infoLiker.liker.login);
                fotoLikeada.likers = novosLikers;
            }
            this.setState({fotos:this.state.fotos});
            
        });

        Pubsub.subscribe('atualiza-comentario', (topico, infoComentario) => {
            const fotoLikeada = this.state.fotos.find(foto => foto.id === infoComentario.fotoId);
            
            fotoLikeada.comentarios.push(infoComentario.comentario);
            this.setState({fotos: this.state.fotos});

        });

    }

    carregaFotos(){
        let urlPerfil;
        console.log(this.props.login)
        if(this.login === undefined) {
            urlPerfil = `https://instalura-api.herokuapp.com/api/fotos?X-AUTH-TOKEN=${localStorage.getItem('auth-token')}`;
        } else {
            urlPerfil = `https://instalura-api.herokuapp.com/api/public/fotos/${this.login}`;
        }
    
        fetch(urlPerfil)
        .then(response => response.json())
        .then(fotos => {
         this.setState({fotos:fotos});
       });
    }

    componentDidMount(){
        this.carregaFotos();
    } 
    componentWillReceiveProps(nextProps){
        console.log('cheguei no props');
        this.login = nextProps.login;
        this.carregaFotos();
    }

    like(fotoId){
        fetch(`https://instalura-api.herokuapp.com/api/fotos/${fotoId}/like?X-AUTH-TOKEN=${localStorage.getItem('auth-token')}`,{method:'POST'})
        .then(response => {
            if(response.ok){
                return response.json();
            }
        })
        .then(liker => {
            Pubsub.publish('atualiza-liker', {fotoId, liker});
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
          Pubsub.publish('atualiza-comentario', {fotoId:fotoId, comentario});
        });
    }

    render(){
        return (
        <div className="fotos container">
            <ReactCSSTransitionGroup
                transitionName="timeline"
                transitionEnterTimeout={1000}
                transitionLeaveTimeout={1000}>

                {
                    this.state.fotos.map(foto => <FotoItem key={foto.id} foto={foto} like={this.like} comentar={this.comentar}/>)
                }  
                            
            </ReactCSSTransitionGroup>
                        
        </div>            
        );
    }
}