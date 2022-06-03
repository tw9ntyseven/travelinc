import React from 'react'
import './main.css'

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import Auth from '../auth/auth';
import Users from '../users/users';
import TodoApp from '../pagino.js';
import AppPagino from '../pagino.js';
import Dashboard from '../dashboard/dashboard';
import Orders from '../orders/orders';
import Finances from '../finances/finances';



const CustomTabList = ({ children, ...otherProps }) => (
    <TabList {...otherProps}>
      <div>{children}</div>
    </TabList>
  );
  
CustomTabList.tabsRole = 'TabList';

const CustomTab = ({ children, ...otherProps }) => (
  <Tab {...otherProps}>
    <div>{children}</div>
  </Tab>
);

CustomTab.tabsRole = 'Tab';

const Main = () => {
    return (
        <div className='wrapper'>
            <Tabs className="flex">
              <CustomTabList className="main_tablist">
                <CustomTab className="main_tab"><span class="material-symbols-outlined">pie_chart</span></CustomTab>
                <CustomTab className="main_tab"><span class="material-symbols-outlined">group</span></CustomTab>
                <CustomTab className="main_tab"><span class="material-symbols-outlined">file_copy</span></CustomTab>
                <CustomTab className="main_tab"><span class="material-symbols-outlined">account_balance_wallet</span></CustomTab>
                <CustomTab className="main_tab"><span class="material-symbols-outlined">account_circle</span></CustomTab>
                <CustomTab className="main_tab"><span class="material-symbols-outlined">logout</span></CustomTab>
              </CustomTabList>

              <TabPanel>
                <Dashboard />
              </TabPanel>
              <TabPanel>
                <Users />
              </TabPanel>
              <TabPanel>
                <Orders />
              </TabPanel>
              <TabPanel>
              <Finances />
              </TabPanel>
              <TabPanel>
                <h2>Профиль</h2>
              </TabPanel>
              <TabPanel>
                <h2>Выход</h2>
              </TabPanel>
            </Tabs>
        </div>
    );
}

export default Main;