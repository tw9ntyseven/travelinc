import React, {useState, useEffect} from 'react'
import './users.css'
import '../../components/table/table.css'
import usePagination from "../../hooks/usePagination";
import Loader from '../../components/loader/loader';
import Filter from '../../components/filter/filter';
import { TableCard } from '../finances/finances';
import { thousandSeparator } from '../dashboard/dashboard';
const axios = require('axios').default;



// Function for sorting ASC and DESC
export const useSortableData = (items, config = null) => {
    const [sortConfig, setSortConfig] = React.useState(config);
  
    const sortedItems = React.useMemo(() => {
      let sortableItems = [...items];
      if (sortConfig !== null) {
        sortableItems.sort((a, b) => {
          if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === 'ascending' ? -1 : 1;
          }
          if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === 'ascending' ? 1 : -1;
          }
          return 0;
        });
      }
      return sortableItems;
    }, [items, sortConfig]);
  
    const requestSort = (key) => {
      let direction = 'ascending';
      if (
        sortConfig &&
        sortConfig.key === key &&
        sortConfig.direction === 'ascending'
      ) {
        direction = 'descending';
      }
      setSortConfig({ key, direction });
    };
  
    return { items: sortedItems, requestSort, sortConfig };
  };




const Users = () => {
    const [showFilter, setShowFilter] = useState(false);
    const [value, setValue] = useState();
    const refresh = async() => {
        await getUsers();
    }
    // Function for timeout
    const getUsers = async() => {
            await axios({
                method: "POST",
                url: "https://easytake.org/custom.php",
                data: {
                    type: 'get_dashboard_users_list',
                    per_page: 10,
                    page: page,
                    // filters: `{"region": "Краснодар"}`
                },
                headers: {
                    "Content-Type": "multipart/form-data"
                }
                })
                .then(function (response) {
                    //handle success
                    setLoading(false);
                    localStorage.setItem("totalDataUsers", JSON.stringify(response.data));

                    localStorage.setItem("dataUsers", JSON.stringify(response.data.users));

                    // console.log(response.data, "DATA TOTAL");
                })
                .catch(function (response) {
                    //handle error
                    setError(true);
                    console.log(response.err);
                });
    };

    const getUserStats = async() => {
            await axios({
                method: "POST",
                url: "https://easytake.org/custom.php",
                data: {
                    type: 'get_dashboard_users_stat',
                },
                headers: {
                    "Content-Type": "multipart/form-data"
                }
                })
                .then(function (response) {
                    setLoading(false);
                    // setResultStat(response.data);
                    localStorage.setItem("dataUsersStats", JSON.stringify(response.data));
                    console.log(response, "USERS STATS");
                })
                .catch(function (response) {
                    setError(true);
                    console.log(response.err);
                });
    };





    const data = JSON.parse(localStorage.getItem("dataUsers"));
    const dataTotal = JSON.parse(localStorage.getItem("totalDataUsers"));
    const dataStats = JSON.parse(localStorage.getItem("dataUsersStats"));
    console.log(dataTotal, "DATA TOTAL");

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
        contentPerPage: dataTotal.per_page,
        count: dataTotal.total_users_count,
    });

    // getUserStats();
    // getUsers();
    useEffect(() => {
        setTimeout(async() => {
            await getUserStats();
            await getUsers();
        }, 0);
    }, []);

    const {items, requestSort, sortConfig} = useSortableData(Object.values(data));

  
    return (
        <div className='users_wrapper'>
  
        <TableCard items={[
                {
                    count: thousandSeparator(dataStats.total_users),
                    description: 'Активных пользователей',
                    icon: 'Profile'
                },
                {
                    count: thousandSeparator(dataStats.not_confirmed_users),
                    description: 'Не подтвержденных пользователей',
                    icon: 'Close'
                },
                {
                    count: thousandSeparator(dataStats.confirmed_users),
                    description: 'Подтвержденные пользователи',
                    icon: 'Tick'
                },
                {
                    count: thousandSeparator(dataStats.on_validation),
                    description: 'Заявка на авторизацию',
                    icon: 'Clock'
                },
                {
                    count: thousandSeparator(dataStats.blocked),
                    description: 'Заблокированных пользователей',
                    icon: 'blocked-users'
                },
        ]} />
        
            <div className='users'>
                <div className='users_header'>
                    <div className='title'>
                        <span
                            style={{
                            marginRight: '7px'
                        }}
                            className="material-symbols-outlined">group</span>Пользователи</div>
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
                            paddingLeft: '10px'
                        }}>
                            <button type="button" 
                            onClick={() => requestSort('login')}
                         className='table_title'>
                                Логин
                                <span className="material-symbols-outlined">arrow_drop_down</span>
                            </button>
                        </th>
                        <th>
                            <button type="button"  
                            onClick={() => requestSort('first_name')}
                         className='table_title'>
                                Имя пользователя
                                <span className="material-symbols-outlined">arrow_drop_down</span>
                            </button>
                        </th>
                        <th>
                            <button type="button"  
                            onClick={() => requestSort('phone')}
                         className='table_title'>
                                Телефон
                                <span className="material-symbols-outlined">arrow_drop_down</span>
                            </button>
                        </th>
                        <th>
                            <button type="button"  
                            onClick={() => requestSort('confirmed')}
                         className='table_title'>
                                Статус
                                <span className="material-symbols-outlined">arrow_drop_down</span>
                            </button>
                        </th>
                        <th>
                            <button type="button" 
                            onClick={() => requestSort('orders_count')}
                         className='table_title'>
                                Заказы
                                <span className="material-symbols-outlined">arrow_drop_down</span>
                            </button>
                        </th>
                        <th>
                            <button type="button"  
                            onClick={() => requestSort('bookings_count')}
                         className='table_title'>
                                Брони
                                <span className="material-symbols-outlined">arrow_drop_down</span>
                            </button>
                        </th>
                        <th>
                            <button type="button"  
                            onClick={() => requestSort('active_listings')}
                         className='table_title'>
                                Акт. объ.
                                <span className="material-symbols-outlined">arrow_drop_down</span>
                            </button>
                        </th>
                        <th>
                            <button type="button" 
                            onClick={() => requestSort('city')}
                         className='table_title'>
                                Город
                                <span className="material-symbols-outlined">arrow_drop_down</span>
                            </button>
                        </th>
                        <th>
                            <button type="button" 
                            onClick={() => requestSort('rating')}
                         className='table_title'>
                                Рейтинг
                                <span className="material-symbols-outlined">arrow_drop_down</span>
                            </button>
                        </th>
                    </tr>
                </thead>
                <tbody>
                        {/* .slice(firstContentIndex, lastContentIndex) */}
                    {Object.keys(items)
                        .map(item => {
                            return (
                                <tr key={items[item].id} className="table_body">
                                    <td
                                        style={{
                                        paddingLeft: '10px'
                                    }}
                                        className="table-body_item">{items ? items[item].login : "Нет данных"}</td>
                                    <td className="table-body_item">
                                        {items[item].avatar
                                            ? <img className='table-body_img' src={items[item].avatar}/>
                                            : <span className="material-symbols-outlined no-img_table">account_circle</span>}
                                        {items[item].first_name
                                            ? <span>
                                                    {items[item].first_name}&#160;
                                                    {items[item].last_name}
                                                </span>
                                            : <span className='no-data'>
                                                Нет имени
                                            </span>}
                                    </td>
                                    {items[item].phone
                                        ? <td className="table-body_item">{items ? items[item].phone : "Нет данных"}</td>
                                        : <td className="table-body_item no-data">Нет номера</td>}
                                    <td
                                        style={{
                                        textAlign: 'center'
                                    }}
                                        className="table-body_item">
                                        {(() => {
                                            switch (items[item].confirmed) {
                                                case true:
                                                    return <span
                                                        style={{
                                                        color: '#4CBB17'
                                                    }}
                                                        className="material-symbols-outlined">check_circle</span>;
                                                case false:
                                                    return <span
                                                        style={{
                                                        color: '#F05050'
                                                    }}
                                                        className="material-symbols-outlined">cancel</span>;
                                            }
                                        })()}
                                    </td>
                                    <td className="table-body_item">{items ? items[item].orders_count : 'Нет данных'}</td>
                                    <td className="table-body_item">{items ? items[item].bookings_count : "Нет данных"}</td>
                                    <td className="table-body_item">{items[item].active_listings}</td>
                                    {items[item].city
                                        ? <td className="table-body_item">{items[item].city}</td>
                                        : <td className="table-body_item no-data">Город не указан</td>}
                                        {items[item].rating ? <td style={{textAlign: 'center'}} className="table-body_item">
                                         <span style={{fontSize: '20px', verticalAlign: 'middle'}} className="material-symbols-outlined">star</span>{items[item].rating.toFixed(1)}</td> :
                                         <td style={{textAlign: 'center'}} className="table-body_item">
                                         <span style={{fontSize: '20px', verticalAlign: 'middle'}} className="material-symbols-outlined">star</span>--.--</td>}
                                </tr>
                            )
                        })}
                </tbody>
            </table>

            <div className="pagination">
                <p className="pagination_text">
                    {page} из {totalPages}
                </p>
                <button onClick={() => {getUsers(); prevPage();}} className={`pagination_page pagination_page--prev ${page === 1 && "disabled"}`}>
                <span style={{fontSize: '22px'}} className="material-symbols-outlined">arrow_back_ios_new</span>
                </button>
                {[...Array(totalPages).keys()].map((el) => (
                    <button
                        onClick={() => {getUsers(); setPage(el + 1);}}
                        key={el}
                        className={`pagination_page ${page === el + 1
                        ? "active"
                        : ""}`}>
                        {el + 1}
                    </button>
                ))}
                <button
                    onClick={() => {getUsers(); nextPage();}}
                    className={`pagination_page pagination_page--next ${page === totalPages && "disabled"}`}>
                    <span style={{fontSize: '22px'}} className="material-symbols-outlined">arrow_forward_ios</span>
                </button>
            </div>

        </div>
    );

}

export default Users;