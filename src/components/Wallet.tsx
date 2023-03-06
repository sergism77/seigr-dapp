// this will be the Seigr wallet interface
// seigr wallet is an Account Abstraction wallet
// users that do not have a wallet can use the seigr wallet
// users that have a metamask wallet can use it on the seigr network
// every new wallet will be a contract wallet on the seigr network
// users can use the seigr wallet to mint SEIG tokens
// users can use the seigr wallet to transfer SEIG tokens
// users can use the seigr wallet to stake SEIG tokens
// users can use the seigr wallet to unstake SEIG tokens
// users can use the seigr wallet to withdraw SEIG tokens
// users with at least 1 SEIG can use the seigr wallet to vote on proposals
// users with at least 10 SEIG can use the seigr wallet to create proposals
// create user interface that allows users to use Seigr wallet functions: mint SEIG token, transfer, stake, unstake, withdraw, etc.
// create user interface that allows users to vote on proposals
// create user interface that allows users to create proposals
// create user interface that allows users to view proposals
// import all needed hooks for the wallet to work
// import all needed components for the wallet to work
// import all needed functions for the wallet to work
// import all needed variables for the wallet to work
// import all needed types for the wallet to work
// import all needed interfaces for the wallet to work
// import all needed classes for the wallet to work
// import all needed enums for the wallet to work
// import all needed constants for the wallet to work
// import all needed modules for the wallet to work
// import all needed libraries for the wallet to work
// import all needed packages for the wallet to work
// import all needed dependencies for the wallet to work
// import all needed files for the wallet to work
// import all needed folders for the wallet to work
// import all needed snippets for the wallet to work
// import all needed code for the wallet to work
// import all needed data for the wallet to work
// import all needed information for the wallet to work
// import all needed text for the wallet to work
// import all needed content for the wallet to work
// import all needed metadata for the wallet to work
// import all needed assets for the wallet to work
// import all needed images for the wallet to work
// import all needed icons for the wallet to work
// import all needed logos for the wallet to work
// import all needed styles for the wallet to work
// import all needed css for the wallet to work
// import all needed html for the wallet to work
// import all needed javascript for the wallet to work
// import all needed typescript for the wallet to work
// import all needed react for the wallet to work

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
import Users from './components/Users';
import { Web3ReactProvider } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { useEagerConnect, useInactiveListener, useContract, useContractCall, useContractFunction, useContractTransaction, useContractEvents, useContractMultipleData, useContractSingleData, useContractMultipleCall, useContractSingleCall, useContractSingleCallResult, useContractMultipleCallResult } from './hooks';
import { render } from '@testing-library/react';
import Dashboard from './components/Dashboard';
import { useContractCallResult } from './hooks/useContractCallResult';
import { useContractCallResults } from './hooks/useContractCallResults';

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

// if the user is not connected to the wallet, then the user will be prompted to connect to the wallet or create a new Seigr Wallet
// if the user is connected to the wallet, then the user will be able to use the Seigr Wallet
// if the user is not connected show create Seigr Wallet button and connect to wallet button 
// if the user is connected show the Seigr Wallet interface
// if the user is connected to the Seigr Wallet, then the user will be able to use the Seigr Wallet

function Wallet() {
    const context = useWeb3React("http://81.191.42.97:10000/");
    const { connector, library, chainId, account, activate, deactivate, active, error } = context;
    const triedEager = useEagerConnect();
    useInactiveListener(!triedEager);
// is the user connected? then show the Seigr Wallet interface else show the connect to wallet button

    return (
        <div>
            <h1>Wallet</h1>
            <p>Chain ID: {chainId}</p>
            <p>Account: {account}</p>
            <p>Active: {active ? "Yes" : "No"}</p>
            <p>Error: {error}</p>
            <Button onClick={() => activate(connector)}>Connect</Button>
            <Button onClick={() => deactivate()}>Disconnect</Button>
        </div>
    );
}

function App() {
    return (
        <div className="App">
            <Web3ReactProvider getLibrary={getLibrary}>
                <Router>
                    <Layout style={{ minHeight: '100vh' }}>
                        <Sider
                            breakpoint="lg"
                            collapsedWidth="0"
                            onBreakpoint={broken => {
                                console.log(broken);
                            }}
                            onCollapse={(collapsed, type) => {
                                console.log(collapsed, type);
                            }
                            }
                        >
                            <div className="logo" />
                            <Menu theme="dark" mode="inline" defaultSelectedKeys={['4']}>
                                <Menu.Item key="1" icon={<PieChartOutlined />}>
                                    Option 1
                                </Menu.Item>
                                <Menu.Item key="2" icon={<DesktopOutlined />}>
                                    Option 2
                                </Menu.Item>
                                <SubMenu key="sub1" icon={<UserOutlined />} title="User">
                                    <Menu.Item key="3">Tom</Menu.Item>
                                    <Menu.Item key="4">Bill</Menu.Item>
                                    <Menu.Item key="5">Alex</Menu.Item>
                                </SubMenu>
                                <SubMenu key="sub2" icon={<TeamOutlined />} title="Team">
                                    <Menu.Item key="6">Team 1</Menu.Item>
                                    <Menu.Item key="8">Team 2</Menu.Item>
                                </SubMenu>
                                <Menu.Item key="9" icon={<FileOutlined />}>
                                    Files
                                </Menu.Item>
                            </Menu>
                        </Sider>
                        <Layout className="site-layout">
                            <Header className="site-layout-background" style={{ padding: 0 }} />
                            <Content style={{ margin: '0 16px' }}>
                                <Breadcrumb style={{ margin: '16px 0' }}>
                                    <Breadcrumb.Item>User</Breadcrumb.Item>
                                    <Breadcrumb.Item>Bill</Breadcrumb.Item>
                                </Breadcrumb>
                                <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
                                    <Routes>
                                        <Route path="/" element={<Dashboard />} />
                                        <Route path="/users" element={<Users />} />
                                        <Route path="/wallet" element={<Wallet />} />
                                    </Routes>
                                </div>
                            </Content>
                            <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
                        </Layout>
                    </Layout>
                </Router>
            </Web3ReactProvider>
        </div>
    );
}

function getLibrary(provider) {
    const library = new Web3Provider(provider);
    library.pollingInterval = 12000;
    return library;
}

export default App;
