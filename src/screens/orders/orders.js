import React, {useState, useEffect} from 'react'
import Filter, { FilterOrders } from '../../components/filter/filter';
import usePagination from "../../hooks/usePagination";
import { thousandSeparator } from '../dashboard/dashboard';
import { useSortableData } from '../users/users';
import DatePicker, { registerLocale } from "react-datepicker";
import Select from 'react-select'
import { LoadingCards, LoadingSkeletonTableOrders } from '../../components/loading-skeleton/loading-skeleton';
import { TableCard } from '../../components/table/table';
import ru from "date-fns/locale/ru"; // the locale you want
import './orders.css'
import "react-datepicker/dist/react-datepicker.css";
registerLocale("ru", ru);

const axios = require('axios').default;

const Orders = () => {
    const [result, setResult] = useState([]);
    const [resultStat, setResultStat] = useState([]);
    const [resultTotal, setResultTotal] = useState([]);
    const [cities, setCities] = useState([]);
    const [region, setRegion] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [dateRange, setDateRange] = useState([null, null]);
    const [startDate, endDate] = dateRange;
    const [showFilter, setShowFilter] = useState(false);
    const [loading, setLoading] = useState(true);
    const [loadingStats, setLoadingStats] = useState(true);

    useEffect(() => {
        getOrders();
        getOrdersStat();
        getRegions();
    }, []);

    const getOrders = (page) => {
        let filter, filterRes;

        if (region != '') {
            filterRes = `{"region": "${region}"}`
        }

        if (filterRes) {
            filterRes = filterRes.replace(/[`]+/g, '');
            filter = filterRes;
        }

            axios({
                method: "POST",
                url: "https://easytake.org/custom.php",
                data: {
                    type: 'get_dashboard_orders_list',
                    per_page: 50,
                    page: page ? page : 1,
                    filters: filter,
                    // filters: {
                    //     region: "151",
                    //     status: "paid",
                    //     date: {
                    //         "start_date": "2022-05-22",
                    //         "end_date": "2022-05-27"
                    //     }
                    // },
                
                },
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
            setLoadingStats(false);
        })
        .catch(function (error) {
            console.log('Error', error.message);
        });
};

    let regions = Object.values(cities).map(function(item, index) {
        const options = {index: index, value: item.term_id, label: item.name};
        return options;
      });

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
        contentPerPage: 50,
        count: resultTotal ?? 0
    });


    const customStyles = {
        option: (provided, state) => ({
          ...provided,
          margin: '4px 0px',
          padding: 5,
        //   color: '#000',
          color: state.isSelected ? 'white' : 'black',
          backgroungColor: state.isSelected ? 'blue' :'#B1DBFB',
          borderRadius: '8px',
        }),
        control: () => ({
          display: 'flex',
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

    const clear = () => {
        setShowFilter(!showFilter);
        getOrders();
    }

    const refresh = () => {
        if (region == '') {
            alert("Установите фильтры!");
        } else {
            setShowFilter(!showFilter);
            setLoading(true);
            getOrders();
        }
    }


    const pagino = (page) => {
        setLoading(true);
        getOrders(page);
    }

    const {items, requestSort, sortConfig} = useSortableData(result == null || result == undefined ? [] : Object.values(result));


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
                        <div>{showFilter ? 
                            <div className="filter filter-orders">
                            <div className='flex'>
                            <div style={{marginRight: '20px'}} className="filter_block">
                                <Select
                                    placeholder="Город"
                                    components={{ IndicatorSeparator:() => null }}
                                    options={regions}
                                    onChange={e => changeRegionFunc(e.value)}
                                    styles={customStyles}
                                />
                                <DatePicker
                                    locale={ru}
                                    selectsRange={true}
                                    startDate={startDate}
                                    endDate={endDate}
                                    onChange={(update) => {
                                        setDateRange(update);
                                    }}
                                    className='filter_date'
                                    // isClearable={true}
                                />
                                {/* <input className='filter_date' type="date" placeholder='date now' /> */}
                                <Select
                                    placeholder="Самые новые"
                                    components={{ IndicatorSeparator:() => null }}
                                    options={result}
                                    styles={customStyles}
                                />
                            </div>
                            <div className="filter_block">
                                <Select
                                    placeholder="Жилье"
                                    components={{ IndicatorSeparator:() => null }}
                                    options={result}
                                    styles={customStyles}
                                />
                                <Select
                                    placeholder="Оплачено"
                                    components={{ IndicatorSeparator:() => null }}
                                    options={result}
                                    styles={customStyles}
                                />
                            </div>
                            </div>
                            <div style={{justifyContent: 'end'}} className='filter_button-block'>
                                    <div style={{marginRight: '10px'}} onClick={clear} className='filter_button-block-btn filter_button-block-btn--reset'>Сбросить изменения</div>
                                    <div onClick={refresh} className='filter_button-block-btn'>Применить</div>
                                </div>
                            </div>
                         : null}</div>
                        </div>
                        <div className='table_input input'>
                            <input onChange={e => {setSearchTerm(e.target.value)}} className='input_text' placeholder='Поиск по имени, номеру или эл...'/>
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
              {loading ? <LoadingSkeletonTableOrders items={[{},{},{},{},{},{}]} /> 
              :
              <>
              {result == null || result == undefined ? <tbody><tr><td className='no-data_table' colSpan={9}><div className='no-data_table-item'><span style={{marginRight: '10px'}} className="material-symbols-outlined">folder_off</span>Нет данных</div></td></tr></tbody>
              : 
               <tbody>
                            {/* items[key].booking_author_last_name.toLowerCase().includes(searchTerm.toLowerCase()) || */}
                    {Object
                        .keys(items)
                        .filter(key => (
                            items[key].booking_author_login.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            items[key].booking_author_first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            items[key].booking_author_last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            items[key].booking_author_phone.toLowerCase().includes(searchTerm.toLowerCase())
                            ))
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
            </>
            }
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