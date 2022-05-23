import React from 'react'
import './users.css'

const Users = () => {
    return (
        <div className='users_wrapper'>
            <div className='users'>
                <div className='users_header'>
                    <div className='title'><span style={{marginRight: '7px'}} class="material-symbols-outlined">group</span>Пользователи</div>
                    <div className='flex'>
                        <div className='users_filter'>
                            Фильтры
                            <div className='filter_counter'>0</div>
                            <span class="material-symbols-outlined">tune</span>
                        </div>
                        <div className='table_input input'>
                            <input className='input_text' placeholder='Поиск по имени, номеру или эл...' />
                            <span class="material-symbols-outlined">search</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Users;