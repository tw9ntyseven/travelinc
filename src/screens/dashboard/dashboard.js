import React, {useState, useEffect} from 'react'
import Loader from '../../components/loader/loader';
import './dashboard.css';
// import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import {
    Chart as ChartJS,
    ArcElement,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';
import { Doughnut, Line } from 'react-chartjs-2';
// import {Pie} from 'react-chartjs-2';
const { faker } = require('@faker-js/faker');
const axios = require('axios').default;

class Tabs extends React.Component{
    state ={
        activeTab: this.props.children[0].props.label
    }
    changeTab = (tab) => {

        this.setState({ activeTab: tab });
    };
    render(){

        let content;
        let buttons = [];
        return (
            <div className="dashboard_priceblock">
                {React.Children.map(this.props.children, child =>{
                    buttons.push(child.props.label)
                    if (child.props.label === this.state.activeTab) content = child.props.children
                })}

                <TabButtons activeTab={this.state.activeTab} buttons={buttons} changeTab={this.changeTab}/>
                <div className="dashboard_priceblock-charts">{content}</div>
            </div>
        );
    }
}

const TabButtons = ({buttons, changeTab, activeTab}) =>{

    return(
        <div className="dashboard_priceblock-tabs">
            {buttons.map((button) =>{
                return <button className={button === activeTab ? 'dashboard_priceblock-tabs-item--active' : 'dashboard_priceblock-tabs-item'} onClick={()=>changeTab(button)}>{button}</button>
            })}
        </div>
    )
}

const Tab = props =>{
    return(
        <React.Fragment>
            {props.children}
        </React.Fragment>
    )
}


const DashboardCard = ({items}) => {
    return (
        <div className='dashboard_block'>
            {items.map((item, index) => (
                <div key={index} className='dashboard_block-card'>
                    <img src={require(`../../assets/dashboard-icons/${item.icon}.svg`)}/>
                        <div className='dashboard_block-card-count flex'>{item.new
                                ? <div>+</div>
                                : null}{item.count}</div>
                        <div className='dashboard_block-card-description'>{item.description}</div>
                </div>
            ))}
        </div>
    );
}

    // FUNCTION FOR NUMBERS SEPARATE
   export const thousandSeparator = function(str) {
        var parts = (str + '').split('.'),
            main = parts[0],
            len = main.length,
            output = '',
            i = len - 1;
        
        while(i >= 0) {
            output = main.charAt(i) + output;
            if ((len - i) % 3 === 0 && i > 0) {
                output = ' ' + output;
            }
            --i;
        }
    
        if (parts.length > 1) {
            output += '.' + parts[1];
        }
        return output;
    };

const Dashboard = () => {

    const [error,
        setError] = useState(false);
    const [loading,
        setLoading] = useState(true);


                // TIME MANAGE
                let today = new Date();
                var dd = String(today.getDate()).padStart(2, '0');
                var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
                var yyyy = today.getFullYear();
                today = '"' + yyyy + '-' + mm + '-' + dd + '"';
        
                let firstDayMonth = new Date();
                var firstDay = new Date(firstDayMonth.getFullYear(), firstDayMonth.getMonth(), 1);
                var fdd = String(firstDay.getDate()).padStart(2, '0');
                var fmm = String(firstDay.getMonth() + 1).padStart(2, '0');
                firstDay = '"' + yyyy + '-' + fmm + '-' + fdd + '"';
        
                var spanToday = yyyy + '-' + mm + '-' + dd;
                var spanFirstDay = yyyy + '-' + fmm + '-' + fdd;
                var timeSpanToday = `${spanToday} - ${spanToday}`;
                var timeSpanFirstOfTheMonth = `${spanFirstDay} - ${spanToday}`;
    const getDashboard = async() => {

            await axios({
                method: "POST",
                url: "https://easytake.org/custom.php",
                data: {
                    type: 'get_dashboard_stat',
                    activity_periods: `[{"from": ${today},"to": ${today}}, {"from": ${firstDay},"to": ${today}}]`
                },
                    // activity_periods: [{"from":"2022-05-01","to":"2022-05-31"}],
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                })
                .then(function (response) {
                    //handle success

                    localStorage.setItem("dashboardUsers", JSON.stringify(response.data.users));
                    localStorage.setItem("dashboardListings", JSON.stringify(response.data.listings));
                    localStorage.setItem("dashboardFinances", JSON.stringify(response.data.finances));
                    localStorage.setItem("dashboardDataToday", JSON.stringify(response.data.activity[timeSpanToday]));
                    localStorage.setItem("dashboardDataFirstDayMonth", JSON.stringify(response.data.activity[timeSpanFirstOfTheMonth]));
                    setLoading(false);

                    console.log(response, "Dashboard");

                    // setUsers(response.data.users);
                    // setListings(response.data.listings);
                    // setFinances(response.data.finances);
                    // setDataToday(response.data.activity[timeSpanToday]);
                    // setDataFirstDayMonth(response.data.activity[timeSpanFirstOfTheMonth]);
                })
                .catch(function (response) {
                    //handle error
                    setError(true);
                    console.log(response.err);
                });
    };


    const getDashboardProfitToday = async() => {
        // console.log(profitToday, "profitToday");
        await axios({
            method: "POST",
            url: "https://easytake.org/custom.php",
            data: {
                type: 'get_dashboard_profit',
                filters: `
                { 
                    "date": [
                            {
                             "start_date": ${today},
                             "end_date": ${today} 
                          }
                     ]
                 }
                 `
            },
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            })
            .then(function (response) {
                setLoading(false);
                // setResultStat(response.data)
                console.log(response.data[timeSpanToday], "TODAY");
                localStorage.setItem("dataDashboardProfitToday", JSON.stringify(response.data[timeSpanToday]));
            })
            .catch(function (response) {
                setError(true);
                console.log(response.err);
            });
};

    getDashboard();
    getDashboardProfitToday();
    useEffect(() => {
        setTimeout(async() => {
            await getDashboard();
            await getDashboardProfitToday();  
        }, 0);
    }, []);

    const dashboardUsers = JSON.parse(localStorage.getItem("dashboardUsers"));
    const dashboardListings = JSON.parse(localStorage.getItem("dashboardListings"));
    const dashboardFinances = JSON.parse(localStorage.getItem("dashboardFinances"));
    const dashboardDataToday = JSON.parse(localStorage.getItem("dashboardDataToday"));
    const dashboardDataFirstDayMonth = JSON.parse(localStorage.getItem("dashboardDataFirstDayMonth"));
    const dashboardProfitToday = JSON.parse(localStorage.getItem("dataDashboardProfitToday"));
    console.log(dashboardProfitToday, "dashboardProfitToday");
    if (dashboardUsers || dashboardListings || dashboardFinances || dashboardDataToday || dashboardDataFirstDayMonth || dashboardProfitToday === null) {
        console.log("data is null");
    };
    // DATA FOR LINECHART
    ChartJS.register(
        CategoryScale,
        LinearScale,
        PointElement,
        LineElement,
        Title,
        Tooltip,
        Legend
      );
      
      const options = {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: '',
          },
        },
      };
      
      const labels = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль'];
      
      const dataLine = {
        labels,
        datasets: [
          {
            label: 'Жилье',
            data: labels.map(() => faker.datatype.number({ min: 500, max: 100000 })),
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
          },
          {
            label: 'Авто',
            data: [500, 1000, 1500, 22000, 25000, 30100, 3500],
            borderColor: 'rgb(53, 162, 235)',
            backgroundColor: 'rgba(53, 162, 235, 0.5)',
          },
          {
            label: 'Туризм',
            data: labels.map(() => faker.datatype.number({ min: 500, max: 100000 })),
            borderColor: 'rgba(255, 127, 80, 1)',
            backgroundColor: 'rgba(255, 165, 0, 0.2)',
          },
        ],
      };

    // DATA FOR PIE CHART
    ChartJS.register(ArcElement, Tooltip, Legend);
    const data = {
    labels: ['Жилье', 'Авто', 'Туризм'],
    datasets: [
        {
        label: '# of Votes',
        data: [dashboardProfitToday.house, dashboardProfitToday.car, dashboardProfitToday.activity],
        backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)',
        ],
        borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
        },
    ],
    };


    return (
        <div className='dashboard'>
        
                            <details open>
                                <summary>Пользователи</summary>
                                <DashboardCard
                                    items={[
                                    {
                                        icon: 'Profile',
                                        count: thousandSeparator(dashboardUsers.total_users),
                                        description: 'Активных пользователей'
                                    }, {
                                        icon: 'Close',
                                        count: thousandSeparator(dashboardUsers.not_confirmed_users),
                                        description: 'Не подтвержденных пользователей'
                                    }, {
                                        icon: 'Tick',
                                        count: thousandSeparator(dashboardUsers.confirmed_users),
                                        description: 'Подтвержденных пользователей'
                                    }, {
                                        icon: 'Clock',
                                        count: thousandSeparator(dashboardUsers.users_on_validation),
                                        description: 'Заявка на авторизацию'
                                    }, {
                                        icon: 'blocked-users',
                                        count: thousandSeparator(dashboardUsers.blocked_users),
                                        description: 'Заблокированных пользователей'
                                    }
                                ]}/>
                            </details>

                            <details open>
                                <summary>Заказы</summary>
                                <DashboardCard
                                    items={[
                                    {
                                        icon: 'Document',
                                        count: thousandSeparator(dashboardListings.total_listings),
                                        description: 'Объявлений всего'
                                    }, {
                                        icon: 'Activity',
                                        count: thousandSeparator(dashboardListings.active_listings),
                                        description: 'Активных объявлений'
                                    }, {
                                        icon: 'Clock',
                                        count: thousandSeparator(dashboardListings.listings_on_moderation),
                                        description: 'Объявлений на модерации'
                                    }, {
                                        icon: 'Folder',
                                        count: thousandSeparator(dashboardListings.archived_listings),
                                        description: 'Объявлений в архиве'
                                    }, {
                                        icon: 'Paper',
                                        count: thousandSeparator(dashboardListings.total_bookings),
                                        description: 'Заказов всего'
                                    }, {
                                        icon: 'Close',
                                        count: thousandSeparator(dashboardListings.canceled_bookings),
                                        description: 'Отмененных заказов'
                                    }
                                ]}/>
                            </details>

                            <details open>
                                <summary>Финансы</summary>
                                <DashboardCard
                                    items={[
                                    {
                                        icon: 'Graph',
                                        count: thousandSeparator(dashboardFinances.paid_bookings),
                                        description: 'Оплаченных заказов'
                                    }, {
                                        icon: 'Buy',
                                        count: thousandSeparator(dashboardFinances.total_bookings_price),
                                        description: 'Сумма заказов (₽)'
                                    }, {
                                        icon: 'Wallet',
                                        count: thousandSeparator(dashboardFinances.total_earned_by_owners),
                                        description: 'Заработано хозяевами (₽)'
                                    }, {
                                        icon: 'Discount',
                                        count: thousandSeparator(dashboardFinances.paid_with_commission),
                                        description: 'Оплачено с комиссиями (₽)'
                                    }, {
                                        icon: 'Close',
                                        count: thousandSeparator(dashboardFinances.paid_on_canceled_listings),
                                        description: 'Выплачено по отказам (₽)'
                                    }, {
                                        icon: 'Wallet',
                                        count: thousandSeparator(dashboardFinances.net_profit),
                                        description: 'Чистой прибыли (₽)'
                                    }
                                ]}/>
                            </details>

                            <details open>
                                <summary>Сегодня</summary>
                                <DashboardCard
                                    items={[
                                    {
                                        icon: 'Profile',
                                        new: true,
                                        count: thousandSeparator(dashboardDataToday.new_users),
                                        description: 'Новых пользователей'
                                    }, {
                                        icon: 'PDocument',
                                        new: true,
                                        count: thousandSeparator(dashboardDataToday.new_listings),
                                        description: 'Новых объявлений'
                                    }, {
                                        icon: 'Paper',
                                        new: true,
                                        count: thousandSeparator(dashboardDataToday.new_bookings),
                                        description: 'Новых заказов'
                                    }, {
                                        icon: 'Clock',
                                        new: true,
                                        count: thousandSeparator(dashboardDataToday.bookings_on_confirmation),
                                        description: 'Заказов в ожидании'
                                    }, {
                                        icon: 'Close',
                                        new: true,
                                        count: thousandSeparator(dashboardDataToday.canceled_bookings),
                                        description: 'Отмененных заказов'
                                    }, {
                                        icon: 'Close',
                                        new: true,
                                        count: thousandSeparator(dashboardDataToday.paid_on_canceled),
                                        description: 'Выплачено по отказам (₽)'
                                    }, {
                                        icon: 'Graph',
                                        new: true,
                                        count: thousandSeparator(dashboardDataToday.paid_bookings),
                                        description: 'Оплаченных заказов'
                                    }, {
                                        icon: 'Buy',
                                        new: true,
                                        count: thousandSeparator(dashboardDataToday.bookings_total_price),
                                        description: 'Сумма заказов (₽)'
                                    }, {
                                        icon: 'Wallet',
                                        new: true,
                                        count: thousandSeparator(dashboardDataToday.earned_by_owners),
                                        description: 'Заработанно хозяевами (₽)'
                                    }, {
                                        icon: 'Discount',
                                        new: true,
                                        count: thousandSeparator(dashboardDataToday.paid_with_commissions),
                                        description: 'Оплачено с комиссиями (₽)'
                                    }, {
                                        icon: 'Wallet',
                                        new: true,
                                        count: thousandSeparator(dashboardDataToday.net_profit),
                                        description: 'Чистой прибыли (₽)'
                                    }
                                ]}/>
                            </details>

                            {/* dataFirstDayMonth */}
                            <details open>
                                <summary>С начала месяца</summary>
                                <DashboardCard
                                    items={[
                                    {
                                        icon: 'Profile',
                                        new: true,
                                        count: thousandSeparator(dashboardDataFirstDayMonth.new_users),
                                        description: 'Новых пользователей'
                                    }, {
                                        icon: 'PDocument',
                                        new: true,
                                        count: thousandSeparator(dashboardDataFirstDayMonth.new_listings),
                                        description: 'Новых объявлений'
                                    }, {
                                        icon: 'Paper',
                                        new: true,
                                        count: thousandSeparator(dashboardDataFirstDayMonth.new_bookings),
                                        description: 'Новых заказов'
                                    }, {
                                        icon: 'Clock',
                                        new: true,
                                        count: thousandSeparator(dashboardDataFirstDayMonth.bookings_on_confirmation),
                                        description: 'Заказов в ожидании'
                                    }, {
                                        icon: 'Close',
                                        new: true,
                                        count: thousandSeparator(dashboardDataFirstDayMonth.canceled_bookings),
                                        description: 'Отмененных заказов'
                                    }, {
                                        icon: 'Close',
                                        new: true,
                                        count: thousandSeparator(dashboardDataFirstDayMonth.paid_on_canceled),
                                        description: 'Выплачено по отказам (₽)'
                                    }, {
                                        icon: 'Graph',
                                        new: true,
                                        count: thousandSeparator(dashboardDataFirstDayMonth.paid_bookings),
                                        description: 'Оплаченных заказов'
                                    }, {
                                        icon: 'Buy',
                                        new: true,
                                        count: thousandSeparator(dashboardDataFirstDayMonth.bookings_total_price),
                                        description: 'Сумма заказов (₽)'
                                    }, {
                                        icon: 'Wallet',
                                        new: true,
                                        count: thousandSeparator(dashboardDataFirstDayMonth.earned_by_owners),
                                        description: 'Заработанно хозяевами (₽)'
                                    }, {
                                        icon: 'Discount',
                                        new: true,
                                        count: thousandSeparator(dashboardDataFirstDayMonth.paid_with_commissions),
                                        description: 'Оплачено с комиссиями (₽)'
                                    }, {
                                        icon: 'Wallet',
                                        new: true,
                                        count: thousandSeparator(dashboardDataFirstDayMonth.net_profit),
                                        description: 'Чистой прибыли (₽)'
                                    }
                                ]}/>
                            </details>
                            <div className="dashboard_title">Прибыль</div>
                                {/*<div className="dashboard_priceblock-tabs">*/}
                                {/*    <div className="dashboard_priceblock-tabs-item">За день</div>*/}
                                {/*    <div className="dashboard_priceblock-tabs-item">За неделю</div>*/}
                                {/*    <div className="dashboard_priceblock-tabs-item">За месяц</div>*/}
                                {/*    <div className="dashboard_priceblock-tabs-item">За все время</div>*/}
                                {/*</div>*/}
                                <Tabs>
                                    <Tab className="dashboard_priceblock-tabs-item" label="За день">
                                            {/*<div className="dashboard_priceblock-piechart">*/}
                                            {/*    <Doughnut data={data} />*/}
                                            {/*</div>*/}
                                        <div className="dashboard_priceblock-piechart">
                                            <Doughnut data={data} />
                                        </div>
                                    </Tab>
                                    <Tab label="За неделю">
                                    <div className="dashboard_priceblock-linechart">
                                                <Line options={options} data={dataLine} />
                                            </div>
                                    </Tab>
                                    <Tab label="За месяц">
                                        3
                                    </Tab>
                                    <Tab label="За все время">
                                        4
                                    </Tab>
                                </Tabs>
                                {/*<div className="dashboard_priceblock-charts">*/}
                                {/*    /!*<div className="dashboard_priceblock-piechart">*!/*/}
                                {/*    /!*    <Doughnut data={data} />*!/*/}
                                {/*    /!*</div>*!/*/}
                                {/*    <div className="dashboard_priceblock-linechart">*/}
                                {/*    <Line options={options} data={dataLine} />*/}
                                {/*    </div>*/}
                                {/*</div>*/}
                        </div>
    );
}



export default Dashboard;