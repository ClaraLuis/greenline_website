import React, { useRef } from 'react';
import htmlToPdfmake from 'html-to-pdfmake';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import Sku from './Sku';
import './Waybill.css';
import generalstyles from '../Generalfiles/CSS_GENERAL/general.module.css';
import ReactToPrint from 'react-to-print';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

const SkuPrint = ({ skus }) => {
    const componentRef = useRef();

    return (
        <>
            <ReactToPrint
                trigger={() => (
                    <button style={{ height: '35px' }} className={generalstyles.roundbutton + ' '}>
                        {' '}
                        Print SKUs
                    </button>
                )}
                content={() => componentRef.current}
            />
            <div style={{ display: 'none' }} className="col-lg-12">
                <div style={{ width: '5cm', height: '3cm' }} ref={componentRef} className="print-container row m-0 w-100 pt-2">
                    {skus.map((item, index) => (
                        <Sku style={{ width: '5cm', height: '3cm' }} key={index} item={item?.item} />
                    ))}
                </div>
            </div>
        </>
    );
};

export default SkuPrint;
