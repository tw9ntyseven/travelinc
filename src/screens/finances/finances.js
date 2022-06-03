import React, {useState, useEffect} from 'react'
import './finances.css'
import Loader from '../../components/loader/loader';
import Filter from '../../components/filter/filter';
import usePagination from "../../hooks/usePagination";
import { thousandSeparator } from '../dashboard/dashboard';
const axios = require('axios').default;

export const TableCard = ({items}) => {
    return (
        <div className='table_cards'>
            {items.map((item, index) => (
                <div key={index} className='table_cards-item'>
                <div className="table_cards-item-block">
                    <div className='dashboard_block-card-count flex'>{item.count}</div>
                    <div className='dashboard_block-card-description'>{item.description}</div>
                </div>
                    <img style={{width: '65px'}} src={require(`../../assets/dashboard-icons/${item.icon}.svg`)}/>
                </div>
            ))}
        </div>
    );
}
// get_dashboard_finance_stat
const Finances = () => {
    const [result, setResult] = useState('');
    const [resultStat, setResultStat] = useState();

    // GET FINANCES STAT
    const getFinancesStat = async() => {
        const waitTime = 5000;
        setTimeout(() => console.log("Request taking a long time"), waitTime);
        try {
            await axios({
                method: "POST",
                url: "https://easytake.org/custom.php",
                data: {
                    type: 'get_dashboard_finance_stat',
                },
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                })
                .then(function (response) {
                    setLoading(false);
                    setResultStat(response.data)
                    console.log(response.data, "FINANCES STAT");
                })
                .catch(function (response) {
                    setError(true);
                    console.log(response.err);
                });
        } catch (error) {
            console.log("FAIL!", error.message);
        }
    };

    // Function for timeout
    const getFinances = async() => {
        const waitTime = 5000;
        setTimeout(() => console.log("Request taking a long time"), waitTime);
        try {
            await axios({
                method: "POST",
                url: "https://easytake.org/custom.php",
                data: {
                    type: 'get_dashboard_finance_list',
                    page: 1,                
                    per_page: 100,
                },
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                })
                .then(function (response) {
                    setLoading(false);
                    setResult(response.data.finances);
                    console.log(response.data.finances, "FINANCES");
                })
                .catch(function (response) {
                    setError(true);
                    console.log(response.err);
                });
        } catch (error) {
            console.log("FAIL!", error.message);
        }
    };


    

  
    useEffect(() => {
        setTimeout(() => {
            getFinancesStat();
                getFinances();
        }, 1000);
    }, []);

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
    {loading ? (
        <Loader />
      ) : error ? (
        <h2>Error fetching finances</h2>
      ) : (
          <>
        <TableCard
            items={[
                {
                    count: thousandSeparator(resultStat.paid_count),
                    description: 'Оплаченных заказов',
                    icon: 'Graph'
                },
                {
                    count: thousandSeparator(resultStat.total_paid),
                    description: 'Сумма заказов (₽)',
                    icon: 'Buy'
                },
                {
                    count: thousandSeparator(resultStat.net_profit),
                    description: 'Чистой прибыли (₽)',
                    icon: 'Wallet'
                },
                {
                    count: thousandSeparator(resultStat.paid_with_commissions),
                    description: 'Оплачено с комиссиями (₽)',
                    icon: 'Discount'
                },
                {
                    count: thousandSeparator(resultStat.paid_on_rejected),
                    description: 'Выплачено по отказам (₽)',
                    icon: 'DGraph'
                },
            ]} />
            <div className='users'>
                <div className='users_header'>
                    <div className='title'>
                        <span
                            style={{
                            marginRight: '7px'
                        }}
                            className="material-symbols-outlined">account_balance_wallet</span>Финансы</div>
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
            <table className="table">
                <thead className="table_head">
                    <tr>
                        <th
                            style={{
                            paddingLeft: '10px',
                        }}>
                            <button type="button" 
                         className='table_title'>
                                Название объявления
                                <span className="material-symbols-outlined">arrow_drop_down</span>
                            </button>
                        </th>
                        <th>
                            <button type="button"  
                         className='table_title'>
                                Оплачено (₽)
                                <span className="material-symbols-outlined">arrow_drop_down</span>
                            </button>
                        </th>
                        <th>
                            <button type="button"  
                         className='table_title'>
                                Заработок серв. (₽)
                                <span className="material-symbols-outlined">arrow_drop_down</span>
                            </button>
                        </th>
                        <th>
                            <button type="button"  
                         className='table_title'>
                                Стоимость зак. (₽)
                                <span className="material-symbols-outlined">arrow_drop_down</span>
                            </button>
                        </th>
                        <th>
                            <button type="button" 
                         className='table_title'>
                                Прибыль (₽)
                                <span className="material-symbols-outlined">arrow_drop_down</span>
                            </button>
                        </th>
                        <th>
                            <button type="button"  
                         className='table_title'>
                                Заработано хоз. (₽)
                                <span className="material-symbols-outlined">arrow_drop_down</span>
                            </button>
                        </th>
                        <th>
                            <button type="button"  
                         className='table_title'>
                                Плательщик
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
                    </tr>
                </thead>
                <tbody>
                    {Object
                        .keys(result)
                        .slice(firstContentIndex, lastContentIndex)
                        .map((item, index) => {
                            return (
                                <tr key={index} className="table_body">
                                    <td
                                        style={{
                                        width: '20%',
                                        paddingLeft: '10px'
                                    }}
                                        className="table-body_item">
                                            {result[item].title}
                                        </td>
                                        
                                    <td style={{textAlign: 'center'}} className="table-body_item">
                                        <div className="">{result[item].paid}</div></td>

                                    <td style={{textAlign: 'center'}} className="table-body_item">
                                        {result[item].earned_by_service ? <div className="">{result[item].earned_by_service}</div>
                                        :<div className="">0</div>}
                                    </td>

                                    <td style={{textAlign: 'center'}} className="table-body_item">
                                        {result[item].book_cost ? <div className="">{result[item].book_cost}</div>
                                        :<div className="">0</div>}
                                    </td>

                                    <td style={{textAlign: 'center'}} className="table-body_item">
                                        <div className="">{result[item].net_profit}</div></td>

                                    <td style={{textAlign: 'center'}} className="table-body_item">
                                        <div className="">{result[item].earned_by_owner}</div></td>

                                    <td className="table-body_item">
                                        <div className="">{result[item].payer}</div></td>

                                    <td className="table-body_item">
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
                                </tr>
                            )
                        })}
                </tbody>
            </table>
            </>
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

export default Finances;