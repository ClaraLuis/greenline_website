import React, { useRef } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import Sku from './Sku';
import './Waybill.css';
import generalstyles from '../Generalfiles/CSS_GENERAL/general.module.css';

const SkuPrint = ({ skus }) => {
    const componentRef = useRef();

    const handlePrint = async () => {
        try {
            const pdf = new jsPDF({
                unit: 'cm',
                format: [5, 3],
                orientation: 'landscape',
            });

            const skuElements = Array.from(componentRef.current.querySelectorAll('.print-page'));

            console.log(`Total Elements: ${skuElements.length}`);

            for (let index = 0; index < skuElements.length; index++) {
                const element = skuElements[index];

                try {
                    console.log(`Processing element ${index + 1} of ${skuElements.length}`);

                    // Convert SKU element to canvas
                    const canvas = await html2canvas(element, {
                        scale: 1.5, // Reduce scale to prevent memory overflow
                        useCORS: true,
                    });

                    // Convert canvas to PNG data URL
                    const imgData = canvas.toDataURL('image/png', 0.8); // 0.8 quality reduces size

                    // Add image to PDF
                    if (index > 0) pdf.addPage();
                    pdf.addImage(imgData, 'PNG', 0, 0, 5, 3);

                    // Manual cleanup
                    canvas.remove();
                    imgData = null;
                } catch (error) {
                    console.error(`Error rendering SKU at index ${index}:`, error);
                }
            }

            // Open PDF in new tab for printing
            pdf.autoPrint();
            pdf.output('dataurlnewwindow');
        } catch (error) {
            console.error('Error generating PDF:', error);
        }
    };

    return (
        <>
            {/* Print Button */}
            <button style={{ height: '35px' }} className={generalstyles.roundbutton} onClick={handlePrint}>
                Print SKUs
            </button>

            {/* Hidden Content for Rendering */}
            <div
                ref={componentRef}
                style={{
                    position: 'absolute',
                    top: '-9999px', // Move off-screen
                    left: '-9999px', // Move off-screen
                }}
            >
                <div className="print-container">
                    {skus?.map((item, index) => {
                        return (
                            <div
                                key={index}
                                className="print-page"
                                style={{
                                    height: '3cm',
                                    width: '5cm',
                                    display: 'block', // Avoid flex or grid for compatibility
                                    padding: '5px',
                                    boxSizing: 'border-box',
                                    backgroundColor: 'white', // Ensure a white background
                                }}
                            >
                                <Sku item={item?.item} />
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    );
};

export default SkuPrint;
