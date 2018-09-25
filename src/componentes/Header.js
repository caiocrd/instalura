import React, { Component } from 'react';
import TimelineApi from '../stores/TimelineApi';
import {connect} from 'react-redux'



class Header extends Component {

  pesquisa(event){
    event.preventDefault();
    this.props.pesquisa(this.loginPesquisado.value);
    
  }

  render(){
      return (
      <header className="header container">
        <h1 className="header-logo">
          Instalura
        </h1>

        <form className="header-busca" onSubmit={this.pesquisa.bind(this)}>
          <input type="text" name="search" placeholder="Pesquisa" className="header-busca-campo" ref={input => this.loginPesquisado = input}/>
          <input type="submit" value="Buscar" className="header-busca-submit"/>
        </form>
        <div>
          {this.props.msg}
        </div>

        <nav>
          <ul className="header-nav">
            <li className="header-nav-item">
              <a >
                ♡
                {/*                 ♥ */}
                {/* Quem deu like nas minhas fotos */}
              </a>
            </li>
          </ul>
        </nav>
      </header>            
      );
  }
}

const mapStateToPros = state => {
  return(
    {msg: state.notifica}
  );
}
const mapDispatchToProps = dispatch => {
  return(
    {
      pesquisa: loginPesquisado => {
        dispatch(TimelineApi.pesquisar(loginPesquisado))
      }

    }
  )
}

const HeaderContainer = connect(mapStateToPros, mapDispatchToProps)(Header);

export default HeaderContainer;