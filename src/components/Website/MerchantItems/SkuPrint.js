import React, { useRef } from 'react';
import ReactToPrint, { useReactToPrint } from 'react-to-print';
import Sku from './Sku';
import './Waybill.css';
import generalstyles from '../Generalfiles/CSS_GENERAL/general.module.css';

const SkuPrint = ({ skus }) => {
    const componentRef = useRef();

    const handlePrint = useReactToPrint({
        pageStyle: '@page { size: 5cm 3cm; margin: 0; }',
        content: () => componentRef.current,
        documentTitle: 'SKU Print',
    });

    return (
        <>
            <button style={{ height: '35px' }} className={`${generalstyles.roundbutton}`} onClick={handlePrint}>
                Print SKUs
            </button>

            {/* Hidden Print Content */}
            <div className="d-none">
                <div ref={componentRef} className="print-container">
                    {skus.map((item, index) => (
                        <div
                            key={index}
                            className="print-page"
                            style={{
                                height: '3cm',
                                width: '5cm',
                                pageBreakAfter: 'always', // Ensures each SKU starts on a new page
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                border: '1px solid black',
                                padding: '10px',
                                boxSizing: 'border-box',
                            }}
                        >
                            <Sku item={item?.item} />
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default SkuPrint;
