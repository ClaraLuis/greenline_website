import React, { useRef } from 'react';
import htmlToPdfmake from 'html-to-pdfmake';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import Waybill from './Waybill';
import './Waybill.css';
import generalstyles from '../Generalfiles/CSS_GENERAL/general.module.css';
import ReactToPrint from 'react-to-print';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

const WaybillPrint = ({ waybills }) => {
    const componentRef = useRef();

    const generatePDF = () => {
        const waybillElements = waybills.map((order) => {
            const waybillContent = React.createElement(Waybill, { order });
            const htmlContent = htmlToPdfmake(waybillContent, { window });

            return htmlContent;
        });

        const docDefinition = {
            content: waybillElements,
        };

        pdfMake.createPdf(docDefinition).download('waybills.pdf');
    };

    return (
        <>
            <ReactToPrint
                trigger={() => (
                    <button style={{ height: '35px' }} className={generalstyles.roundbutton + ' mb-1'}>
                        {' '}
                        Print Waybills
                    </button>
                )}
                content={() => componentRef.current}
            />
            <div style={{ display: 'none' }} className="col-lg-12">
                <div ref={componentRef} className="row m-0 w-100">
                    {waybills.map((order, index) => (
                        <Waybill key={index} order={order} />
                    ))}
                </div>
            </div>
        </>
    );
};

export default WaybillPrint;
