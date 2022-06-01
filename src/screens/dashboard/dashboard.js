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

const Dashboard = () => {
    const [users,
        setUsers] = useState()
    const [listings,
        setListings] = useState()
    const [finances,
        setFinances] = useState()

    // TODAY
    const [dataToday,
        setDataToday] = useState()
    const [dataFirstDayMonth,
        setDataFirstDayMonth] = useState()

    const [error,
        setError] = useState(false);
    const [loading,
        setLoading] = useState(true);

    const getDashboard = async() => {
        const waitTime = 5000;

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
        setTimeout(() => console.log("Request taking a long time"), waitTime);
        try {
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
                    setLoading(false);
                    console.log(response.data.activity[timeSpanFirstOfTheMonth], "RESPONSE");
                    setUsers(response.data.users);
                    setListings(response.data.listings);
                    setFinances(response.data.finances);
                    setDataToday(response.data.activity[timeSpanToday]);
                    setDataFirstDayMonth(response.data.activity[timeSpanFirstOfTheMonth]);
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
            getDashboard();
            // getDashboardToday();
        }, 1000);
    }, []);

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
            data: labels.map(() => faker.datatype.number({ min: 500, max: 100000 })),
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
        data: [30, 42, 28],
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
            {loading
                ? (<Loader/>)
                : error
                    ? (
                        <h2>Error fetching users</h2>
                    )
                    : (
                        <div>
                            <details open>
                                <summary>Пользователи</summary>
                                <DashboardCard
                                    items={[
                                    {
                                        icon: 'Profile',
                                        count: users.total_users,
                                        description: 'Активных пользователей'
                                    }, {
                                        icon: 'Close',
                                        count: users.not_confirmed_users,
                                        description: 'Не подтвержденных пользователей'
                                    }, {
                                        icon: 'Tick',
                                        count: users.confirmed_users,
                                        description: 'Подтвержденных пользователей'
                                    }, {
                                        icon: 'Clock',
                                        count: users.users_on_validation,
                                        description: 'Заявка на авторизацию'
                                    }, {
                                        icon: 'blocked-users',
                                        count: users.blocked_users,
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
                                        count: listings.total_listings,
                                        description: 'Объявлений всего'
                                    }, {
                                        icon: 'Activity',
                                        count: listings.active_listings,
                                        description: 'Активных объявлений'
                                    }, {
                                        icon: 'Clock',
                                        count: listings.listings_on_moderation,
                                        description: 'Объявлений на модерации'
                                    }, {
                                        icon: 'Folder',
                                        count: listings.archived_listings,
                                        description: 'Объявлений в архиве'
                                    }, {
                                        icon: 'Paper',
                                        count: listings.total_bookings,
                                        description: 'Заказов всего'
                                    }, {
                                        icon: 'Close',
                                        count: listings.canceled_bookings,
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
                                        count: finances.paid_bookings,
                                        description: 'Оплаченных заказов'
                                    }, {
                                        icon: 'Buy',
                                        count: finances.total_bookings_price,
                                        description: 'Сумма заказов (₽)'
                                    }, {
                                        icon: 'Wallet',
                                        count: finances.total_earned_by_owners,
                                        description: 'Заработано хозяевами (₽)'
                                    }, {
                                        icon: 'Discount',
                                        count: finances.paid_with_commission,
                                        description: 'Оплачено с комиссиями (₽)'
                                    }, {
                                        icon: 'Close',
                                        count: finances.paid_on_canceled_listings,
                                        description: 'Выплачено по отказам (₽)'
                                    }, {
                                        icon: 'Wallet',
                                        count: finances.net_profit,
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
                                        count: dataToday.new_users,
                                        description: 'Новых пользователей'
                                    }, {
                                        icon: 'PDocument',
                                        new: true,
                                        count: dataToday.new_listings,
                                        description: 'Новых объявлений'
                                    }, {
                                        icon: 'Paper',
                                        new: true,
                                        count: dataToday.new_bookings,
                                        description: 'Новых заказов'
                                    }, {
                                        icon: 'Clock',
                                        new: true,
                                        count: dataToday.bookings_on_confirmation,
                                        description: 'Заказов в ожидании'
                                    }, {
                                        icon: 'Close',
                                        new: true,
                                        count: dataToday.canceled_bookings,
                                        description: 'Отмененных заказов'
                                    }, {
                                        icon: 'Close',
                                        new: true,
                                        count: dataToday.paid_on_canceled,
                                        description: 'Выплачено по отказам (₽)'
                                    }, {
                                        icon: 'Graph',
                                        new: true,
                                        count: dataToday.paid_bookings,
                                        description: 'Оплаченных заказов'
                                    }, {
                                        icon: 'Buy',
                                        new: true,
                                        count: dataToday.bookings_total_price,
                                        description: 'Сумма заказов (₽)'
                                    }, {
                                        icon: 'Wallet',
                                        new: true,
                                        count: dataToday.earned_by_owners,
                                        description: 'Заработанно хозяевами (₽)'
                                    }, {
                                        icon: 'Discount',
                                        new: true,
                                        count: dataToday.paid_with_commissions,
                                        description: 'Оплачено с комиссиями (₽)'
                                    }, {
                                        icon: 'Wallet',
                                        new: true,
                                        count: dataToday.net_profit,
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
                                        count: dataFirstDayMonth.new_users,
                                        description: 'Новых пользователей'
                                    }, {
                                        icon: 'PDocument',
                                        new: true,
                                        count: dataFirstDayMonth.new_listings,
                                        description: 'Новых объявлений'
                                    }, {
                                        icon: 'Paper',
                                        new: true,
                                        count: dataFirstDayMonth.new_bookings,
                                        description: 'Новых заказов'
                                    }, {
                                        icon: 'Clock',
                                        new: true,
                                        count: dataFirstDayMonth.bookings_on_confirmation,
                                        description: 'Заказов в ожидании'
                                    }, {
                                        icon: 'Close',
                                        new: true,
                                        count: dataFirstDayMonth.canceled_bookings,
                                        description: 'Отмененных заказов'
                                    }, {
                                        icon: 'Close',
                                        new: true,
                                        count: dataFirstDayMonth.paid_on_canceled,
                                        description: 'Выплачено по отказам (₽)'
                                    }, {
                                        icon: 'Graph',
                                        new: true,
                                        count: dataFirstDayMonth.paid_bookings,
                                        description: 'Оплаченных заказов'
                                    }, {
                                        icon: 'Buy',
                                        new: true,
                                        count: dataFirstDayMonth.bookings_total_price,
                                        description: 'Сумма заказов (₽)'
                                    }, {
                                        icon: 'Wallet',
                                        new: true,
                                        count: dataFirstDayMonth.earned_by_owners,
                                        description: 'Заработанно хозяевами (₽)'
                                    }, {
                                        icon: 'Discount',
                                        new: true,
                                        count: dataFirstDayMonth.paid_with_commissions,
                                        description: 'Оплачено с комиссиями (₽)'
                                    }, {
                                        icon: 'Wallet',
                                        new: true,
                                        count: dataFirstDayMonth.net_profit,
                                        description: 'Чистой прибыли (₽)'
                                    }
                                ]}/>
                            </details>
                            <div className="dashboard_title">Прибыль</div>
                            <div className="dashboard_priceblock">
                                <div className="dashboard_priceblock-piechart">
                                    <Doughnut data={data} />
                                </div>
                                <div className="dashboard_priceblock-linechart">
                                <Line options={options} data={dataLine} />
                                </div>
                            </div>
                        </div>
                    )}
        </div>
    );
}

export default Dashboard;