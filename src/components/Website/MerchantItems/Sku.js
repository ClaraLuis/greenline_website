import React, { useContext } from 'react';
import formstyles from '../Generalfiles/CSS_GENERAL/form.module.css';
import generalstyles from '../Generalfiles/CSS_GENERAL/general.module.css';
import logo from '../Generalfiles/images/logo.png';
import Barcode from 'react-barcode';
import { Contexthandlerscontext } from '../../../Contexthandlerscontext';
const Sku = ({ item }) => {
    const { dateformatter } = useContext(Contexthandlerscontext);
    return (
        <div style={{ fontSize: '12px', width: '5cm', height: '3cm', overflow: 'hidden' }} className="print-item p-1 ">
            <div class="row m-0 w-100  h-100">
                <Barcode value={item?.sku} width={2} height={40} fontSize={12} background="transparent" style={{ background: 'transparent', transform: 'rotate(90deg)' }} />
            </div>
            <div class="row m-0 w-100 allcentered">{item?.sku}</div>
        </div>
    );
};

export default Sku;
