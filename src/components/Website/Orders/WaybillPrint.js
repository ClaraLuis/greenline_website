// import React, { useRef } from 'react';
// import htmlToPdfmake from 'html-to-pdfmake';
// import pdfMake from 'pdfmake/build/pdfmake';
// import pdfFonts from 'pdfmake/build/vfs_fonts';
// import Waybill from './Waybill';
// import './Waybill.css';
// import generalstyles from '../Generalfiles/CSS_GENERAL/general.module.css';
// import ReactToPrint from 'react-to-print';

// pdfMake.vfs = pdfFonts.pdfMake.vfs;

// const WaybillPrint = ({ waybills }) => {
//     const componentRef = useRef();

//     return (
//         <>
//             <ReactToPrint
//                 trigger={() => (
//                     <button style={{ height: '35px' }} className={generalstyles.roundbutton + ' mb-1'}>
//                         {' '}
//                         Print Waybills
//                     </button>
//                 )}
//                 content={() => componentRef.current}
//             />
//             <div style={{ display: 'none' }} className="col-lg-12">
//                 <div ref={componentRef} className="print-container row m-0 w-100">
//                     {waybills.map((order, index) => (
//                         <Waybill key={index} order={order} />
//                     ))}
//                 </div>
//             </div>
//         </>
//     );
// };

// export default WaybillPrint;

import React, { useRef, useState, useContext } from 'react';
import generalstyles from '../Generalfiles/CSS_GENERAL/general.module.css';

import html2canvas from 'html2canvas';

import jsPDF from 'jspdf';

import Waybill from './Waybill'; // Adjust the import path as needed

import { Contexthandlerscontext } from '../../../Contexthandlerscontext';

const WaybillPrint = ({ waybills }) => {
    const [currentWaybill, setCurrentWaybill] = useState(null);

    const componentRef = useRef();

    const contextValue = useContext(Contexthandlerscontext); // Get the context value

    // Function to convert the waybill content to a PDF and print it

    const printToPDF = async () => {
        // Create a new PDF document with A4 size

        const pdf = new jsPDF('p', 'mm', 'a4'); // 'p' for portrait orientation, 'mm' for units, 'a4' for A4 size

        const pdfWidth = pdf.internal.pageSize.getWidth();

        const pdfHeight = pdf.internal.pageSize.getHeight();

        for (let i = 0; i < waybills.length; i++) {
            // Set the current waybill to render it in the hidden container

            setCurrentWaybill(waybills[i]);

            // Wait for the component to render

            await new Promise((resolve) => setTimeout(resolve, 0));

            // Capture the rendered content as a canvas

            const canvas = await html2canvas(componentRef.current, {
                scale: 2, // Improve resolution by increasing scale

                useCORS: true, // Handle cross-origin images

                scrollY: -window.scrollY, // Correct scrolling issue during capture
            });

            const imgData = canvas.toDataURL('image/png');

            // Add the image to the PDF, filling the A4 page size

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

            // Add a new page if there are more waybills

            if (i < waybills.length - 1) {
                pdf.addPage();
            }
        }

        // Reset the current waybill

        setCurrentWaybill(null);

        // Set default print settings and open the print dialog

        pdf.autoPrint();

        const pdfBlob = pdf.output('bloburl');

        const printWindow = window.open(pdfBlob);

        if (printWindow) {
            printWindow.onload = () => {
                printWindow.print();

                URL.revokeObjectURL(pdfBlob); // Clean up the URL object
            };
        }
    };

    return (
        <>
            <button onClick={printToPDF} style={{ height: '35px' }} className={generalstyles.roundbutton + ' mb-1'}>
                Print Waybills
            </button>

            <div
                style={{
                    position: 'absolute',
                    top: '-9999px',
                    width: '100vw',
                    height: '100vh',
                    overflow: 'hidden',
                }}
                className="col-lg-12"
            >
                {currentWaybill && (
                    <div ref={componentRef} style={{ height: '100%' }}>
                        <Waybill order={currentWaybill} />
                    </div>
                )}
            </div>
        </>
    );
};

export default WaybillPrint;
