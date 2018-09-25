import React, { Component } from 'react';
import FotoItem from './FotoItem';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import TimelineApi from '../stores/TimelineApi';
import {connect} from 'react-redux'


class Timeline extends Component {

    constructor(props){
      super(props);
      this.login = this.props.login;
    }

    carregaFotos(){
        let urlPerfil;
        console.log(this.props.login)
        if(this.login === undefined) {
            urlPerfil = `https://instalura-api.herokuapp.com/api/fotos?X-AUTH-TOKEN=${localStorage.getItem('auth-token')}`;
        } else {
            urlPerfil = `https://instalura-api.herokuapp.com/api/public/fotos/${this.login}`;
        }
        this.props.lista(urlPerfil);
    }

    componentDidMount(){
        this.carregaFotos();
    } 
    componentWillReceiveProps(nextProps){
        if(nextProps.login !== this.login){          
          this.login = nextProps.login;
          this.carregaFotos();
        }
      }

    render(){
        return (
        <div className="fotos container">
            <ReactCSSTransitionGroup
                transitionName="timeline"
                transitionEnterTimeout={1000}
                transitionLeaveTimeout={1000}>

                {
                    this.props.fotos.map(foto => <FotoItem key={foto.id} foto={foto} like={this.props.like} comentar={this.props.comentar}/>)
                }  
                            
            </ReactCSSTransitionGroup>
                        
        </div>            
        );
    }
}

const mapStateToProps = state => {
    return {fotos: state.timeline};
}
const mapDispatchToProps = dispatch =>{
    return{
        like: fotoId => {
            dispatch(TimelineApi.like(fotoId));
        },
        comentar: (fotoId, comentario) => {
            dispatch(TimelineApi.comentar(fotoId, comentario));
        },
        lista: urlPerfil => {
            dispatch(TimelineApi.lista(urlPerfil));
        }
    }
}


const TimelineContainer = connect(mapStateToProps, mapDispatchToProps)(Timeline);

export default TimelineContainer; 