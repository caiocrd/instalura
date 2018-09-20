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
        this.props.timelineStore.subscribe(fotos => {
            this.setState({fotos});
        })

    }

    carregaFotos(){
        let urlPerfil;
        console.log(this.props.login)
        if(this.login === undefined) {
            urlPerfil = `https://instalura-api.herokuapp.com/api/fotos?X-AUTH-TOKEN=${localStorage.getItem('auth-token')}`;
        } else {
            urlPerfil = `https://instalura-api.herokuapp.com/api/public/fotos/${this.login}`;
        }
    
        this.props.timelineStore.lista(urlPerfil);
    }


    componentDidMount(){
        this.carregaFotos();
    } 
    componentWillReceiveProps(nextProps){
        this.login = nextProps.login;
        this.carregaFotos();
    }

    like(fotoId){
       this.props.timelineStore.like(fotoId);
    }

    comentar(fotoId, comentario){
        this.props.timelineStore.comentar(fotoId, comentario);
    }

    render(){
        return (
        <div className="fotos container">
            <ReactCSSTransitionGroup
                transitionName="timeline"
                transitionEnterTimeout={1000}
                transitionLeaveTimeout={1000}>

                {
                    this.state.fotos.map(foto => <FotoItem key={foto.id} foto={foto} like={this.like.bind(this)} comentar={this.comentar.bind(this)}/>)
                }  
                            
            </ReactCSSTransitionGroup>
                        
        </div>            
        );
    }
}