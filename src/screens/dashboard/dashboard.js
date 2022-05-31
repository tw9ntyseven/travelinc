import React, {useState, useEffect} from 'react'
import Loader from '../../components/loader/loader';
import './dashboard.css';
const axios = require('axios').default;


const DashboardCard = ({items}) => {
    return (
        <div className='dashboard_block'>
            {items.map((item, index) => (
                <div key={index} className='dashboard_block-card'>
                    <img src={require(`../../assets/dashboard-icons/${item.icon}.svg`)}/>
                    <div className='dashboard_block-card-count'>{item.count}</div>
                    <div className='dashboard_block-card-description'>{item.description}</div>
                </div>
            ))}
        </div>
    );
}

const Dashboard = () => {
    const [users, setUsers] = useState()
    const [listings, setListings] = useState()
    const [finances, setFinances] = useState()

    // TODAY
    const [usersToday, setUsersToday] = useState()
    const [listingsToday, setListingsToday] = useState()
    const [financesToday, setFinancesToday] = useState()

    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);

    const getDashboard = async() => {
        const waitTime = 5000;
    //     var today = new Date();
    //     var dd = String(today.getDate()).padStart(2, '0');
    //     var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    //     var yyyy = today.getFullYear();

    //     today ='"' + yyyy + '-' + mm + '-' + dd + '"';
        setTimeout(() => console.log("Request taking a long time"), waitTime);
        try {
            await axios({
                method: "POST",
                url: "https://easytake.org/custom.php",
                data: {
                    type: 'get_dashboard_stat',
                    activity_periods: '[{"from":"2022-05-01","to":"2022-05-31"}]',
                },
                // activity_periods: [{"from":"2022-05-01","to":"2022-05-31"}],
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                })
                .then(function (response) {
                    //handle success
                    setLoading(false);
                    console.log(response.data.activity, "RESPONSE");
                    setUsers(response.data.users);
                    setListings(response.data.listings);
                    setFinances(response.data.finances);
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


//    console.log(listings.total_listings, "TOT");

    return (
        <div className='dashboard'>
          {loading ? (
        ''
      ) : error ? (
        <h2>Error fetching users</h2>
      ) : (
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
            )}
            {loading ? (
        ''
      ) : error ? (
        <h2>Error fetching users</h2>
      ) : (
            <details open>
                <summary>Заказы</summary>
                <DashboardCard
                    items={[
                    {
                        icon: 'Document',
                        count: listings.total_listings,
                        description: 'Объявлений всего'
                    },
                     {
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
            )}

            {loading ? (
        ''
      ) : error ? (
        <h2>Error fetching users</h2>
      ) : (
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
            )}
            {loading ? (
        ''
      ) : error ? (
        <h2>Error fetching users</h2>
      ) : (
            <details open>
                <summary>Сегодня</summary>
                <DashboardCard
                    items={[
                    {
                        icon: 'Profile',
                        count: '+7',
                        description: 'Новых пользователей'
                    }, {
                        icon: 'PDocument',
                        count: '+8',
                        description: 'Новых объявлений'
                    }, {
                        icon: 'Paper',
                        count: '+38',
                        description: 'Новых заказов'
                    }, {
                        icon: 'Clock',
                        count: '+8',
                        description: 'Заказов в ожидании'
                    }, {
                        icon: 'Close',
                        count: '+3',
                        description: 'Отмененных заказов'
                    }, {
                        icon: 'Close',
                        count: '+2 000',
                        description: 'Выплачено по отказам (₽)'
                    }, {
                        icon: 'Graph',
                        count: '+12',
                        description: 'Оплаченных заказов'
                    }, {
                        icon: 'Buy',
                        count: '+12 000',
                        description: 'Сумма заказов (₽)'
                    }, {
                        icon: 'Wallet',
                        count: '+108 000',
                        description: 'Заработанно хозяевами (₽)'
                    }, {
                        icon: 'Discount',
                        count: '+12 000',
                        description: 'Оплачено с комиссиями (₽)'
                    }, {
                        icon: 'Wallet',
                        count: '+6 000',
                        description: 'Чистой прибыли (₽)'
                    }
                ]}/>
            </details>
            )}

            <details open>
                <summary>С начала месяца</summary>
                <DashboardCard
                    items={[
                    {
                        icon: 'Profile',
                        count: '+7',
                        description: 'Новых пользователей'
                    }, {
                        icon: 'PDocument',
                        count: '+8',
                        description: 'Новых объявлений'
                    }, {
                        icon: 'Paper',
                        count: '+38',
                        description: 'Новых заказов'
                    }, {
                        icon: 'Clock',
                        count: '+8',
                        description: 'Заказов в ожидании'
                    }, {
                        icon: 'Close',
                        count: '+3',
                        description: 'Отмененных заказов'
                    }, {
                        icon: 'Close',
                        count: '+2 000',
                        description: 'Выплачено по отказам (₽)'
                    }, {
                        icon: 'Graph',
                        count: '+12',
                        description: 'Оплаченных заказов'
                    }, {
                        icon: 'Buy',
                        count: '+12 000',
                        description: 'Сумма заказов (₽)'
                    }, {
                        icon: 'Wallet',
                        count: '+108 000',
                        description: 'Заработанно хозяевами (₽)'
                    }, {
                        icon: 'Discount',
                        count: '+12 000',
                        description: 'Оплачено с комиссиями (₽)'
                    }, {
                        icon: 'Wallet',
                        count: '+6 000',
                        description: 'Чистой прибыли (₽)'
                    }
                ]}/>
            </details>
        </div>
    );
}

export default Dashboard;