import React, { Component } from 'react';
import FotoItem from './FotoItem';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import TimelineApi from '../stores/TimelineApi';


export default class Timeline extends Component {

    constructor(props){
      super(props);
      this.state = {fotos:[]};
      this.login = this.props.login;
    }

    componentWillMount(){
        this.props.store.subscribe(() => {
            this.setState({fotos:this.props.store.getState()});
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
        
        this.props.store.dispatch(TimelineApi.lista(urlPerfil));
    }


    componentDidMount(){
        this.carregaFotos();
    } 
    componentWillReceiveProps(nextProps){
        this.login = nextProps.login;
        this.carregaFotos();
    }

    like(fotoId){
        this.props.store.dispatch(TimelineApi.like(fotoId));
    }

    comentar(fotoId, comentario){
        this.props.store.dispatch(TimelineApi.comentar(fotoId, comentario));
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