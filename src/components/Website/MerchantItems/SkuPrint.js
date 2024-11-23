import React, { useRef } from 'react';
import ReactToPrint from 'react-to-print';
import Sku from './Sku';
import './Waybill.css';
import generalstyles from '../Generalfiles/CSS_GENERAL/general.module.css';

const SkuPrint = ({ skus }) => {
    const componentRef = useRef();

    return (
        <>
            <ReactToPrint
                trigger={() => (
                    <button style={{ height: '35px' }} className={`${generalstyles.roundbutton}`}>
                        Print SKUs
                    </button>
                )}
                content={() => componentRef.current}
            />
            <div class="d-none">
                <div ref={componentRef} className="print-container ">
                    {skus.map((item, index) => (
                        <div key={index} className="print-page">
                            <Sku item={item?.item} />
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default SkuPrint;
