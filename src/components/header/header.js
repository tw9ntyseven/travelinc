import React from 'react'
import UserAcceptTag from '../user-accept-tag/user-accept-tag';
import './header.css'

const Header = () => {
    return (
        <div className='header'>
            <div className='header-block_links'>
                <div className="block_logo header-block_logo">TRAVEL INC<div className="plus">+</div></div>
                <div className='header-block_link'>Главная</div>
                <div className='header-block_link'>Блог</div>
                <div className='header-block_link'>Мой Профиль</div>
            </div>
            <div className='header-block_profile'>
                <div className='header_block_image'><img className='header_block_image-profile' src={require("../../assets/image 101.png")} /></div>
                <div className='flex-column'>
                    <div className='header_block_username'>Alexandr Ivanov</div>
                    <UserAcceptTag />
                </div>
            </div>
        </div>
    );
}

export default Header;