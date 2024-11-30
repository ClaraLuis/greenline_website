import React, { useContext } from 'react';
import formstyles from '../Generalfiles/CSS_GENERAL/form.module.css';
import generalstyles from '../Generalfiles/CSS_GENERAL/general.module.css';
import logo from '../Generalfiles/images/logo.png';
import Barcode from 'react-barcode';
import { Contexthandlerscontext } from '../../../Contexthandlerscontext';
import bwipjs from 'bwip-js';
const Sku = ({ item }) => {
    const { dateformatter } = useContext(Contexthandlerscontext);
    const [src, setImageSrc] = React.useState(false);

    React.useEffect(() => {
        if (bwipjs) {
            let canvas = document.createElement('canvas');
            bwipjs?.toCanvas(canvas, {
                bcid: 'datamatrix', // Barcode type
                text: item?.sku, // Text to encode
                scale: 2, // 3x scaling factor
                height: 15, // Bar height, in millimeters
                includetext: true, // Show human-readable text
                textxalign: 'center', // Always good to set this
            });
            setImageSrc(canvas.toDataURL('image/png'));
        }
    }, [item?.sku, bwipjs]);
    return (
        <div style={{ fontSize: '11px', width: '5cm', height: '3cm', overflow: 'hidden' }} className="print-item p-1 ">
            <div class="row m-0 w-100">
                <div class="col-lg-12 allcentered">
                    <img src={src} alt={`data matrix from ${item.sku}`} />
                </div>
                <div class="col-lg-12 allcentered">{item.sku}</div>
            </div>
        </div>
    );
};

export default Sku;
