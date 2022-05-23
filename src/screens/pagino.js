import { useEffect, useState } from "react";
// import logo from "./logo.svg";
// import axios from "axios";
import usePagination from "../hooks/usePagination";

function AppPagino() {
  const [people, setPeople] = useState([
    {
        login: 'iviv',
        img: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?crop=entropy&cs=tinysrgb&fm=jpg&ixlib=rb-1.2.1&q=80&raw_url=true&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387",
        userName: 'Иванов Иван',
        phone: '+7(978)505-35-55',
        status: 'confirmed',
        orders: 31,
        booking: 3,
        activeOrders: 0,
        city: 'Москва',
        rating: '5.0',
    },
    {
        login: 'alex',
        img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?crop=entropy&cs=tinysrgb&fm=jpg&ixlib=rb-1.2.1&q=80&raw_url=true&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387",
        userName: 'Александр Петров',
        phone: '+7(978)111-55-25',
        status: 'waitingConfirmed',
        orders: 0,
        booking: 2,
        activeOrders: 0,
        city: 'Санк-Петербург',
        rating: '--.--',
    },
    {
        login: 'petrer',
        img: "",
        userName: 'Петр Захаров',
        phone: '+7(978)100-10-05',
        status: 'confirmed',
        orders: 100,
        booking: 5,
        activeOrders: 10,
        city: 'Краснодар',
        rating: '5.0',
    },
    {
        login: 'robert',
        img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?crop=entropy&cs=tinysrgb&fm=jpg&ixlib=rb-1.2.1&q=80&raw_url=true&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387",
        userName: 'Роберт Уильямс',
        phone: 'Нет телефона',
        status: 'blocked',
        orders: 0,
        booking: 0,
        activeOrders: 0,
        city: 'Лондон',
        rating: '--.--',
    },
    {
        login: 'iman',
        img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?crop=entropy&cs=tinysrgb&fm=jpg&ixlib=rb-1.2.1&q=80&raw_url=true&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387",
        userName: 'Иммануил Кант',
        phone: '+7(978)900-90-01',
        status: 'notСonfirmed',
        orders: 0,
        booking: 1,
        activeOrders: 0,
        city: 'Краснодар',
        rating: '--.--',
    },
    {
        login: 'gleb',
        img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?crop=entropy&cs=tinysrgb&fm=jpg&ixlib=rb-1.2.1&q=80&raw_url=true&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387",
        userName: 'Глеб Гончаров',
        phone: '+7(978)140-18-15',
        status: 'notСonfirmed',
        orders: 0,
        booking: 0,
        activeOrders: 0,
        city: 'Краснодар',
        rating: '--.--',
    },
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const {
    firstContentIndex,
    lastContentIndex,
    nextPage,
    prevPage,
    page,
    setPage,
    totalPages,
  } = usePagination({
    contentPerPage: 3,
    count: people.length,
  });
//   useEffect(() => {
//     (async () => {
//       try {
//         const data = await axios.get(
//           "https://random-data-api.com/api/users/random_user?size=20"
//         );
//         setPeople(data.data);
//       } catch {
//         setError(true);
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, []);
  return (
    <div className="App">
      {/* {loading ? (
        <h2>Loading...</h2>
      ) : error ? (
        <h2>Error fetching users</h2>
      ) : ( */}
        <>
          <div className="pagination">
            <p className="text">
              {page}/{totalPages}
            </p>
            <button
              onClick={prevPage}
              className={`page ${page === 1 && "disabled"}`}
            >
              &larr;
            </button>
            {/* @ts-ignore */}
            {[...Array(totalPages).keys()].map((el) => (
              <button
                onClick={() => setPage(el + 1)}
                key={el}
                className={`page ${page === el + 1 ? "active" : ""}`}
              >
                {el + 1}
              </button>
            ))}
            <button
              onClick={nextPage}
              className={`page ${page === totalPages && "disabled"}`}
            >
              &rarr;
            </button>
          </div>
          <table className="table">
        <thead className="table_head">
          <tr>
            <th style={{paddingLeft: '10px'}}>
              <button
                type="button"
                // onClick={() => requestSort('login')}
                className='table_title'
              >
                Логин
                <span class="material-symbols-outlined">arrow_drop_down</span>
              </button>
            </th>
            <th>
              <button
                type="button"
                // onClick={() => requestSort('userName')}
                className='table_title'
              >
                Имя пользователя
                <span class="material-symbols-outlined">arrow_drop_down</span>
              </button>
            </th>
            <th>
              <button
                type="button"
                // onClick={() => requestSort('phone')}
                className='table_title'
              >
                Телефон
                <span class="material-symbols-outlined">arrow_drop_down</span>
              </button>
            </th>
            <th>
              <button
                type="button"
                // onClick={() => requestSort('status')}
                className='table_title'
              >
                Статус
                <span class="material-symbols-outlined">arrow_drop_down</span>
              </button>
            </th>
            <th>
              <button
                type="button"
                // onClick={() => requestSort('orders')}
                className='table_title'
              >
                Заказы
                <span class="material-symbols-outlined">arrow_drop_down</span>
              </button>
            </th>
            <th>
              <button
                type="button"
                // onClick={() => requestSort('booking')}
                className='table_title'
              >
                Брони
                <span class="material-symbols-outlined">arrow_drop_down</span>
              </button>
            </th>
            <th>
              <button
                type="button"
                // onClick={() => requestSort('activeOrders')}
                className='table_title'
              >
                Акт. объ.
                <span class="material-symbols-outlined">arrow_drop_down</span>
              </button>
            </th>
            <th>
              <button
                type="button"
                // onClick={() => requestSort('city')}
                className='table_title'
              >
                Город
                <span class="material-symbols-outlined">arrow_drop_down</span>
              </button>
            </th>
            <th>
              <button
                type="button"
                // onClick={() => requestSort('rating')}
                className='table_title'
              >
                Рейтинг
                <span class="material-symbols-outlined">arrow_drop_down</span>
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
        {people
              .slice(firstContentIndex, lastContentIndex).map((item, index) => (
              <tr key={index} className="table_body">
                  <td style={{paddingLeft: '10px'}} className="table-body_item">{item.login}</td>
                  <td className="table-body_item">{ item.img ? <img className='table-body_img' src={item.img} /> : <span class="material-symbols-outlined no-img_table">account_circle_full</span>}{item.userName}</td>
                  <td className="table-body_item">{item.phone}</td>
                  <td style={{textAlign: 'center'}} className="table-body_item">
                  {(() => {
                    switch(item.status) {
                      case 'confirmed':
                        return <span style={{color: '#4CBB17'}} class="material-symbols-outlined">check_circle</span>;
                      case 'notСonfirmed':
                        return <span style={{color: '#F05050'}} class="material-symbols-outlined">cancel</span>;
                      case 'waitingConfirmed':
                        return <span style={{color: '#FFBF00'}} class="material-symbols-outlined">timelapse</span>;
                      case 'blocked':
                        return <span style={{color: '#666669'}} class="material-symbols-outlined">lock</span>;
                    } 
                  })()}
                  {/* {item.status === 'accept' ? <span style={{color: '#4CBB17'}} class="material-symbols-outlined">check_circle</span> : <span style={{color: '#F05050'}} class="material-symbols-outlined">cancel</span>}  */}
                  </td>
                  <td className="table-body_item">{item.orders}</td>
                  <td className="table-body_item">{item.booking}</td>
                  <td className="table-body_item">{item.activeOrders}</td>
                  <td className="table-body_item">{item.city}</td>
                  <td style={{textAlign: 'center'}} className="table-body_item"><span style={{fontSize: '20px', verticalAlign: 'middle'}} class="material-symbols-outlined">star</span>{item.rating}</td>
              </tr>
          ))}
        </tbody>
      </table>
          {/* <div className="items">
            {people
              .slice(firstContentIndex, lastContentIndex)
              .map((el) => (
                <div className="item" key={el.uid}>
                  <img
                    src={`https://avatars.dicebear.com/api/big-smile/${el.first_name}.svg`}
                    alt={`${el.username} profile`}
                    className="item__img"
                  />
                  <div className="item__info">
                    <p className="name">
                      {el.first_name} {el.last_name}{" "}
                      <span className="username">(@{el.username})</span>
                    </p>
                    <p className="job">{el.employment.title}</p>
                    <p
                      className={`status ${
                        el.subscription.status.toLowerCase() === "active"
                          ? "success"
                          : el.subscription.status.toLowerCase() === "blocked"
                          ? "danger"
                          : "warn"
                      }`}
                    >
                      {el.subscription.status}
                    </p>
                  </div>
                </div>
              ))}
          </div> */}
        </>
      {/* )} */}
    </div>
  );
}

export default AppPagino;