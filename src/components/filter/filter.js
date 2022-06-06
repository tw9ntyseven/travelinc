import React, {useEffect, useState} from 'react'
import './filter.css'
import Select from 'react-select'
import { Checkbox, CheckboxGroup } from '@trendmicro/react-checkbox';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import '@trendmicro/react-checkbox/dist/react-checkbox.css';
const axios = require('axios').default;

const Filter = () => {
const [res, setRes] = useState([]);

    const getRegions = async() => {
        const waitTime = 5000;
        setTimeout(() => console.log("Request taking a long time"), waitTime);
        try {
            await axios({
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
                    //handle success
                    console.log(response.data, "CITIES");
                    // setLoading(false);
                    setRes(response.data);
                })
                .catch(function (response) {
                    //handle error
                    // setError(true);
                    console.log(response.err);
                });
        } catch (error) {
            console.log("FAIL!", error.message);
        }
    };

    useEffect(() => {
        setTimeout(() => {
            getRegions();
        }, 1000);
    }, []);

    // for (let value of Object.entries(res)) {
    //     console.log(value.name, "CITIES NAME");
    // }
    // console.log(Object.values(res));
    // const options = [];
    // Object.values(res).forEach((item, index, arr) => {
    //     console.log(item.name, "FOREACH");
    // })
    let result = Object.values(res).map(function(item, index) {
        const options = {value: item.slug, label: item.name};
        return options;
      });

    // var obj = {};
    // obj["value"] = options.label;
    // obj["label"] = options.value;
    // options.push(obj);

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
    return (
        <div className='filter'>
             <Select
                placeholder="Город"
                components={{ IndicatorSeparator:() => null }}
                options={result}
                styles={customStyles}
            />
            <div className='filter_checkbox-block'>
            <div className='filter_checkbox-column'>
                <Checkbox className="filter_checkbox-column-item" label="Подтвержденные" />
                <Checkbox className="filter_checkbox-column-item" label="Не подтвержденные" />
                <Checkbox className="filter_checkbox-column-item" label="На проверке" />
                <Checkbox className="filter_checkbox-column-item" label="С объявлениями" />
            </div>
            <div className='filter_checkbox-column'>
                <Checkbox className="filter_checkbox-column-item" label="Без объявлений" />
                <Checkbox className="filter_checkbox-column-item" label="С заказами" />
                <Checkbox className="filter_checkbox-column-item" label="С бронями" />
            </div>
            </div>
            <div className='filter_button-block'>
                <div className='filter_button-block-btn'>Применить</div>
            </div>
        </div>
    );
}

export const FilterOrders = () => {
    const [res, setRes] = useState([]);
    const [dateRange, setDateRange] = useState([null, null]);
    const [startDate, endDate] = dateRange;

    const getRegions = async() => {
        const waitTime = 5000;
        setTimeout(() => console.log("Request taking a long time"), waitTime);
        try {
            await axios({
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
                    //handle success
                    console.log(response.data, "CITIES");
                    // setLoading(false);
                    setRes(response.data);
                })
                .catch(function (response) {
                    //handle error
                    // setError(true);
                    console.log(response.err);
                });
        } catch (error) {
            console.log("FAIL!", error.message);
        }
    };

    useEffect(() => {
        setTimeout(() => {
            getRegions();
        }, 1000);
    }, []);

    let result = Object.values(res).map(function(item, index) {
        const options = {value: item.slug, label: item.name};
        return options;
      });


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
    return (
        <div className="filter filter-orders">
        <div style={{marginRight: '20px'}} className="filter_block">
            <Select
                placeholder="Город"
                components={{ IndicatorSeparator:() => null }}
                options={result}
                styles={customStyles}
            />
            <DatePicker
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
    );
}




export const FilterFinances = () => {
    const [res, setRes] = useState([]);

    const getRegions = async() => {
        const waitTime = 5000;
        setTimeout(() => console.log("Request taking a long time"), waitTime);
        try {
            await axios({
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
                    //handle success
                    console.log(response.data, "CITIES");
                    // setLoading(false);
                    setRes(response.data);
                })
                .catch(function (response) {
                    //handle error
                    // setError(true);
                    console.log(response.err);
                });
        } catch (error) {
            console.log("FAIL!", error.message);
        }
    };

    useEffect(() => {
        setTimeout(() => {
            getRegions();
        }, 1000);
    }, []);

    let result = Object.values(res).map(function(item, index) {
        const options = {value: item.slug, label: item.name};
        return options;
      });


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
    return (
        <div className="filter filter-orders">
        <div style={{marginRight: '20px'}} className="filter_block">
            <Select
                placeholder="Город"
                components={{ IndicatorSeparator:() => null }}
                options={result}
                styles={customStyles}
            />
            <input className='filter_date' type="date" placeholder='date now' />
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
    );
}

export default Filter;