import React, {useState} from 'react'
import './users.css'
import '../../components/table/table.css'
import usePagination from "../../hooks/usePagination";
const axios = require('axios').default;



// Function for sorting ASC and DESC
const useSortableData = (items, config = null) => {
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
  
  // const UsersTable = (props) => {
  //   const { peoples, requestSort, sortConfig } = useSortableData(props.users);

  //   return (
  //     <table className="table">
  //       <thead className="table_head">
  //         <tr>
  //           <th style={{paddingLeft: '10px'}}>
  //             <button
  //               type="button"
  //               onClick={() => requestSort('login')}
  //               className='table_title'
  //             >
  //               Логин
  //               <span class="material-symbols-outlined">arrow_drop_down</span>
  //             </button>
  //           </th>
  //           <th>
  //             <button
  //               type="button"
  //               onClick={() => requestSort('userName')}
  //               className='table_title'
  //             >
  //               Имя пользователя
  //               <span class="material-symbols-outlined">arrow_drop_down</span>
  //             </button>
  //           </th>
  //           <th>
  //             <button
  //               type="button"
  //               onClick={() => requestSort('phone')}
  //               className='table_title'
  //             >
  //               Телефон
  //               <span class="material-symbols-outlined">arrow_drop_down</span>
  //             </button>
  //           </th>
  //           <th>
  //             <button
  //               type="button"
  //               onClick={() => requestSort('status')}
  //               className='table_title'
  //             >
  //               Статус
  //               <span class="material-symbols-outlined">arrow_drop_down</span>
  //             </button>
  //           </th>
  //           <th>
  //             <button
  //               type="button"
  //               onClick={() => requestSort('orders')}
  //               className='table_title'
  //             >
  //               Заказы
  //               <span class="material-symbols-outlined">arrow_drop_down</span>
  //             </button>
  //           </th>
  //           <th>
  //             <button
  //               type="button"
  //               onClick={() => requestSort('booking')}
  //               className='table_title'
  //             >
  //               Брони
  //               <span class="material-symbols-outlined">arrow_drop_down</span>
  //             </button>
  //           </th>
  //           <th>
  //             <button
  //               type="button"
  //               onClick={() => requestSort('activeOrders')}
  //               className='table_title'
  //             >
  //               Акт. объ.
  //               <span class="material-symbols-outlined">arrow_drop_down</span>
  //             </button>
  //           </th>
  //           <th>
  //             <button
  //               type="button"
  //               onClick={() => requestSort('city')}
  //               className='table_title'
  //             >
  //               Город
  //               <span class="material-symbols-outlined">arrow_drop_down</span>
  //             </button>
  //           </th>
  //           <th>
  //             <button
  //               type="button"
  //               onClick={() => requestSort('rating')}
  //               className='table_title'
  //             >
  //               Рейтинг
  //               <span class="material-symbols-outlined">arrow_drop_down</span>
  //             </button>
  //           </th>
  //         </tr>
  //       </thead>
  //       <tbody>
  //       {users
  //             .slice(findex, lindex).map((item, index) => (
  //             <tr key={index} className="table_body">
  //                 <td style={{paddingLeft: '10px'}} className="table-body_item">{item.login}</td>
  //                 <td className="table-body_item">{ item.img ? <img className='table-body_img' src={item.img} /> : <span class="material-symbols-outlined no-img_table">account_circle_full</span>}{item.userName}</td>
  //                 <td className="table-body_item">{item.phone}</td>
  //                 <td style={{textAlign: 'center'}} className="table-body_item">
  //                 {(() => {
  //                   switch(item.status) {
  //                     case 'confirmed':
  //                       return <span style={{color: '#4CBB17'}} class="material-symbols-outlined">check_circle</span>;
  //                     case 'notСonfirmed':
  //                       return <span style={{color: '#F05050'}} class="material-symbols-outlined">cancel</span>;
  //                     case 'waitingConfirmed':
  //                       return <span style={{color: '#FFBF00'}} class="material-symbols-outlined">timelapse</span>;
  //                     case 'blocked':
  //                       return <span style={{color: '#666669'}} class="material-symbols-outlined">lock</span>;
  //                   } 
  //                 })()}
  //                 {/* {item.status === 'accept' ? <span style={{color: '#4CBB17'}} class="material-symbols-outlined">check_circle</span> : <span style={{color: '#F05050'}} class="material-symbols-outlined">cancel</span>}  */}
  //                 </td>
  //                 <td className="table-body_item">{item.orders}</td>
  //                 <td className="table-body_item">{item.booking}</td>
  //                 <td className="table-body_item">{item.activeOrders}</td>
  //                 <td className="table-body_item">{item.city}</td>
  //                 <td style={{textAlign: 'center'}} className="table-body_item"><span style={{fontSize: '20px', verticalAlign: 'middle'}} class="material-symbols-outlined">star</span>{item.rating}</td>
  //             </tr>
  //         ))}
  //       </tbody>
  //     </table>
  //   );
  // };

    // const data = await response.json();  

const Users = () => {
const [res, setRes] = useState();
const fetchLongRequest = async () => {
  const waitTime = 5000;
  setTimeout(() => console.log("Request taking a long time"), waitTime);
  try {
      const result = await axios({
          method: 'POST',
          url: "https://easytake.org/custom.php",
          data: {
            type: 'get_dashboard_info',
            per_page: 10,
            page: 1
          },
          headers: {
              accept: "application/json",
              "Content-Type": "application/json",
          }
      });
      console.log("SUCCESS!", JSON.stringify(result.data, null, 2));
      setRes(result);
  } catch(error) {
      console.log("FAIL!", error.message);
  }
};

fetchLongRequest();

console.log(res, "GET DATA");
//   axios({
//     method: "POST",
//     url: "https://easytake.org/custom.php",
//     data: {
//       type: 'get_dashboard_info',
//       per_page: 10,
//       page: 1
//     },
//     headers: { "Content-Type": "multipart/form-data" },
//   })
//     .then(function (response) {
//       //handle success
//       setRes(response.data.users);
//       console.log(response);
//     })
//     .catch(function (response) {
//       //handle error
//       console.log(response);
//     }
// );

// console.log(res, "RESPONSE");

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

  const { users, requestSort, sortConfig } = useSortableData(people);

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
    return (
        <div className='users_wrapper'>
        <div className='users'>
            <div className='users_header'>
                <div className='title'><span style={{marginRight: '7px'}} class="material-symbols-outlined">group</span>Пользователи</div>
                <div className='flex'>
                    <div className='users_filter'>
                        Фильтры
                        <div className='filter_counter'>0</div>
                        <span class="material-symbols-outlined">tune</span>
                    </div>
                    <div className='table_input input'>
                        <input className='input_text' placeholder='Поиск по имени, номеру или эл...' />
                        <span class="material-symbols-outlined">search</span>
                    </div>
                </div>
            </div>
        </div>

<table className="table">
<thead className="table_head">
  <tr>
    <th style={{paddingLeft: '10px'}}>
      <button
        type="button"
        onClick={() => requestSort('login')}
        className='table_title'
      >
        Логин
        <span class="material-symbols-outlined">arrow_drop_down</span>
      </button>
    </th>
    <th>
      <button
        type="button"
        onClick={() => requestSort('userName')}
        className='table_title'
      >
        Имя пользователя
        <span class="material-symbols-outlined">arrow_drop_down</span>
      </button>
    </th>
    <th>
      <button
        type="button"
        onClick={() => requestSort('phone')}
        className='table_title'
      >
        Телефон
        <span class="material-symbols-outlined">arrow_drop_down</span>
      </button>
    </th>
    <th>
      <button
        type="button"
        onClick={() => requestSort('status')}
        className='table_title'
      >
        Статус
        <span class="material-symbols-outlined">arrow_drop_down</span>
      </button>
    </th>
    <th>
      <button
        type="button"
        onClick={() => requestSort('orders')}
        className='table_title'
      >
        Заказы
        <span class="material-symbols-outlined">arrow_drop_down</span>
      </button>
    </th>
    <th>
      <button
        type="button"
        onClick={() => requestSort('booking')}
        className='table_title'
      >
        Брони
        <span class="material-symbols-outlined">arrow_drop_down</span>
      </button>
    </th>
    <th>
      <button
        type="button"
        onClick={() => requestSort('activeOrders')}
        className='table_title'
      >
        Акт. объ.
        <span class="material-symbols-outlined">arrow_drop_down</span>
      </button>
    </th>
    <th>
      <button
        type="button"
        onClick={() => requestSort('city')}
        className='table_title'
      >
        Город
        <span class="material-symbols-outlined">arrow_drop_down</span>
      </button>
    </th>
    <th>
      <button
        type="button"
        onClick={() => requestSort('rating')}
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
    </div>
    );

}

export default Users;