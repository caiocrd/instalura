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

    render(){
        return (
        <div className="fotos container">
            <ReactCSSTransitionGroup
                transitionName="timeline"
                transitionEnterTimeout={1000}
                transitionLeaveTimeout={1000}>

                {
                    this.state.fotos.map(foto => <FotoItem key={foto.id} foto={foto}/>)
                }  
                            
            </ReactCSSTransitionGroup>
                        
        </div>            
        );
    }
}