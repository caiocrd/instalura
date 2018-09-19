import React, { Component } from 'react';
import {Link} from 'react-router';
import PubSub from 'pubsub-js'

class FotoAtualizacoes extends Component {

  constructor(props){
    super(props);
    this.state = {fotoLikeada: this.props.foto.likeada};
  }

  like(event){
    event.preventDefault();
    fetch(`https://instalura-api.herokuapp.com/api/fotos/${this.props.foto.id}/like?X-AUTH-TOKEN=${localStorage.getItem('auth-token')}`,{method:'POST'})
    .then(response => {
      if(response.ok){
        return response.json();
      }
    })
    .then(liker => {
      
      this.setState({fotoLikeada:!this.state.fotoLikeada});
      PubSub.publish('atualiza-liker', {fotoId:this.props.foto.id, liker});
    });
  }

  comentar(event){
    event.preventDefault();
    console.log(this.comentario.value);
    const requestInfo = {
      method:'POST',
      body:JSON.stringify({texto:this.comentario.value}),
      headers:new Headers({
          'Content-type' : 'application/json' 
      })
    };
    fetch(`https://instalura-api.herokuapp.com/api/fotos/${this.props.foto.id}/comment?X-AUTH-TOKEN=${localStorage.getItem('auth-token')}`,requestInfo)
    .then(response => {
      if(response.ok){
        return response.json();
      }
    })
    .then(comentario => {
      PubSub.publish('atualiza-comentario', {fotoId:this.props.foto.id, comentario});
    });
  }

  render(){

      return (
          <section className="fotoAtualizacoes">
            <a onClick={this.like.bind(this)} className={this.state.fotoLikeada ? 'fotoAtualizacoes-like-ativo': 'fotoAtualizacoes-like'}>Likar</a>
            <form className="fotoAtualizacoes-form" onSubmit={this.comentar.bind(this)}>
              <input type="text" placeholder="Adicione um comentário..." className="fotoAtualizacoes-form-campo" ref={(input) => this.comentario = input}/>
              <input type="submit" value="Comentar!" className="fotoAtualizacoes-form-submit"/>
            </form>

          </section>            
      );
  }
}

class FotoInfo extends Component {
  constructor(props){
    super(props);
    this.state = {likers: this.props.foto.likers, comentarios: this.props.foto.comentarios};
  }

  componentWillMount(){
    PubSub.subscribe('atualiza-liker', (topico, infoLiker) => {
      if(infoLiker.fotoId === this.props.foto.id){
        const possivelLiker = this.state.likers.find(liker => liker.login === infoLiker.liker.login);
        if(possivelLiker === undefined){
          let novosLikers = this.state.likers.concat(infoLiker.liker);
          this.setState({likers: novosLikers});
        }else{
          let novosLikers = this.state.likers.filter(liker => liker.login !== infoLiker.liker.login);
          this.setState({likers: novosLikers});
        }
      }
      
    });

    PubSub.subscribe('atualiza-comentario', (topico, infoComentario) => {
      if(infoComentario.fotoId === this.props.foto.id){
          //console.log(infoComentario);
         let novosComentarios = this.state.comentarios.concat(infoComentario.comentario);
         this.setState({comentarios: novosComentarios});
      }
      
    });
  }

  render(){
      return (
          <div className="foto-info">
            <div className="foto-info-likes">
              {this.state.likers.map(liker => <Link to={`/timeline/${liker.login}`}>
                {liker.login}
              </Link>

              , )}
              
                curtiram

            </div>

            <p className="foto-info-legenda">
              <Link to={`/timeline/${this.props.foto.loginUsuario}`} className="foto-info-autor">{this.props.foto.loginUsuario} </Link>
              {this.props.foto.comentario}
            </p>

            <ul className="foto-info-comentarios">
              {this.state.comentarios.map(comentario => ( 
                <li className="comentario" key={comentario.id}>
                <Link to={`/timeline/${comentario.login}`} className="foto-info-autor">{comentario.login} </Link>
                {comentario.texto}
              </li>
              ))}

            </ul>
          </div>            
      );
    }
}

class FotoHeader extends Component {
    render(){
        return (
            <header className="foto-header">
              <figure className="foto-usuario">
                <img src={this.props.foto.urlPerfil} alt="foto do usuario"/>
                <figcaption className="foto-usuario">
                  <Link to={`/timeline/${this.props.foto.loginUsuario}`}>
                    {this.props.foto.loginUsuario}
                  </Link>  
                </figcaption>
              </figure>
              <time className="foto-data">{this.props.foto.horario}</time>
            </header>            
        );
    }
}

export default class FotoItem extends Component {
    render(){
        return (
          <div className="foto">
            <FotoHeader foto={this.props.foto}/>
            <img alt="foto" className="foto-src" src={this.props.foto.urlFoto}/>
            <FotoInfo foto={this.props.foto}/>
            <FotoAtualizacoes foto={this.props.foto}/>
          </div>            
        );
    }
}