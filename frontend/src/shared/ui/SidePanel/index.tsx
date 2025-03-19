import React, {useEffect} from 'react';

export * from './components/Sidebar';
export * from './components/Menu';
export * from './components/SubMenu';
export * from './components/MenuItem';
export * from './components/ProSidebarProvider';
export * from '@/shared/ui/SidePanel/model/hooks/useProSidebar';
export * from '@/shared/ui/SidePanel/model/utils/utilityClasses';


import {Typography} from "@/shared/ui/SidePanel/styles/Typography";

import {themes} from "@/shared/style/Colors";

import {Menu, MenuItemStyles} from "@/shared/ui/SidePanel/components/Menu";
import {menuClasses} from "@/shared/ui/SidePanel/model/utils/utilityClasses";
import {Sidebar} from "@/shared/ui/SidePanel/components/Sidebar";
import {SidebarHeader} from "@/shared/ui/SidePanel/components/SidebarHeader";
import {SubMenu} from "@/shared/ui/SidePanel/components/SubMenu";
import {BarChart} from "@/shared/ui/SidePanel/components/icon/BarChart";
import {Badge} from "@/shared/ui/SidePanel/components/Badge";
import {MenuItem} from "@/shared/ui/SidePanel/components/MenuItem";
import {Global} from "@/shared/ui/SidePanel/components/icon/Global";
import {InkBottle} from "@/shared/ui/SidePanel/components/icon/InkBottle";
import {Diamond} from "@/shared/ui/SidePanel/components/icon/Diamond";
import {ShoppingCart} from "@/shared/ui/SidePanel/components/icon/ShoppingCart";
import {Calendar} from "@/shared/ui/SidePanel/components/icon/Calendar";
import {Book} from "@/shared/ui/SidePanel/components/icon/Book";
import {Service} from "@/shared/ui/SidePanel/components/icon/Service";
import {SidebarFooter} from "@/shared/ui/SidePanel/components/SidebarFooter";
import {Navigate, useNavigate} from "react-router-dom";
import {useSPTData} from "@/processes/hooks/useFetchSPT";
import {ChevronLeft, ChevronRight} from 'lucide-react';
import styled from "@emotion/styled";

type Theme = 'light' | 'dark';

interface SidePanelProps {
    setPanelCollapsed: (collapsed: boolean) => void;
}

export const SidePanel: React.FC<SidePanelProps> = ({setPanelCollapsed}) => {
    const [collapsed, setCollapsed] = React.useState(false);
    const [toggled, setToggled] = React.useState(false);
    const [broken, setBroken] = React.useState(false);
    const [rtl, setRtl] = React.useState(false);
    const [hasImage, setHasImage] = React.useState(false);
    const [theme, setTheme] = React.useState<Theme>('light');
    const {data: sptData, isLoading, error} = useSPTData({
        sortBy: '',
        sortOrder: 'asc',
        filters: {},
    });


    const navigate = useNavigate()
    // handle on RTL change event
    const handleRTLChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRtl(e.target.checked);
    };

    // handle on theme change event
    const handleThemeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTheme(e.target.checked ? 'dark' : 'light');
    };

    // handle on image change event
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setHasImage(e.target.checked);
    };

    const menuItemStyles: MenuItemStyles = {
        root: {
            fontSize: '13px',
            fontWeight: 400,
        },
        icon: {
            color: themes[theme].menu.icon,
            [`&.${menuClasses.disabled}`]: {
                color: themes[theme].menu.disabled.color,
            },
        },
        SubMenuExpandIcon: {
            color: '#b6b7b9',
        },
        subMenuContent: ({level}) => ({
            backgroundColor:
                level === 0
                    ? themes[theme].menu.menuContent
                    : 'transparent',
        }),
        button: {
            [`&.${menuClasses.disabled}`]: {
                color: themes[theme].menu.disabled.color,
            },
            '&:hover': {
                backgroundColor: themes[theme].menu.hover.backgroundColor,
                color: themes[theme].menu.hover.color,
            },
        },
        label: ({open}) => ({
            fontWeight: open ? 600 : undefined,
        }),
    };

    useEffect(() => {
        setPanelCollapsed(collapsed)
    }, [collapsed]);

    return (
        <SidebarContainer $collapsed={collapsed}>
            <Sidebar
                collapsed={collapsed}
                toggled={toggled}
                onBackdropClick={() => setToggled(false)}
                onBreakPoint={setBroken}
                image="https://user-images.githubusercontent.com/25878302/144499035-2911184c-76d3-4611-86e7-bc4e8ff84ff5.jpg"
                rtl={rtl}
                breakPoint="md"
                backgroundColor={themes[theme].sidebar.backgroundColor}
                rootStyles={{
                    color: themes[theme].sidebar.color,
                }}
            >

                <SidebarContent>
                    <SidebarHeader rtl={rtl} style={{marginBottom: '24px', marginTop: '16px'}}/>
                    <div style={{flex: 1, marginBottom: '32px'}}>

                        <Menu menuItemStyles={menuItemStyles}>
                            <SubMenu label="Алерты" icon={<Diamond/>}>
                                <MenuItem onClick={() => navigate('/')}>Общие</MenuItem>
                                {/*<MenuItem>Редактировать</MenuItem>*/}
                                {/*<SubMenu label="Forms">*/}
                                {/*    <MenuItem> Input</MenuItem>*/}
                                {/*    <MenuItem> Select</MenuItem>*/}
                                {/*    <SubMenu label="More">*/}
                                {/*        <MenuItem> CheckBox</MenuItem>*/}
                                {/*        <MenuItem> Radio</MenuItem>*/}
                                {/*    </SubMenu>*/}
                                {/*</SubMenu>*/}
                            </SubMenu>
                            <div style={{padding: '0 24px', marginBottom: '8px'}}>
                                <Typography
                                    variant="body2"
                                    fontWeight={600}
                                    style={{opacity: collapsed ? 0 : 0.7, letterSpacing: '0.5px'}}
                                >
                                    Настройки
                                </Typography>
                            </div>
                            <SubMenu
                                label="СПТ"
                                icon={<BarChart/>}
                                suffix={
                                    <Badge variant="info" shape="circle">
                                        {sptData && sptData.length}
                                    </Badge>
                                }
                            >
                                {/*<MenuItem> Добавить</MenuItem>*/}
                                {/*<MenuItem> Редактировать</MenuItem>*/}
                                <MenuItem onClick={() => navigate('/settings')}> QR</MenuItem>
                            </SubMenu>
                            <SubMenu label="Организации" icon={<Global/>}>
                                <MenuItem> Добавить</MenuItem>
                                <MenuItem> Редактировать</MenuItem>
                            </SubMenu>
                            {/*<SubMenu label="Theme" icon={<InkBottle/>}>*/}
                            {/*    <MenuItem> Dark</MenuItem>*/}
                            {/*    <MenuItem> Light</MenuItem>*/}
                            {/*</SubMenu>*/}

                            {/*<SubMenu label="E-commerce" icon={<ShoppingCart/>}>*/}
                            {/*    <MenuItem> Product</MenuItem>*/}
                            {/*    <MenuItem> Orders</MenuItem>*/}
                            {/*    <MenuItem> Credit card</MenuItem>*/}
                            {/*</SubMenu>*/}


                            {/*<MenuItem icon={<Calendar/>} suffix={<Badge variant="success">New</Badge>}>*/}
                            {/*    Calendar*/}
                            {/*</MenuItem>*/}
                            {/*<MenuItem icon={<Book/>}>Documentation</MenuItem>*/}
                            {/*<MenuItem disabled icon={<Service/>}>*/}
                            {/*    Examples*/}
                            {/*</MenuItem>*/}
                        </Menu>
                    </div>
                    {/*<SidebarFooter collapsed={collapsed}/>*/}
                    {/* Кнопка для сворачивания */}
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: collapsed ? 'center' : 'flex-end',
                            alignItems: 'center',
                            padding: '10px',
                            backgroundColor: themes[theme].sidebar.backgroundColor,
                            borderBottom: '1px solid #ccc',
                        }}
                    >
                        <button
                            onClick={() => setCollapsed(!collapsed)}
                            style={{
                                backgroundColor: 'transparent',
                                border: 'none',
                                cursor: 'pointer',
                                color: themes[theme].sidebar.color,
                            }}
                        >
                            {collapsed ? <ChevronRight size={20}/> : <ChevronLeft size={20}/>}
                        </button>
                    </div>
                </SidebarContent>
            </Sidebar>
        </SidebarContainer>
    );
};

const SidebarContainer = styled.div<{ $collapsed: boolean }>`
    height: 100%;
    width: ${({$collapsed}) => ($collapsed ? '80px' : '240px')}; // Меняем ширину в зависимости от collapsed
    background-color: #2d2d2d;
    color: white;
    transition: width 0.3s ease; // Плавный переход ширины
`;

const SidebarContent = styled.div`
    display: flex;
    flex-direction: column;
    height: 100vh;
`;