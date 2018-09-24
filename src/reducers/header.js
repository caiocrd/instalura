//Funcao redutora
//Deve atualziar o estado da store para que as views escritas nela possa atualziar seus dados
//Essa função tem somente o estado das da mensagem de aviso no header

export function notifica(state='', action){
    if(action.type === 'NOTIFICAR'){  
        console.log(action.mensagem)
        return action.mensagem;
    }
    return state;
}