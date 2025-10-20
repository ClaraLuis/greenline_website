import React, { useContext } from 'react';
import { Contexthandlerscontext } from '../../../Contexthandlerscontext';
import bwipjs from 'bwip-js';
import logo from '../Generalfiles/images/logo.png';
const Sku = ({ item, barcodeSrc }) => {
    const { dateformatter } = useContext(Contexthandlerscontext);
    const [src, setImageSrc] = React.useState(barcodeSrc || '');

    React.useEffect(() => {
        if (barcodeSrc) {
            setImageSrc(barcodeSrc);
            return;
        }
        if (bwipjs) {
            const canvas = document.createElement('canvas');
            bwipjs.toCanvas(canvas, {
                bcid: 'datamatrix',
                text: item?.sku || '',
                scale: 2,
                includetext: false,
            });
            setImageSrc(canvas.toDataURL('image/png'));
        }
    }, [item?.sku, barcodeSrc]);
    return (
        <div style={{ width: '100%', height: '100%', overflow: 'hidden', position: 'relative' }}>
            {/* Top row (reserve bottom strip for SKU text) */}
            <div style={{ width: '100%', height: 'calc(100% - 7mm)', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: '1mm' }}>
                {/* Left: Barcode (left-aligned within its column) */}
                <div style={{ width: '28mm', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                    <img
                        style={{ maxWidth: '28mm', maxHeight: '16mm', objectFit: 'contain', display: 'block', imageRendering: 'crisp-edges' }}
                        src={barcodeSrc || src}
                        alt={`data matrix from ${item?.sku || ''}`}
                    />
                </div>
                {/* Right: Logo aligned top-left within its column */}
                <div style={{ width: '21mm', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <img src={logo} alt="logo" style={{ maxWidth: '16mm', maxHeight: '8mm', objectFit: 'contain', display: 'block' }} />
                </div>
            </div>
            {/* Bottom: full-width left-aligned SKU text (bottom-left) */}
            <div className="sku-text" style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: '7mm', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', padding: '0 1mm' }}>
                <div style={{ fontSize: '2.3mm', lineHeight: 1.1, width: '100%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', textAlign: 'left', fontWeight: 600, letterSpacing: '0.15mm', textTransform: 'uppercase' }}>
                    {item?.sku}
                </div>
            </div>
        </div>
    );
};

export default Sku;
