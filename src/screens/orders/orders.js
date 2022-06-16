import React, {useState, useEffect} from 'react'
import './orders.css'
import Filter, { FilterOrders } from '../../components/filter/filter';
import usePagination from "../../hooks/usePagination";
import { thousandSeparator } from '../dashboard/dashboard';
import { useSortableData } from '../users/users';
import { LoadingCards, LoadingSkeletonTableOrders } from '../../components/loading-skeleton/loading-skeleton';
import { TableCard } from '../../components/table/table';

const axios = require('axios').default;

const Orders = () => {
    const [result, setResult] = useState([]);
    const [resultStat, setResultStat] = useState([]);
    const [resultTotal, setResultTotal] = useState([]);
    const [showFilter, setShowFilter] = useState(false);
    const [loading, setLoading] = useState(true);
    const [loadingStats, setLoadingStats] = useState(true);

    useEffect(() => {
        getOrders();
        getOrdersStat();
    }, []);

    const getOrders = (page) => {
            axios({
                method: "POST",
                url: "https://easytake.org/custom.php",
                data: {
                    type: 'get_dashboard_orders_list',
                    per_page: 50,
                    page: page ? page : 1,
                
                },
                // filters: {
                //     region: "151",
                //     status: "paid",
                //     date: {
                //         "start_date": "2022-05-22",
                //         "end_date": "2022-05-27"
                //     }
                // },
                headers: {
                    "Content-Type": "multipart/form-data"
                }
                })
                .then(function (response) {
                    // setResultStat(response.data);
                    setResultTotal(response.data.total_bookings)
                    setResult(response.data.post);
                    setLoading(false);
                    console.log(response, "ORDERS");
                })
                .catch(function (response) {
                    console.log(response.err);
                });

    };

    const getOrdersStat = () => {
        axios({
            method: "POST",
            url: "https://easytake.org/custom.php",
            data: {
                type: 'get_dashboard_orders_list',
                per_page: 1,
                page: 1,
            },
            headers: {
                "Content-Type": "multipart/form-data"
            }
            })
            .then(function (response) {
                setResultStat(response.data);
                setLoadingStats(false);
                console.log(response.data, "ORDERS Stat");
            })
            .catch(function (response) {
                console.log(response.err);
            });

};

    const {items, requestSort, sortConfig} = useSortableData(result);

    const {
        firstContentIndex,
        lastContentIndex,
        nextPage,
        prevPage,
        page,
        setPage,
        totalPages
    } = usePagination({
        contentPerPage: 50,
        count: resultTotal
    });

    const pagino = (page) => {
        setLoading(true);
        getOrders(page);
    }

    return (
        <div className='orders_wrapper'>
        {loadingStats ? <LoadingCards /> : <TableCard items={[
                {
                    count: thousandSeparator(resultStat.total_bookings),
                    description: 'Количество заказов',
                    icon: 'PDocument'
                },
                {
                    count: thousandSeparator(resultStat.paid),
                    description: 'Оплаченные',
                    icon: 'Tick'
                },
                {
                    count: thousandSeparator(resultStat.canceled),
                    description: 'Отмененные',
                    icon: 'Close'
                },
                {
                    count: thousandSeparator(resultStat.reservation),
                    description: 'В ожидании',
                    icon: 'Clock'
                },
                // {
                //     count: thousandSeparator(dataStats.reservation),
                //     description: 'В ожидании',
                //     icon: 'Clock'
                // },
        ]} />}
            <div className='users'>
                <div className='users_header'>
                    <div className='title'>
                        <span
                            style={{
                            marginRight: '7px'
                        }}
                            className="material-symbols-outlined">file_copy</span>Заказы</div>
                    <div className='flex'>
                    <div className='flex-column'>
                        <div onClick={e => setShowFilter(!showFilter)} className='users_filter'>
                            Фильтры
                            <div className='filter_counter'>0</div>
                            <span className="material-symbols-outlined">tune</span>
                        </div>
                        <div>{showFilter ? <FilterOrders /> : null}</div>
                        </div>
                        <div className='table_input input'>
                            <input className='input_text' placeholder='Поиск по имени, номеру или эл...'/>
                            <span className="material-symbols-outlined">search</span>
                        </div>
                    </div>
                </div>
            </div>
            <table className="table">
                <thead className="table_head">
                    <tr>
                        <th
                            style={{
                            paddingLeft: '10px'
                        }}>
                            <button type="button" 
                            onClick={() => requestSort('title')}
                         className='table_title'>
                                Название
                                <span className="material-symbols-outlined">arrow_drop_down</span>
                            </button>
                        </th>
                        <th>
                            <button type="button"  
                            onClick={() => requestSort('status')}
                         className='table_title'>
                                Статус
                                <span className="material-symbols-outlined">arrow_drop_down</span>
                            </button>
                        </th>
                        <th>
                            <button type="button"  
                            onClick={() => requestSort('booking_author_login')}
                         className='table_title'>
                                Арендатор
                                <span className="material-symbols-outlined">arrow_drop_down</span>
                            </button>
                        </th>
                        <th>
                            <button type="button"  
                            onClick={() => requestSort('booking_author_first_name')}
                         className='table_title'>
                                Арендодатель
                                <span className="material-symbols-outlined">arrow_drop_down</span>
                            </button>
                        </th>
                        <th>
                            <button type="button" 
                            onClick={() => requestSort('booking_author_phone')}
                         className='table_title'>
                                Телефон арендодателя
                                <span className="material-symbols-outlined">arrow_drop_down</span>
                            </button>
                        </th>
                        <th>
                            <button type="button"
                            onClick={() => requestSort('region')}  
                         className='table_title'>
                                Город
                                <span className="material-symbols-outlined">arrow_drop_down</span>
                            </button>
                        </th>
                    </tr>
                </thead>
              {loading ? <LoadingSkeletonTableOrders items={[{},{},{},{},{},{}]} /> : <tbody>
                    {/* .slice(firstContentIndex, lastContentIndex) */}
                    {Object
                        .keys(items)
                        .map((item) => {
                            return (
                                <tr key={items[item].id} className="table_body">
                                    <td
                                        style={{
                                        width: '30%',
                                        paddingLeft: '10px'
                                    }}
                                        className="table-body_item">
                                        <a href={items[item].url} target="_blank">
                                            {items[item].title}</a>
                                        </td>

                                    <td
                                        className="table-body_item">
                                        {(() => {
                                            switch (items[item].status) {
                                                case "paid":
                                                    return <div className="table_body_item-status table_body_item-status--paid">Оплачено</div>;
                                                case "expired":
                                                    return <div className="table_body_item-status table_body_item-status--expired">Просроченный</div>;
                                                case "owner_reservations":
                                                    return <div className="table_body_item-status table_body_item-status--owner-reservations">Бронь владельца</div>;
                                                case "waiting":
                                                    return <div className="table_body_item-status table_body_item-status--waiting">Ждет оплаты</div>;
                                                case "cancelled":
                                                    return <div className="table_body_item-status table_body_item-status--cancelled">Отменен</div>;             
                                            }
                                        })()}
                                    </td>
                                    <td
                                        className="table-body_item">
                                        <div className="">{items[item].booking_author_login}</div></td>
                                    <td className="table-body_item">
                                        {items[item].booking_author_avatar
                                            ? <img className='table-body_img' src={items[item].booking_author_avatar}/>
                                            : <span className="material-symbols-outlined no-img_table">account_circle</span>}
                                        {items[item].booking_author_first_name
                                            ? <span>
                                                    {items[item].booking_author_first_name}&#160;
                                                    {items[item].booking_author_last_name}
                                                </span>
                                            : <span className='no-data'>
                                                Нет имени
                                            </span>}
                                    </td>
                                    {items[item].booking_author_phone
                                        ? <td className="table-body_item">{items[item].booking_author_phone}</td>
                                        : <td className="table-body_item no-data">Нет номера</td>}
                                   
                                    {items[item].region
                                        ? <td style={{
                                        paddingRight: '20px'
                                    }} className="table-body_item">{items[item].region}</td>
                                        : <td style={{
                                        paddingRight: '20px'
                                    }} className="table-body_item no-data">Город не указан</td>}
                                </tr>
                            )
                        })}
                </tbody>}
            </table>
            <div className="pagination">
                <p className="pagination_text">
                    {page} из {totalPages}
                </p>
                {/* <button onClick={prevPage} className={`pagination_page pagination_page--prev ${page === 1 && "disabled"}`}>
                <span style={{fontSize: '22px'}} className="material-symbols-outlined">arrow_back_ios_new</span>
                </button> */}
                {[...Array(totalPages).keys()].map((el) => (
                    <button
                        onClick={e => {setPage(el + 1); pagino(el + 1)}}
                        key={el}
                        className={`pagination_page ${page === el + 1
                        ? "active"
                        : ""}`}>
                        {el + 1}
                    </button>
                ))}
                {/* <button
                    onClick={nextPage}
                    className={`pagination_page pagination_page--next ${page === totalPages && "disabled"}`}>
                    <span style={{fontSize: '22px'}} className="material-symbols-outlined">arrow_forward_ios</span>
                </button> */}
            </div>
        </div>
    );

}

export default Orders;