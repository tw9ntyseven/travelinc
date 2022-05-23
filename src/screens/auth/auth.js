import React from 'react'
import './auth.css';

const Auth = () => {
    return (
        <div className="wrapper_auth">
        <div className="block">
            <div className="block_logo">TRAVEL INC<div className="plus">+</div></div>
            <div className="block_auth">
                <div className="block_title">Войти</div>
                <div className="block_inputs">
                    <input style={{marginBottom: "15px"}} placeholder="Логин" className="input" type="text" />
                    <input className="input" placeholder="Пароль" type="password" />
                </div>
                <div className="block_btn">Войти</div>
            </div>
        </div>
    </div>
    );
}

export default Auth;