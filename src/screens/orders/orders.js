import React, {useState, useEffect} from 'react'
import './orders.css'
import Loader from '../../components/loader/loader';
import Filter from '../../components/filter/filter';
import usePagination from "../../hooks/usePagination";
const axios = require('axios').default;

const Orders = () => {
    const [result, setResult] = useState('');

    // Function for timeout
    const getOrders = async() => {
        const waitTime = 5000;
        setTimeout(() => console.log("Request taking a long time"), waitTime);
        try {
            await axios({
                method: "POST",
                url: "https://easytake.org/custom.php",
                data: {
                    type: 'get_dashboard_orders',
                    per_page: 100,
                    page: 1,
                    // filters: {
                    //     region: "151",
                    //     status: "paid",
                    //     date: {
                    //         "start_date": "2022-05-22",
                    //         "end_date": "2022-05-27"
                    //     }
                    // }
                
                },
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                })
                .then(function (response) {
                    //handle success
                    setLoading(false);
                    setResult(response.data.post);
                    console.log(response.data.post, "ORDERS");
                })
                .catch(function (response) {
                    //handle error
                    setError(true);
                    console.log(response.err);
                });
        } catch (error) {
            console.log("FAIL!", error.message);
        }
    };

    useEffect(() => {
        setTimeout(() => {
            getOrders();
        }, 1000);
    }, []);

    console.log(result, "RESULT");
    const [showFilter, setShowFilter] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const {
        firstContentIndex,
        lastContentIndex,
        nextPage,
        prevPage,
        page,
        setPage,
        totalPages
    } = usePagination({
        contentPerPage: 25,
        count: Object
            .keys(result)
            .length
    });

    return (
        <div className='users_wrapper'>
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
                        <div>{showFilter ? <Filter /> : null}</div>
                        </div>
                        <div className='table_input input'>
                            <input className='input_text' placeholder='Поиск по имени, номеру или эл...'/>
                            <span className="material-symbols-outlined">search</span>
                        </div>
                    </div>
                </div>
            </div>
        {loading ? (
        <Loader />
      ) : error ? (
        <h2>Error fetching orders</h2>
      ) : (
            <table className="table">
                <thead className="table_head">
                    <tr>
                        <th
                            style={{
                            paddingLeft: '10px'
                        }}>
                            <button type="button" 
                         className='table_title'>
                                Название
                                <span className="material-symbols-outlined">arrow_drop_down</span>
                            </button>
                        </th>
                        <th>
                            <button type="button"  
                         className='table_title'>
                                Статус
                                <span className="material-symbols-outlined">arrow_drop_down</span>
                            </button>
                        </th>
                        <th>
                            <button type="button"  
                         className='table_title'>
                                Арендатор
                                <span className="material-symbols-outlined">arrow_drop_down</span>
                            </button>
                        </th>
                        <th>
                            <button type="button"  
                         className='table_title'>
                                Арендодатель
                                <span className="material-symbols-outlined">arrow_drop_down</span>
                            </button>
                        </th>
                        <th>
                            <button type="button" 
                         className='table_title'>
                                Телефон арендодателя
                                <span className="material-symbols-outlined">arrow_drop_down</span>
                            </button>
                        </th>
                        <th>
                            <button type="button"  
                         className='table_title'>
                                Город
                                <span className="material-symbols-outlined">arrow_drop_down</span>
                            </button>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {/* .slice(firstContentIndex, lastContentIndex) */}
                    {Object
                        .keys(result)
                        .slice(firstContentIndex, lastContentIndex)
                        .map((item, index) => {
                            return (
                                <tr key={index} className="table_body">
                                    <td
                                        style={{
                                        width: '30%',
                                        paddingLeft: '10px'
                                    }}
                                        className="table-body_item">
                                            {result[item].title}
                                        </td>

                                    <td
                                        className="table-body_item">
                                        {(() => {
                                            switch (result[item].status) {
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
                                        <div className="">{result[item].booking_author_login}</div></td>
                                    <td className="table-body_item">
                                        {result[item].booking_author_avatar
                                            ? <img className='table-body_img' src={result[item].booking_author_avatar}/>
                                            : <span className="material-symbols-outlined no-img_table">account_circle</span>}
                                        {result[item].booking_author_first_name
                                            ? <span>
                                                    {result[item].booking_author_first_name}&#160;
                                                    {result[item].booking_author_last_name}
                                                </span>
                                            : <span className='no-data'>
                                                Нет имени
                                            </span>}
                                    </td>
                                    {result[item].booking_author_phone
                                        ? <td className="table-body_item">{result[item].booking_author_phone}</td>
                                        : <td className="table-body_item no-data">Нет номера</td>}
                                   
                                    {result[item].region
                                        ? <td style={{
                                        paddingRight: '20px'
                                    }} className="table-body_item">{result[item].region}</td>
                                        : <td style={{
                                        paddingRight: '20px'
                                    }} className="table-body_item no-data">Город не указан</td>}
                                </tr>
                            )
                        })}
                </tbody>
            </table>
 )}
            <div className="pagination">
                <p className="pagination_text">
                    {page} из {totalPages}
                </p>
                <button onClick={prevPage} className={`pagination_page pagination_page--prev ${page === 1 && "disabled"}`}>
                <span style={{fontSize: '22px'}} className="material-symbols-outlined">arrow_back_ios_new</span>
                </button>
                {[...Array(totalPages).keys()].map((el) => (
                    <button
                        onClick={() => setPage(el + 1)}
                        key={el}
                        className={`pagination_page ${page === el + 1
                        ? "active"
                        : ""}`}>
                        {el + 1}
                    </button>
                ))}
                <button
                    onClick={nextPage}
                    className={`pagination_page pagination_page--next ${page === totalPages && "disabled"}`}>
                    <span style={{fontSize: '22px'}} className="material-symbols-outlined">arrow_forward_ios</span>
                </button>
            </div>

        </div>
    );

}

export default Orders;