import React from 'react'

export const TableCard = ({items}) => {
    return (
        <div className='table_cards'>
            {items.map((item, index) => (
                <div key={index} className='table_cards-item'>
                <div className="table_cards-item-block table_cards-item-block--wrapper">
                    <div className='dashboard_block-card-count table_cards-card-count flex'>{item.count}</div>
                    <div className='dashboard_block-card-description'>{item.description}</div>
                </div>
                    <img className='table_cards-card-img' src={require(`../../assets/dashboard-icons/${item.icon}.svg`)}/>
                </div>
            ))}
        </div>
    );
}