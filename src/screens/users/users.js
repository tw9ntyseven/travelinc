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
    const [loading, setLoading] = useState(true);
    const [loadingTable, setLoadingTable] = useState(true);
    const [showFilter, setShowFilter] = useState(false);
    const [value, setValue] = useState();

    useEffect(() => {
        getUserStats();
        getUsers();
        getRegions();
    }, []);


    const getUsers = () => {
        let filtersRegion, filtersStatus;
        // if (region == '') {
        //     filtersRegion = `"region": "${region}"`
        //     filtersRegion = filtersRegion.replace(/[`]+/g, '');
        // }
        // if (status == '') {
        //     filtersStatus = `"status": "${status}"`
        //     filtersStatus = filtersStatus.replace(/[`]+/g, '');
        // }
        if (region != '' || status != '') {
            filtersRegion = `"region": "${region}"`
            filtersRegion = filtersRegion.replace(/[`]+/g, '');
            console.log(filtersRegion, 'filtersRegion');

            filtersStatus = `"status": "${status}"`
            filtersStatus = filtersStatus.replace(/[`]+/g, '');
            console.log(filtersStatus, 'filtersStatus');
        }

            axios({
                method: "POST",
                url: "https://easytake.org/custom.php",
                data: {
                    type: 'get_dashboard_users_list',
                    per_page: 50,
                    page: page,
                    filters: `{${filtersRegion}, ${filtersStatus}}`,
                },
                headers: {
                    "Content-Type": "multipart/form-data"
                }
                })
                .then(function (response) {
                    setResultTotal(response.data);
                    setResult(response.data.users);        
                    setLoadingTable(false);
                    console.log(response, "RESPONSE");
                })
                .catch(function (response) {
                    console.log(response.err);
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
                    console.log(response, "RESPONSE STATS");
                })
                .catch(function (response) {
                    console.log(response.err);
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
            .catch(function (response) {
                console.log(response.err);
            });
    };

    let regions = Object.values(cities).map(function(item, index) {
        const options = {index: index, value: item.slug, label: item.name};
        return options;
    });

    const changeRegionFunc = (region) => {
        setRegion(region);
    }


  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      margin: '4px 0px',
      padding: 5,
      color: '#000',
      color: state.isSelected ? 'white' : 'black',
      backgroungColor: state.isSelected ? 'blue' :'#B1DBFB',
      borderRadius: '8px',
    }),
    control: () => ({
      display: 'flex',
      border: 0,
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
        count: Object.keys(result).length,
    });

    const checkBoxOnValidation = useCallback(
      (e) => {
        setStatus("on_validation");
      }, [""],
    )
    const checkBoxConfirmed = useCallback(
        (e) => {
          setStatus("confirmed");
        }, [""],
      )
      const checkBoxNotConfirmed = useCallback(
        (e) => {
          setStatus("not_confirmed");
        }, [""],
      )

    // contentPerPage: resultTotal.per_page,
    // count: resultTotal.total_users_count,
    const refresh = () => {
        setShowFilter(!showFilter);
        setLoadingTable(true);
        getUsers();
    }
    const pagino = () => {
        setLoadingTable(true);
        getUsers();
    }

    const {items, requestSort, sortConfig} = useSortableData(Object.values(result));
  
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
                                    placeholder="Город"
                                    components={{ IndicatorSeparator:() => null }}
                                    options={regions}
                                    onChange={e => changeRegionFunc(e.label)}
                                    styles={customStyles}
                                />
                                <div className='filter_checkbox-block'>
                                <div className='filter_checkbox-column'>
                                    <Checkbox onChange={checkBoxConfirmed} className="filter_checkbox-column-item" label="Подтвержденные" />
                                    <Checkbox onChange={checkBoxNotConfirmed} className="filter_checkbox-column-item" label="Не подтвержденные" />
                                    <Checkbox onChange={checkBoxOnValidation} className="filter_checkbox-column-item" label="На проверке" />
                                    <Checkbox className="filter_checkbox-column-item" label="С объявлениями" />
                                </div>
                                <div className='filter_checkbox-column'>
                                    <Checkbox className="filter_checkbox-column-item" label="Без объявлений" />
                                    <Checkbox className="filter_checkbox-column-item" label="С заказами" />
                                    <Checkbox className="filter_checkbox-column-item" label="С бронями" />
                                </div>
                                </div>
                                <div className='filter_button-block'>
                                    <div onClick={refresh} className='filter_button-block-btn'>Применить</div>
                                </div>
                            </div>
                        : null}</div>
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
            {loadingTable ? <LoadingSkeletonTable /> :
               <tbody>
                    {Object
                        .keys(items)
                        .slice(firstContentIndex, lastContentIndex)
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
                </tbody>
                        }
            </table>

            <div className="pagination">
                <p className="pagination_text">
                    {page} из {totalPages}
                </p>
                <button onClick={() => {pagino(); prevPage();}} className={`pagination_page pagination_page--prev ${page === 1 && "disabled"}`}>
                <span style={{fontSize: '22px'}} className="material-symbols-outlined">arrow_back_ios_new</span>
                </button>
                {[...Array(totalPages).keys()].map((el) => (
                    <button
                        onClick={() => {pagino(); setPage(el + 1);}}
                        key={el}
                        className={`pagination_page ${page === el + 1
                        ? "active"
                        : ""}`}>
                        {el + 1}
                    </button>
                ))}
                <button
                    onClick={() => {pagino(); nextPage();}}
                    className={`pagination_page pagination_page--next ${page === totalPages && "disabled"}`}>
                    <span style={{fontSize: '22px'}} className="material-symbols-outlined">arrow_forward_ios</span>
                </button>
            </div>

        </div>
    );

}

export default Users;