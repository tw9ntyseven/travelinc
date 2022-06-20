import React, {useState, useEffect, useCallback} from 'react'
import './users.css'
import '../../components/table/table.css'
import usePagination from "../../hooks/usePagination";
import {LoadingCards, LoadingSkeletonTable} from "../../components/loading-skeleton/loading-skeleton";
import Filter from '../../components/filter/filter';
import { thousandSeparator } from '../dashboard/dashboard';
import { TableCard } from '../../components/table/table';
import Select from 'react-select'
import { Checkbox, CheckboxGroup } from '@trendmicro/react-checkbox';
import '@trendmicro/react-checkbox/dist/react-checkbox.css';
import { Notification } from '../../components/notification/notification';
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
    const [result, setResult] = useState([]);
    const [resultStat, setResultStat] = useState([]);
    const [resultTotal, setResultTotal] = useState([]);
    const [cities, setCities] = useState([]);
    const [region, setRegion] = useState('');
    const [status, setStatus] = useState('');
    const [withOrders, setWithOrders] = useState('');
    const [withListings, setWithListings] = useState('');
    const [withBookings, setWithBookings] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState(``);
    const [loading, setLoading] = useState(true);
    const [loadingTable, setLoadingTable] = useState(true);
    const [showFilter, setShowFilter] = useState(false);
    const [value, setValue] = useState();
    const [showNotification, setShowNotification] = useState(false);
    const [statusOrders, setStatusOrders] = useState('');



    useEffect(() => {
        getUserStats();
        getRegions();
        getUsers();
    }, []);


    
    const getUsers = (page) => {
        let filter, filterRes;

        if (region != '' && status == '') {
            filterRes = `{"region": "${region}"}`
        }
        if (region == '' && status != '') {
            filterRes = `{"status": "${status}"}`
        }
        if (region != '' && status != '') {
            filterRes = `{"region": "${region}", "status": "${status}"}`
        }

        // ORDERS
        if (withOrders != '') {
            filterRes = `{"orders": "${withOrders}"}`
        }
        if (withOrders != '' && region != '') {
            filterRes  = `{"region": "${region}", "orders": "${withOrders}"}`
        }
        if (withOrders != '' && status != '') {
            filterRes  = `{"status": "${status}", "orders": "${withOrders}"}`
        }
        if (withOrders != '' && region != '' && status != '') {
            filterRes  = `{"region": "${region}", "orders": "${withOrders}", "status": "${status}"}`
        }

        // BOOKINGS
        if (withBookings != '') {
            filterRes = `{"bookings": "${withBookings}"}`
        }
        if (withBookings != '' && region != '') {
            filterRes = `{"region": "${region}", "bookings": "${withBookings}"}`
        }
        if (withBookings != '' && status != '') {
            filterRes = `{"status": "${status}", "bookings": "${withBookings}"}`
        }
        if (withBookings != '' && region != '' && status != '') {
            filterRes = `{"region": "${region}", "bookings": "${withBookings}", "status": "${status}"}`
        }

        // LISTINGS
        if (withListings != '') {
            filterRes = `{"listings": "${withListings}"}`
        }
        if (withListings != '' && region != '') {
            filterRes = `{"region": "${region}", "listings": "${withListings}"}`
        }
        if (withListings != '' && status != '') {
            filterRes = `{"status": "${status}", "listings": "${withListings}"}`
        }
        if (withListings != '' && region != '' && status != '') {
            filterRes = `{"region": "${region}", "listings": "${withListings}", "status": "${status}"}`
        }
        if (filterRes) {
            filterRes = filterRes.replace(/[`]+/g, '');
            filter = filterRes;
            console.log(filter, 'filter 3');
        }
        
            axios({
                method: "POST",
                url: "https://easytake.org/custom.php",
                data: {
                    type: 'get_dashboard_users_list',
                    per_page: 15,
                    page: page ? page : 1,
                    filters: filter,
                },
                headers: {
                    "Content-Type": "multipart/form-data"
                }
                })
                .then(function (response) {
                    setResultTotal(response.data.total_users_count);
                    setResult(response.data.users);
                    setLoadingTable(false);
                    console.log(response, "RESPONSE");
                })
                .catch(function (error) {
                    console.log('Error JSON', error.toJSON());
                    console.log('Error', error.message);
                });
    };

    const getUserStats = () => {
            axios({
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
                    setResultStat(response.data);
                    setLoading(false);
                })
                .catch(function (error) {
                    console.log('Error', error.message);
                });
    };

    const getRegions = () => {
        axios({
            method: "POST",
            url: "https://easytake.org/custom.php",
            data:{
                type: "get_regions"
            },
            headers: {
                "Content-Type": "multipart/form-data"
            }
            })
            .then(function (response) {
                console.log(response.data, "CITIES");
                setCities(response.data);
                setLoading(false);
            })
            .catch(function (error) {
                console.log('Error', error.message);
            });
    };

    // let userCities = Object.values(result).map(item => {
    //     let cities = item.city;
    //     return cities;
    // });
    // console.log(userCities, "CITIES");
    
    let regions = Object.values(cities).map(function(item, index) {
        let options;
        options = {index: index, value: item.slug, label: item.name};  
        return options;
    });
    // let regions = Object.values(result).map(function(item, index) {
    //     let options;
    //     options = {index: index, value: item.login, label: item.city};  

    //     return options;
    // });

    const changeRegionFunc = (region) => {
        setRegion(region);
    }

    const {
        firstContentIndex,
        lastContentIndex,
        nextPage,
        prevPage,
        page,
        setPage,
        totalPages
    } = usePagination({
        contentPerPage: 15,
        count: resultTotal ?? 0,
    });

  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      margin: '4px 0px',
      padding: 5,
      // color: '#000',
      color: state.isSelected ? 'white' : 'black',
      backgroungColor: state.isSelected ? 'blue' :'#B1DBFB',
      borderRadius: '8px',
    }),
    control: () => ({
      display: 'flex',
      // border: 0,
      width: 345,
      color: '#000',
      border: '1px solid #C4C4C4',
      borderRadius: '8px'
    }),
    dropdownIndicator: (provided, state) => ({
        ...provided,
        color: '#000',
        transform: state.selectProps.menuIsOpen ? 'rotate(180deg)': '',
    })
  }

    const checkBoxOnValidation = useCallback(
      (e) => {
        setStatus("on_validation");
      }, [''],
    )
    const checkBoxConfirmed = useCallback(
        (e) => {
          setStatus("confirmed");
        }, [''],
      )
      const checkBoxNotConfirmed = useCallback(
        (e) => {
          setStatus("not_confirmed");
        }, [''],
      )
      const checkBoxWithOrders = useCallback(
        (e) => {
          setWithOrders("with");
          setStatusOrders("with-orders");
        }, [''],
      )
      const checkBoxWithListings = useCallback(
        (e) => {
          setWithListings("with");
          setStatusOrders("with-listings");
        }, [''],
      )
      const checkBoxWithBookings = useCallback(
        (e) => {
          setWithBookings("with");
          setStatusOrders("with-bookings");
        }, [''],
      )
      const checkBoxWithoutOrders = useCallback(
        (e) => {
          setWithOrders("without");
          setStatusOrders("without-orders");
        }, [''],
      )

      const clear = () => {
          changeRegionFunc('');
        //   setRegion('');
          setStatus('');
          setShowFilter(!showFilter);
        //   setLoadingTable(true);
          getUsers();
    }

    const refresh = () => {
        if (region == '' && status == '' && withOrders == '' && withListings == '' && withBookings == '') {
            alert("Установите фильтры!");
            // setShowNotification(!showNotification);
        } else {
            setShowFilter(!showFilter);
            setLoadingTable(true);
            getUsers();
        }
    }
    const pagino = (page) => {
        setLoadingTable(true);
        getUsers(page);
    }

    const {items, requestSort, sortConfig} = useSortableData(result == null || result == undefined ? [] : Object.values(result));

    return (
        <div className='users_wrapper'>
       {loading ? <LoadingCards /> : <TableCard items={[
                {
                    count: thousandSeparator(resultStat.total_users),
                    description: 'Активных пользователей',
                    icon: 'Profile'
                },
                {
                    count: thousandSeparator(resultStat.not_confirmed_users),
                    description: 'Не подтвержденных пользователей',
                    icon: 'Close'
                },
                {
                    count: thousandSeparator(resultStat.confirmed_users),
                    description: 'Подтвержденные пользователи',
                    icon: 'Tick'
                },
                {
                    count: thousandSeparator(resultStat.on_validation),
                    description: 'Заявка на авторизацию',
                    icon: 'Clock'
                },
                {
                    count: thousandSeparator(resultStat.blocked),
                    description: 'Заблокированных пользователей',
                    icon: 'blocked-users'
                },
        ]} />}
            <div className='users'>
            {/* {showNotification ? <Notification /> : null} */}
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
                        <div>{showFilter ? 
                            <div className='filter'>
                                <Select
                                    // value={region}
                                    placeholder="Город"
                                    components={{ IndicatorSeparator:() => null }}
                                    options={regions}
                                    onChange={e => changeRegionFunc(e.label)}
                                    styles={customStyles}
                                />
                                <div className='filter_checkbox-block'>
                                <div className='filter_checkbox-column'>
                                    <Checkbox checked={status == "confirmed" ? true : false} onChange={checkBoxConfirmed} className="filter_checkbox-column-item" label="Подтвержденные" />
                                    <Checkbox checked={status == "not_confirmed" ? true : false} onChange={checkBoxNotConfirmed} className="filter_checkbox-column-item" label="Не подтвержденные" />
                                    <Checkbox checked={status == "on_validation" ? true : false} onChange={checkBoxOnValidation} className="filter_checkbox-column-item" label="На проверке" />
                                    <Checkbox checked={statusOrders == "with-orders" ? true : false} onChange={checkBoxWithOrders} className="filter_checkbox-column-item" label="С объявлениями" />
                                </div>
                                <div className='filter_checkbox-column'>
                                    <Checkbox checked={statusOrders == "without-orders" ? true : false} onChange={checkBoxWithoutOrders} className="filter_checkbox-column-item" label="Без объявлений" />
                                    <Checkbox checked={statusOrders == "with-listings" ? true : false} onChange={checkBoxWithListings} className="filter_checkbox-column-item" label="С заказами" />
                                    <Checkbox checked={statusOrders == "with-bookings" ? true : false} onChange={checkBoxWithBookings} className="filter_checkbox-column-item" label="С бронями" />
                                </div>
                                </div>
                                <div className='filter_button-block'>
                                    <div onClick={clear} className='filter_button-block-btn filter_button-block-btn--reset'>Сбросить изменения</div>
                                    <div onClick={refresh} className='filter_button-block-btn'>Применить</div>
                                </div>
                            </div>
                        : null}</div>
                        </div>
                        <div className='table_input input'>
                            <input onChange={e => {setSearchTerm(e.target.value)}} className='input_text' placeholder='Поиск по имени, логину, номеру или городу'/>
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
            {loadingTable ? <LoadingSkeletonTable items={[{},{},{},{},{},{}]} /> 
            :
            <>
               {result == null || result == undefined ? <tbody><tr><td className='no-data_table' colSpan={9}><div className='no-data_table-item'><span style={{marginRight: '10px'}} className="material-symbols-outlined">folder_off</span>Нет данных</div></td></tr></tbody>
               : 
               <tbody>
                    {Object
                        .keys(items)
                        .filter(key => (
                            items[key].login.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            items[key].first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            items[key].last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            items[key].phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            items[key].city.toLowerCase().includes(searchTerm.toLowerCase())
                            ))
                        .map((item) => {
                            return (
                                <tr key={items[item].id} className="table_body">
                                    <td
                                        style={{
                                        paddingLeft: '10px'
                                    }}
                                        className="table-body_item">{items[item].login}</td>
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
                                        style={{textAlign: 'center'}} className="table-body_item">
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
                                    <td className="table-body_item">{items[item].orders_count}</td>
                                    <td className="table-body_item">{items[item].bookings_count}</td>
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
                    </tbody>}
                </>
            }
            </table>
            <div className="pagination">
                <p className="pagination_text">
                    {page} из {totalPages}
                </p>
                {/* <button onClick={e => {prevPage(); pagino(page - 1)}} className={`pagination_page pagination_page--prev ${page === 1 && "disabled"}`}>
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
                    onClick={e => {nextPage(); pagino(page + 1)}}
                    className={`pagination_page pagination_page--next ${page === totalPages && "disabled"}`}>
                    <span style={{fontSize: '22px'}} className="material-symbols-outlined">arrow_forward_ios</span>
                </button> */}
            </div>
    </div>
    );

}

export default Users;