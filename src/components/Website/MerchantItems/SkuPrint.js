import React, { useRef, useState, useContext } from 'react';
import ReactDOMServer from 'react-dom/server';
import Sku from './Sku';
import './Waybill.css';
import generalstyles from '../Generalfiles/CSS_GENERAL/general.module.css';
import { Contexthandlerscontext } from '../../../Contexthandlerscontext';
import { LanguageContext } from '../../../LanguageContext';
import bwipjs from 'bwip-js';

const SkuPrint = ({ skus }) => {
    const [isGenerating, setIsGenerating] = useState(false);
    const componentRef = useRef();
    // Use current page providers if available; add safe fallbacks so Sku never crashes.
    const handlersCtx = useContext(Contexthandlerscontext) || {
        dateformatter: (d) => (d ? new Date(d).toLocaleString() : ''),
    };
    const langCtx = useContext(LanguageContext) || { lang: 'en', langdetect: () => 'en' };

    // Do not copy host page styles to avoid bootstrap/grid affecting print layout
    const copyStyles = (srcDoc, dstDoc) => {};

    const waitForAssets = (doc) =>
        new Promise((resolve) => {
            const TIMEOUT = 1000;
            const links = Array.from(doc.querySelectorAll('link[rel="stylesheet"]'));
            let pending = links.length;
            const done = () => {
                if (--pending <= 0) checkImages();
            };
            if (pending === 0) return checkImages();
            links.forEach((l) => {
                l.addEventListener('load', done, { once: true });
                l.addEventListener('error', done, { once: true });
            });
            setTimeout(() => checkImages(), TIMEOUT);

            function checkImages() {
                const imgs = Array.from(doc.images || []);
                if (!imgs.length) return resolve();
                let loaded = imgs.filter((img) => img.complete).length;
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
                setTimeout(() => resolve(), TIMEOUT);
            }
        });

    const generateBarcodeDataUrl = (text) => {
        try {
            const canvas = document.createElement('canvas');
            bwipjs.toCanvas(canvas, {
                bcid: 'datamatrix',
                text: text || '',
                scale: 2,
                includetext: false,
            });
            return canvas.toDataURL('image/png');
        } catch (e) {
            return '';
        }
    };

    const printViaPDF = async () => {
        if (!skus?.length) return;
        setIsGenerating(true);
        try {
            const doc = new jsPDF({ unit: 'mm', format: [50, 25], compress: true });
            for (let i = 0; i < skus.length; i++) {
                if (i > 0) doc.addPage([50, 25], 'portrait');
                const skuText = skus[i]?.item?.sku || '';
                const img = generateBarcodeDataUrl(skuText);
                // Place barcode centered with 1.5mm padding and max height 14mm
                const padding = 1.5;
                const maxW = 50 - padding * 2;
                const maxH = 14;
                // We don't know intrinsic ratio from data matrix; treat as square
                const w = Math.min(maxW, maxH);
                const h = w;
                const x = (50 - w) / 2;
                const y = padding + ((maxH - h) / 2);
                if (img) {
                    doc.addImage(img, 'PNG', x, y, w, h);
                }
                // SKU text
                doc.setFont('helvetica', 'normal');
                doc.setFontSize(7.5);
                doc.text(skuText, 25, 25 - padding - 1.5, { align: 'center', baseline: 'bottom' });
            }
            const blobUrl = doc.output('bloburl');
            const win = window.open(blobUrl);
            if (win) {
                // Some browsers need a brief delay before print()
                setTimeout(() => {
                    try { win.focus(); win.print(); } catch (e) {}
                }, 300);
            }
        } finally {
            setIsGenerating(false);
        }
    };

    const renderPagesHTML = () => {
        return ReactDOMServer.renderToStaticMarkup(
            <Contexthandlerscontext.Provider value={handlersCtx}>
                <LanguageContext.Provider value={langCtx}>
                    <>
                        {skus?.map((item, index) => (
                            <div key={index} className="sku-page">
                                <div className="sku-content">
                                    <Sku item={item?.item} barcodeSrc={generateBarcodeDataUrl(item?.item?.sku)} />
                                </div>
                            </div>
                        ))}
                    </>
                </LanguageContext.Provider>
            </Contexthandlerscontext.Provider>
        );
    };

    

    const buildInlinePrintCSS = () => `
  <style>
    /* Normal: ensure printer receives width=50mm and height=25mm */
    @page { size: 50mm 25mm; margin: 0; }
    * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    html, body { padding: 0; margin: 0; background: #fff; font-family: Helvetica, Arial, sans-serif; }
    @media print {
      html, body { width: 50mm; height: 25mm; }
    }

    .sku-page {
      width: 50mm;
      height: 25mm;
      max-width: 50mm;
      max-height: 25mm;
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

    .sku-page:last-child { 
      page-break-after: auto; 
      break-after: auto; 
    }

    .sku-content {
      width: 50mm !important;
      height: 25mm !important;
      max-width: 50mm !important;
      max-height: 25mm !important;
      box-sizing: border-box !important;
      overflow: hidden !important;
      padding: 1.5mm !important;
      position: relative;
      top: 0;
      left: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 1mm;
      font-size: 2.8mm;
      line-height: 1.1;
      text-align: center;
    }

    .sku-content img, .sku-content svg, .sku-content canvas {
      max-width: 48mm;
      max-height: 14mm;
      width: auto;
      height: auto;
      object-fit: contain;
      display: block;
      image-rendering: -webkit-optimize-contrast;
      image-rendering: crisp-edges;
    }

    .sku-content div, .sku-content span, .sku-content p {
      max-width: 48mm;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .sku-text {
      font-weight: 600;
      letter-spacing: 0.2mm;
      margin-top: 0.5mm;
      text-transform: uppercase;
    }

    img { max-width: 100%; display: block; }
  </style>
`;

    

    

    const printViaIframe = async () => {
        if (!skus?.length) return;
        setIsGenerating(true);

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
        const css = buildInlinePrintCSS();
        doc.write(`<!doctype html><html><head><meta charset="utf-8" /><title>SKUs</title>${css}</head><body></body></html>`);
        copyStyles(document, doc);
        doc.close();

        doc.body.innerHTML = renderPagesHTML();
        await waitForAssets(doc);

        const w = iframe.contentWindow;
        w.focus();
        setIsGenerating(false);
        w.print();

        setTimeout(() => {
            if (iframe.parentNode) {
                document.body.removeChild(iframe);
            }
        }, 500);
    };

    

    // New: Image-only print to avoid page flow artifacts; builds one bitmap per label
    const buildLabelImage = async (skuText) => {
        // 50mm x 25mm at ~300 DPI => ~590x295 px
        const widthPx = 590;
        const heightPx = 295;
        const paddingPx = 18; // ~1.5mm
        const maxBarcodeH = 165; // ~14mm
        const canvas = document.createElement('canvas');
        canvas.width = widthPx;
        canvas.height = heightPx;
        const ctx = canvas.getContext('2d');
        // background
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, widthPx, heightPx);

        // barcode image (pre-generated)
        const barcodeUrl = generateBarcodeDataUrl(skuText);
        if (barcodeUrl) {
            await new Promise((resolve) => {
                const img = new Image();
                img.onload = () => {
                    const availableW = widthPx - paddingPx * 2;
                    const availableH = maxBarcodeH;
                    // treat as square-ish
                    const size = Math.min(availableW, availableH);
                    const x = Math.floor((widthPx - size) / 2);
                    const y = paddingPx + Math.floor((availableH - size) / 2);
                    ctx.drawImage(img, x, y, size, size);
                    resolve();
                };
                img.onerror = resolve;
                img.src = barcodeUrl;
            });
        }

        // text
        ctx.fillStyle = '#000000';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        ctx.font = '24px Helvetica, Arial, sans-serif';
        const textY = heightPx - paddingPx;
        const text = String(skuText || '');
        // simple ellipsis if too long
        let renderText = text;
        while (ctx.measureText(renderText).width > widthPx - paddingPx * 2 && renderText.length > 0) {
            renderText = renderText.slice(0, -2) + '…';
        }
        ctx.fillText(renderText, Math.floor(widthPx / 2), textY);

        return canvas.toDataURL('image/png');
    };

    const renderImagePagesHTML = async () => {
        const images = [];
        for (let i = 0; i < (skus?.length || 0); i++) {
            const skuText = skus[i]?.item?.sku || '';
            // eslint-disable-next-line no-await-in-loop
            const url = await buildLabelImage(skuText);
            images.push(url);
        }
        const pages = images
            .map((src) => `<div class="img-page"><img class="img-label" src="${src}" /></div>`) 
            .join('');
        const html = `<!doctype html><html><head><meta charset="utf-8" />
        <title>SKUs (Image)</title>
        <style>
          @page { size: 50mm 25mm; margin: 0; }
          * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          html, body { padding: 0; margin: 0; background: #fff; }
          .img-page { width: 50mm; height: 25mm; page-break-after: always; break-after: page; }
          .img-page:last-child { page-break-after: auto; break-after: auto; }
          .img-label { width: 50mm; height: 25mm; display: block; object-fit: contain; }
        </style>
        </head><body>${pages}</body></html>`;
        return html;
    };

    const printViaImageOnly = async () => {
        if (!skus?.length) return;
        setIsGenerating(true);

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
        const html = await renderImagePagesHTML();
        doc.write(html);
        doc.close();

        await waitForAssets(doc);
        const w = iframe.contentWindow;
        w.focus();
        setIsGenerating(false);
        w.print();

        setTimeout(() => {
            if (iframe.parentNode) {
                document.body.removeChild(iframe);
            }
        }, 500);
    };

    

    return (
        <>
            <button style={{ height: '35px' }} className={generalstyles.roundbutton} onClick={printViaIframe} disabled={isGenerating}>
                {isGenerating ? 'Generating...' : 'Print SKUs'}
            </button>
            
            
            
            {/* Hidden container retained in case other parts rely on it; not used for printing */}
            <div ref={componentRef} style={{ position: 'absolute', top: '-9999px', left: '-9999px' }} />
        </>
    );
};

export default SkuPrint;
