import React, {useState, useEffect} from 'react'
import './users.css'
import '../../components/table/table.css'
import usePagination from "../../hooks/usePagination";
import Loader from '../../components/loader/loader';
const axios = require('axios').default;

// Function for sorting ASC and DESC
const useSortableData = (items, config = null) => {
    const [sortConfig,
        setSortConfig] = React.useState(config);

    const sortedItems = React.useMemo(() => {
        let sortableItems = [...items];
        if (sortConfig !== null) {
            sortableItems.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending'
                        ? -1
                        : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending'
                        ? 1
                        : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [items, sortConfig]);

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({key, direction});
    };

    return {items: sortedItems, requestSort, sortConfig};
};

const Users = () => {
    const [result,
        setResult] = useState('');

    // Function for timeout
    const fetchLongRequest = async() => {
        const waitTime = 5000;
        setTimeout(() => console.log("Request taking a long time"), waitTime);
        try {
            await axios({
                method: "POST",
                url: "https://easytake.org/custom.php",
                data: {
                    type: 'get_dashboard_users',
                    per_page: 30,
                    page: 1
                },
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                })
                .then(function (response) {
                    //handle success
                    setLoading(false);
                    setResult(response.data.users);
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
            fetchLongRequest();
        }, 1000);
    }, []);

    // let people = result; 

    console.log(result, "GET DATA");

    // let newResult = {...result};
    const {newResult, requestSort, sortConfig} = useSortableData(Object.keys(result));

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
        contentPerPage: 10,
        count: Object
            .keys(result)
            .length
    });

    const GetKey = () => {
        Object
        .keys(result)
        .slice(firstContentIndex, lastContentIndex)
        .map((item, index) => {
            return result[item].login;
        })
    }

    return (
        <div className='users_wrapper'>
            <div className='users'>
                <div className='users_header'>
                    <div className='title'>
                        <span
                            style={{
                            marginRight: '7px'
                        }}
                            class="material-symbols-outlined">group</span>Пользователи</div>
                    <div className='flex'>
                        <div className='users_filter'>
                            Фильтры
                            <div className='filter_counter'>0</div>
                            <span class="material-symbols-outlined">tune</span>
                        </div>
                        <div className='table_input input'>
                            <input className='input_text' placeholder='Поиск по имени, номеру или эл...'/>
                            <span class="material-symbols-outlined">search</span>
                        </div>
                    </div>
                </div>
            </div>
        {loading ? (
        <Loader />
      ) : error ? (
        <h2>Error fetching users</h2>
      ) : (
            <table className="table">
                <thead className="table_head">
                    <tr>
                        <th
                            style={{
                            paddingLeft: '10px'
                        }}>
                            <button type="button" 
                            onClick={() => console.log(GetKey(), "REQUEST SORT")}
                         className='table_title'>
                                Логин
                                <span class="material-symbols-outlined">arrow_drop_down</span>
                            </button>
                        </th>
                        <th>
                            <button type="button"  
                            onClick={() => requestSort('first_name')}
                         className='table_title'>
                                Имя пользователя
                                <span class="material-symbols-outlined">arrow_drop_down</span>
                            </button>
                        </th>
                        <th>
                            <button type="button"  
                            onClick={() => requestSort('phone')}
                         className='table_title'>
                                Телефон
                                <span class="material-symbols-outlined">arrow_drop_down</span>
                            </button>
                        </th>
                        <th>
                            <button type="button"  
                            onClick={() => requestSort('confirmed')}
                         className='table_title'>
                                Статус
                                <span class="material-symbols-outlined">arrow_drop_down</span>
                            </button>
                        </th>
                        <th>
                            <button type="button" 
                            onClick={() => requestSort('orders_count')}
                         className='table_title'>
                                Заказы
                                <span class="material-symbols-outlined">arrow_drop_down</span>
                            </button>
                        </th>
                        <th>
                            <button type="button"  
                            onClick={() => requestSort('bookings_count')}
                         className='table_title'>
                                Брони
                                <span class="material-symbols-outlined">arrow_drop_down</span>
                            </button>
                        </th>
                        <th>
                            <button type="button"  
                            onClick={() => requestSort('active_listings')}
                         className='table_title'>
                                Акт. объ.
                                <span class="material-symbols-outlined">arrow_drop_down</span>
                            </button>
                        </th>
                        <th>
                            <button type="button" 
                            onClick={() => requestSort('city')}
                         className='table_title'>
                                Город
                                <span class="material-symbols-outlined">arrow_drop_down</span>
                            </button>
                        </th>
                        <th>
                            <button type="button" 
                            onClick={() => requestSort('rating')}
                         className='table_title'>
                                Рейтинг
                                <span class="material-symbols-outlined">arrow_drop_down</span>
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
                                        paddingLeft: '10px'
                                    }}
                                        className="table-body_item">{result[item].login}</td>
                                    <td className="table-body_item">
                                        {result[item].avatar
                                            ? <img className='table-body_img' src={result[item].avatar}/>
                                            : <span class="material-symbols-outlined no-img_table">account_circle_full</span>}
                                        {result[item].first_name
                                            ? <span>
                                                    {result[item].first_name}&#160;
                                                    {result[item].last_name}
                                                </span>
                                            : <span className='no-data'>
                                                Нет имени
                                            </span>}
                                    </td>
                                    {result[item].phone
                                        ? <td className="table-body_item">{result[item].phone}</td>
                                        : <td className="table-body_item no-data">Нет номера</td>}
                                    <td
                                        style={{
                                        textAlign: 'center'
                                    }}
                                        className="table-body_item">
                                        {(() => {
                                            switch (result[item].confirmed) {
                                                case true:
                                                    return <span
                                                        style={{
                                                        color: '#4CBB17'
                                                    }}
                                                        class="material-symbols-outlined">check_circle</span>;
                                                case false:
                                                    return <span
                                                        style={{
                                                        color: '#F05050'
                                                    }}
                                                        class="material-symbols-outlined">cancel</span>;
                                                    {/* case 'waitingConfirmed':
                return <span style={{color: '#FFBF00'}} class="material-symbols-outlined">timelapse</span>;
              case 'blocked':
                return <span style={{color: '#666669'}} class="material-symbols-outlined">lock</span>; */
                                                    }
                                            }
                                        })()}
                                    </td>
                                    <td className="table-body_item">{result[item].orders_count}</td>
                                    <td className="table-body_item">{result[item].bookings_count}</td>
                                    <td className="table-body_item">{result[item].active_listings}</td>
                                    {result[item].city
                                        ? <td className="table-body_item">{result[item].city}</td>
                                        : <td className="table-body_item no-data">Город не указан</td>}
                                        {result[item].rating ? <td style={{textAlign: 'center'}} className="table-body_item">
                                         <span style={{fontSize: '20px', verticalAlign: 'middle'}} class="material-symbols-outlined">star</span>{result[item].rating.toFixed(1)}</td> :
                                         <td style={{textAlign: 'center'}} className="table-body_item">
                                         <span style={{fontSize: '20px', verticalAlign: 'middle'}} class="material-symbols-outlined">star</span>--.--</td>}
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
                <span style={{fontSize: '22px'}} class="material-symbols-outlined">arrow_back_ios_new</span>
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
                    <span style={{fontSize: '22px'}} class="material-symbols-outlined">arrow_forward_ios</span>
                </button>
            </div>

        </div>
    );

}

export default Users;