import generalstyles from '../Generalfiles/CSS_GENERAL/general.module.css';

import { Contexthandlerscontext } from '../../../Contexthandlerscontext';
import React, { useContext, useState } from 'react';
import ReactDOMServer from 'react-dom/server';
import { LanguageContext } from '../../../LanguageContext';
import bwipjs from 'bwip-js';
import Decimal from 'decimal.js';

const WaybillPrint = ({ waybills }) => {
    const [isGenerating, setIsGenerating] = useState(false);
    
    // Use current page providers if available; add safe fallbacks so Waybill never crashes.
    const handlersCtx = useContext(Contexthandlerscontext) || {
        dateformatter: (d) => (d ? new Date(d).toLocaleString() : ''),
        // add any other keys Waybill reads to avoid undefined errors
    };
    const langCtx = useContext(LanguageContext) || { lang: 'en', langdetect: () => 'en' };

    // Pre-generate all barcodes before rendering
    const generateBarcode = (text) => {
        try {
            const canvas = document.createElement('canvas');
            bwipjs.toCanvas(canvas, {
                bcid: 'datamatrix',
                text: JSON.stringify(text),
                height: 10,
                width: 10,
                includetext: true,
                textxalign: 'center',
            });
            return canvas.toDataURL('image/png');
        } catch (e) {
            console.error('Barcode generation error:', e);
            return '';
        }
    };

    const preGenerateBarcodes = async () => {
        console.time('Barcode Generation');
        const barcodeMap = new Map();
        
        // Generate all barcodes upfront
        waybills.forEach(wb => {
            // Generate barcode for order ID
            if (wb?.id) {
                barcodeMap.set(`id-${wb.id}`, generateBarcode(wb.id));
            }
            // Generate barcode for shopify name if exists
            if (wb?.shopifyName) {
                barcodeMap.set(`shopify-${wb.id}`, generateBarcode(wb.shopifyName));
            }
        });
        
        console.timeEnd('Barcode Generation');
        return barcodeMap;
    };

    const copyStyles = (srcDoc, dstDoc) => {
        const nodes = srcDoc.querySelectorAll('link[rel="stylesheet"], style');
        nodes.forEach((n) => dstDoc.head.appendChild(n.cloneNode(true)));
    };

    const waitForAssets = (doc) =>
        new Promise((resolve) => {
            // Reduced timeout for faster processing with large batches
            const TIMEOUT = 300; // Reduced from 1200ms
            const links = Array.from(doc.querySelectorAll('link[rel="stylesheet"]'));
            
            if (links.length === 0) {
                // No external stylesheets, just check images quickly
                checkImages();
                return;
            }

            let cssLeft = links.length;
            let timeoutReached = false;

            const finalize = () => {
                if (timeoutReached) return;
                timeoutReached = true;
                checkImages();
            };

            links.forEach((l) => {
                const done = () => {
                    if (--cssLeft <= 0) finalize();
                };
                l.addEventListener('load', done, { once: true });
                l.addEventListener('error', done, { once: true });
            });

            // Single timeout for all stylesheets instead of per-stylesheet
            setTimeout(finalize, TIMEOUT);

            function checkImages() {
                const imgs = Array.from(doc.images || []);
                if (!imgs.length) return resolve();
                
                let loaded = imgs.filter(img => img.complete).length;
                if (loaded === imgs.length) return resolve();
                
                const check = () => {
                    if (++loaded === imgs.length) resolve();
                };
                
                imgs.forEach((img) => {
                    if (!img.complete) {
                        img.onload = check;
                        img.onerror = check;
                    }
                });
                
                // Don't wait forever for images
                setTimeout(() => resolve(), TIMEOUT);
            }
        });

    // Optimized Waybill component that uses pre-generated barcodes
    const WaybillOptimized = ({ order, barcodes }) => {
        const { dateformatter } = handlersCtx;
        const idBarcode = barcodes.get(`id-${order.id}`) || '';
        const shopifyBarcode = barcodes.get(`shopify-${order.id}`) || '';

        return (
            <div style={{ fontSize: '8px' }} className="print-item waybill p-1 col-lg-12">
                <div className="row m-0 w-100 h-100">
                    <div style={{ borderInlineEnd: '1px solid #eee' }} className="col-lg-10 col-md-10">
                        <div className="row m-0 w-100 d-flex justify-content-center">
                            <div style={{ borderBottom: '1px solid #eee' }} className="row w-100 m-0 p-1">
                                <div style={{ borderInlineEnd: '2px solid #eee' }} className="company-info p-1 col-lg-4 col-md-4">
                                    <h1 className="company-name">
                                        <img src={require('../Generalfiles/images/logo.png')} style={{ objectFit: 'contain', width: '80px' }} alt="logo" />
                                    </h1>
                                    <div className="company-address">
                                        <span>+201000774094</span>
                                    </div>
                                    <div className="company-address">
                                        <span>ship-me@greenlineco.com</span>
                                    </div>
                                </div>
                                <div style={{ borderInlineEnd: '2px solid #eee' }} className="company-info p-2 col-lg-4 col-md-4">
                                    <div className="row m-0 w-100">
                                        <div className="col-lg-12 p-0">{order?.merchant?.name}</div>
                                        <div className="col-lg-12 p-0">Date: {dateformatter(order?.createdAt)}</div>
                                    </div>
                                </div>
                                <div className="company-info p-2 col-lg-4 col-md-4">
                                    {order?.merchantCustomer?.customerName}
                                    {order?.merchantCustomer?.customer?.phone && (
                                        <>
                                            <br />
                                            {order?.merchantCustomer?.customer?.phone}
                                        </>
                                    )}
                                    <br />
                                    {order?.address?.city}, {order?.address?.country}
                                    <br />
                                    {order?.address?.streetAddress}
                                    <br />
                                    {order?.address?.buildingNumber && (
                                        <>
                                            {order?.address?.buildingNumber}, {order?.address?.buildingNumber}
                                        </>
                                    )}
                                </div>
                            </div>
                            <div style={{ borderBottom: '1px solid #eee' }} className="row w-100 m-0 p-1">
                                <div style={{ borderInlineEnd: '2px solid #eee' }} className="company-info p-1 col-lg-4 col-md-4">
                                    <div className="row m-0 w-100">
                                        <div className="col-lg-12 p-0 text-start">
                                            Payment Method: <span style={{ fontWeight: 700 }}>{order?.paymentType}</span>
                                        </div>
                                    </div>
                                </div>
                                <div style={{ borderInlineEnd: '2px solid #eee' }} className="company-info p-1 col-lg-4 col-md-4">
                                    <div className="row m-0 w-100">
                                        <div className="col-lg-12 p-0">
                                            Order Type:{' '}
                                            <span style={{ fontWeight: 700 }} className="text-capitalize">
                                                {order?.type}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="company-info p-1 col-lg-4 col-md-4">
                                    <div className="row m-0 w-100">
                                        <div className="col-lg-12 p-0">
                                            Expects Return:{' '}
                                            <span style={{ fontWeight: 700 }} className="text-capitalize">
                                                {order?.type === 'exchange' && order?.previousOrderId ? 'Yes' : 'No'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div style={{ borderBottom: '1px solid #eee' }} className="row allcentered w-100 m-0 p-1">
                                <div style={{ borderInlineEnd: '2px solid #eee' }} className="company-info p-1 col-lg-4 col-md-4">
                                    <div className="row m-0 w-100">
                                        <div className="col-lg-12 p-0">
                                            CAN BE OPENED:{' '}
                                            <span style={{ fontWeight: 700 }} className="text-capitalize">
                                                {order?.canOpen == 0 ? 'No' : 'Yes'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div style={{ borderInlineEnd: '2px solid #eee' }} className="company-info p-1 col-lg-4 col-md-4">
                                    <div className="row m-0 w-100">
                                        <div className="col-lg-12 p-0">
                                            PART OF SHIPPMENT:{' '}
                                            <span style={{ fontWeight: 700 }} className="text-capitalize">
                                                {order?.deliveryPart == 0 ? 'No' : 'Yes'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="company-info p-1 col-lg-4 col-md-4">
                                    <div className="row m-0 w-100">
                                        <div className="col-lg-12 p-0">
                                            FRAGILE:{' '}
                                            <span style={{ fontWeight: 700 }} className="text-capitalize">
                                                {order?.fragile == 0 ? 'No' : 'Yes'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div style={{ borderBottom: '1px solid #eee' }} className="row allcentered w-100 m-0 p-1">
                                {order?.orderItems?.map((item, index) => {
                                    return (
                                        <div key={index} className="col-lg-12 p-0">
                                            ({item?.count}) <span style={{ fontWeight: 600 }}>{item?.info?.item?.name}, </span>{' '}
                                            <span style={{ fontSize: '8px' }}>{item?.info?.sku} </span>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="row allcentered w-100 m-0 p-1">
                                <div className="col-lg-12 p-0 mt-2">
                                    <div className="row m-0 w-100 d-flex">
                                        <div style={{ fontWeight: 600, fontSize: '10px' }} className="p-0 mb-2 col-lg-4 col-md-4">
                                            <div className="row m-0 w-100">
                                                <div className="col-lg-12 p-0">
                                                    <span style={{ fontWeight: 400, fontSize: '7px' }}>Total</span>
                                                </div>
                                                <div className="col-lg-12 p-0">
                                                    <span style={{ fontWeight: 600, fontSize: '10px' }}>
                                                        {new Decimal(order?.expectedPrice || 0).toFixed(2)} {order?.currency}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-2 col-md-2 p-0" style={{ flex: 1 }}>
                        <div className="row m-0 w-100 h-100">
                            <div className="col-lg-12 allcentered" style={{ height: '50%', borderBottom: '1px solid #eee' }}>
                                <div className="row m-0 w-100">
                                    <div className="col-lg-12 p-0 allcentered">
                                        <img src={idBarcode} alt={`data matrix from ${order?.id}`} />
                                    </div>
                                    <div className="col-lg-12 mt-1 allcentered">{order?.id}</div>
                                </div>
                            </div>
                            <div className="col-lg-12 allcentered" style={{ height: '50%', borderBottom: '1px solid #eee' }}>
                                {order?.shopifyName && (
                                    <div className="row m-0 w-100">
                                        <div className="col-lg-12 p-0 allcentered">
                                            <img src={shopifyBarcode} alt={`data matrix from ${order?.shopifyName}`} />
                                        </div>
                                        <div className="col-lg-12 mt-1 allcentered">{order?.shopifyName}</div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderPagesHTML = (barcodes) => {
        // Render all waybills with pre-generated barcodes
        return ReactDOMServer.renderToStaticMarkup(
            <Contexthandlerscontext.Provider value={handlersCtx}>
                <LanguageContext.Provider value={langCtx}>
                    <>
                        {waybills.map((wb, index) => (
                            <div key={index} className="waybill-page">
                                <WaybillOptimized order={wb} barcodes={barcodes} />
                            </div>
                        ))}
                    </>
                </LanguageContext.Provider>
            </Contexthandlerscontext.Provider>,
        );
    };

    const inlinePrintCSS = `
  <style>
    @page { size: A5 landscape; margin: 0; }
    * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    html, body { padding: 0; margin: 0; background: #fff; }
    
    /* Wrapper for each waybill - A5 landscape dimensions */
    .waybill-page {
      width: 210mm;
      height: 148mm;
      max-width: 210mm;
      max-height: 148mm;
      display: block;
      position: relative;
      box-sizing: border-box;
      overflow: hidden;
      page-break-after: always;
      break-after: page;
      page-break-inside: avoid;
      break-inside: avoid;
      margin: 0;
      padding: 0;
    }
    
    .waybill-page:last-child { 
      page-break-after: auto; 
      break-after: auto; 
    }
    
    /* Constrain waybill content to fit within A5 dimensions */
    .waybill-page .print-item,
    .waybill-page .waybill {
      page-break-after: auto !important;
      break-after: auto !important;
      margin: 0 !important;
      width: 210mm !important;
      height: 148mm !important;
      max-width: 210mm !important;
      max-height: 148mm !important;
      box-sizing: border-box !important;
      padding: 4mm !important;
      overflow: hidden !important;
      position: relative;
    }
    
    /* Ensure all child containers respect the bounds */
    .waybill-page .print-item > div,
    .waybill-page .waybill > div {
      max-width: 100%;
      max-height: 100%;
      box-sizing: border-box;
    }

    img { max-width: 100%; display: block; }
  </style>
`;

    const printViaIframe = async () => {
        if (!waybills?.length) return;

        setIsGenerating(true);
        console.time('Total Print Time');
        
        // Pre-generate all barcodes BEFORE creating iframe
        // This is done synchronously and outside the print preview
        const barcodes = await preGenerateBarcodes();
        
        // Create iframe synchronously (still within click handler)
        const iframe = document.createElement('iframe');
        iframe.style.position = 'fixed';
        iframe.style.right = '0';
        iframe.style.bottom = '0';
        iframe.style.width = '0';
        iframe.style.height = '0';
        iframe.style.border = '0';
        iframe.setAttribute('aria-hidden', 'true');
        document.body.appendChild(iframe);

        const doc = iframe.contentDocument || iframe.contentWindow.document;
        doc.open();
        doc.write(`<!doctype html><html><head><meta charset="utf-8" /><title>Waybills</title>${inlinePrintCSS}</head><body></body></html>`);
        copyStyles(document, doc);
        doc.close();

        console.time('HTML Rendering');
        // Inject pages HTML with pre-generated barcodes
        doc.body.innerHTML = renderPagesHTML(barcodes);
        console.timeEnd('HTML Rendering');

        console.time('Asset Loading');
        await waitForAssets(doc);
        console.timeEnd('Asset Loading');

        // Print and cleanup
        const w = iframe.contentWindow;
        w.focus();
        
        setIsGenerating(false);
        console.timeEnd('Total Print Time');
        console.log(`Printing ${waybills.length} waybills`);
        
        w.print();

        // Reduced cleanup delay
        setTimeout(() => {
            if (iframe.parentNode) {
                document.body.removeChild(iframe);
            }
        }, 500);
    };

    return (
        <button onClick={printViaIframe} disabled={isGenerating} style={{ height: '35px' }} className={generalstyles.roundbutton + ' mb-1'}>
            {isGenerating ? 'Generating...' : 'Print Waybills'}
        </button>
    );
};

export default WaybillPrint;
