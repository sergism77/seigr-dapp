import logo from './logo.svg';
import 'antd/dist/reset.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Layout, Menu, Breadcrumb, Button } from 'antd';
import {
  DesktopOutlined,
  PieChartOutlined,
  FileOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import './App.css';
import Users from './Users';
import { Web3ReactProvider } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { injected } from './connectors';
import { useEagerConnect, useInactiveListener,
  useContract, useContractCall, useContractFunction, useContractTransaction, useContractEvents, useContractMultipleData, useContractSingleData, useContractMultipleCall, useContractSingleCall, useContractSingleCallResult, useContractMultipleCallResult } from './hooks';
import { Header, Content, Footer } from 'antd/es/layout/layout';


// all the app's sections are wrapped in the Web3ReactProvider
// this allows the app to detect changes to the injected provider, if it exists

function getLibrary(provider) {
  const library = new Web3Provider(provider);
  library.pollingInterval = 12000;
  return library;
}

function App() {
  const context = useWeb3React<Web3Provider>("http://81.191.42.97:10000/");
  const { connector, library, chainId, account, activate, deactivate, active, error } = context;
  const triedEager = useEagerConnect();
  useInactiveListener(!triedEager);
  const contract = useContract(
    '0x5FbDB2315678afecb367f032d93F642f64180aa3',
    [
      'function balanceOf(address owner) view returns (uint)',
      'function transfer(address to, uint amount)',
    ],
    true
  );
  const contractCall = useContractCall(contract, 'balanceOf', [account]);
  const contractFunction = useContractFunction(contract, 'transfer');
  const contractTransaction = useContractTransaction(contract, 'transfer');
  const contractEvents = useContractEvents(contract, 'Transfer', account);  
  const contractMultipleData = useContractMultipleData(contract, 'balanceOf', [account]);
  const contractSingleData = useContractSingleData(contract, 'balanceOf', account);
  const contractMultipleCall = useContractMultipleCall(contract, 'balanceOf', [account]);
  const contractSingleCall = useContractSingleCall(contract, 'balanceOf', account);
  const contractSingleCallResult = useContractSingleCallResult(contract, 'balanceOf', account);
  const contractMultipleCallResult = useContractMultipleCallResult(contract, 'balanceOf', [account]);
  console.log(contractMultipleCallResult);
  console.log(contractSingleCallResult);
  console.log(contractMultipleCall);
  console.log(contractSingleCall);
  console.log(contractMultipleData);
  console.log(contractSingleData);
  console.log(contractEvents);
  console.log(contractTransaction);
  console.log(contractFunction);
  console.log(contractCall);
  console.log(contract);
// why does the header not show up?
// why does the footer not show up?
// why does the menu not show up?
// why does the content not show up?
// why does the layout not show up?
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <Router>
        <Layout className="layout">
          <Header>
            <div className="logo" />
            <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']}>
              <Menu.Item key="1">nav 1</Menu.Item>
              <Menu.Item key="2">nav 2</Menu.Item>
              <Menu.Item key="3">nav 3</Menu.Item>
            </Menu>
          </Header>
          <Content style={{ padding: '0 50px' }}>
            <Breadcrumb style={{ margin: '16px 0' }}>
              <Breadcrumb.Item>Home</Breadcrumb.Item>
              <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
              <Breadcrumb.Item>About</Breadcrumb.Item>
            </Breadcrumb>
            <div className="site-layout-content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/users" element={<Users />} />
              </Routes>
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
        </Layout>
      </Router>
    </Web3ReactProvider>
  );
}

export default App;

export function Home() {
  return (
    <div>
      <h2>Home</h2>
    </div>
  );
}
