/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect, useRef} from 'react';
import {useHistory} from "react-router-dom";
//import Auth from "../services/AuthService";
import util from "../utils/util";
import user from './assets/icons/user.svg';
import lock from './assets/icons/lock.svg'
import eye from './assets/icons/eye.svg';
import eye2 from './assets/icons/eye-slash.svg'
import loginn from './assets/icons/login.svg'

import {
    Input,
    Button,
    message
} from 'antd';


export default function Login(){
    const history=useHistory();
    const isMount=useRef(true);
    const [values, setValues]=useState({});
    const [loading, setLoading]=useState(false);

    const login=(e)=>{
        if(e)e.preventDefault();
        message.destroy();
        setLoading(true);
        /*Auth.login(values).then(({data})=>{
            util.setLoginInfoLocalStorage(data.token, data.name, data.modules, data.type, data.is_national, data.is_client_admin, data.is_admin);
            history.push('/dashboard');
        }).catch(e=>{
            message.error(e.message);
        }).finally(()=>{
            if(isMount){
                setLoading(false);
            }
        })*/
    }

    useEffect(()=>{
        return ()=>{isMount.current=false}
    }, []);

    return(
        <div className=" parent login-bg   h-100">
<div className='container d-flex align-items-center justify-content-center min-vh-100 '>
    <div className='row d-flex justify-content-center align-items-center rounded-borders shadow-lg '>
        <div className="content" style={{ width: '540px'}}>
            <div className="mx-3 blue" >
                <div className="logo mb-0">
                 <center>   <img src="assets/img/elogo.png" width="180" alt="" className="rounded" /></center>
                    {/* <h2 className="m-0 font-green-sharp">ASSETS MANAGEMENT</h2> */}
                </div>
                <h4 className="text-center bold500 font-green uc pt20" style={{ textShadow: '1px 1px #fff' }}>
                    Equipment Maintenance Management System
                </h4>
                <form onSubmit={login} autoComplete="off" spellCheck="false">
                    <div className="form-group pt35">
                        <Input
                            placeholder="Username"
                            prefix={<img src={user} alt='login' className='h-1' height={15} />}
                            autoFocus
                            value={values.username || ''}
                            onChange={e => setValues({ ...values, username: e.target.value })}
                            className='rounded-pill p-3'
                        />
                    </div>

                    <div className="form-group">
                        <Input.Password
                            placeholder="Password"
                            prefix={<img src={lock} alt="lock" height={15} />}
                            iconRender={visible => (visible ? <img src={eye} alt='eye' height={15} /> : <img src={eye2} alt='eye' height={15} />)}
                            value={values.password || ''}
                            onChange={e => setValues({ ...values, password: e.target.value })}
                            className='rounded-pill p-3'
                        />
                    </div>

                    <div className="form-actions ">
                   <Button type="button" className='rounded-pill btn btn-primary py-5 my-auto' block loading={loading} htmlType="submit">Login</Button>
                    </div>
                    <div className='mt30 text-white h5 '>
                      <center>  Help Desk - +2404 7712</center>  
                    </div>

                </form>
            </div>
        </div>

        <div className='bg-white object-fit-cover' style={{borderTopRightRadius:"30px", borderBottomRightRadius:"30px"}}>
            <img src={loginn} alt='Login'  style={{ height: '590px', width: '550px'}} className='' />
        </div>
    </div>
</div>

       
            
        </div>
    )
}