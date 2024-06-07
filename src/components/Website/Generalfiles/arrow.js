import React from 'react';
import { VisibilityContext } from 'react-horizontal-scrolling-menu';
import { LanguageContext } from '../../../LanguageContext';
import generalstyles from './CSS_GENERAL/general.module.css';

function Arrow({ children, disabled, onClick }: { children: React.ReactNode, disabled: boolean, onClick: VoidFunction }) {
    return (
        <button
            disabled={disabled}
            onClick={onClick}
            style={{
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                opacity: disabled ? '0' : '1',
                userSelect: 'none',
                width: '100%',
                height: 50,
                position: 'absolute',
                top: 0,
                bottom: 0,
                margin: 'auto',
            }}
        >
            {children}
        </button>
    );
}

export function LeftArrow() {
    const { isFirstItemVisible, scrollNext, scrollPrev, visibleItemsWithoutSeparators, initComplete } = React.useContext(VisibilityContext);
    const { lang, langdetect } = React.useContext(LanguageContext);
    const [disabled, setDisabled] = React.useState(!initComplete || (initComplete && isFirstItemVisible));
    React.useEffect(() => {
        // NOTE: detect if whole component visible
        if (visibleItemsWithoutSeparators.length) {
            setDisabled(isFirstItemVisible);
        }
    }, [isFirstItemVisible, visibleItemsWithoutSeparators]);

    return (
        <Arrow
            disabled={disabled}
            onClick={() => {
                scrollPrev();
            }}
            style={[]}
            class="d-md-none"
        >
            <div class={generalstyles.arrowLeft + ' d-flex d-md-none align-items-center justify-content-center '}>
                <i class="fa fa-chevron-left " style={{ fontSize: '0.8rem' }}></i>
            </div>
        </Arrow>
    );
}

export function RightArrow() {
    const { isLastItemVisible, scrollNext, scrollPrev, visibleItemsWithoutSeparators } = React.useContext(VisibilityContext);
    const { lang, langdetect } = React.useContext(LanguageContext);

    const [disabled, setDisabled] = React.useState(!visibleItemsWithoutSeparators.length && isLastItemVisible);
    React.useEffect(() => {
        if (visibleItemsWithoutSeparators.length) {
            setDisabled(isLastItemVisible);
        }
    }, [isLastItemVisible, visibleItemsWithoutSeparators]);

    return (
        <Arrow
            disabled={disabled}
            onClick={() => {
                scrollNext();
            }}
            style={[]}
            class="d-md-none"
        >
            <div class={generalstyles.arrowRight + ' d-flex d-md-none align-items-center justify-content-center '} style={{}}>
                <i class="fa fa-chevron-right" style={{ fontSize: '0.8rem' }}></i>
            </div>
        </Arrow>
    );
}
export function onWheel(apiObj: scrollVisibilityApiType, ev: React.WheelEvent): void {
    const isThouchpad = Math.abs(ev.deltaX) !== 0 || Math.abs(ev.deltaY) < 15;

    if (isThouchpad) {
        ev.stopPropagation();
        return;
    }

    if (ev.deltaY < 0) {
        apiObj.scrollNext();
    } else if (ev.deltaY > 0) {
        apiObj.scrollPrev();
    }
}
// import React from 'react';

// import { VisibilityContext } from 'react-horizontal-scrolling-menu';

// function Arrow({ children, disabled, onClick }: { children: React.ReactNode, disabled: boolean, onClick: VoidFunction }) {
//     return (
//         <button
//             disabled={disabled}
//             onClick={onClick}
//             style={{
//                 cursor: 'pointer',
//                 display: 'flex',
//                 flexDirection: 'column',
//                 justifyContent: 'center',
//                 right: '1%',
//                 opacity: disabled ? '0' : '1',
//                 userSelect: 'none',
//             }}
//         >
//             {children}
//         </button>
//     );
// }

// export function LeftArrow() {
//     const { isFirstItemVisible, scrollPrev, visibleItemsWithoutSeparators, initComplete } = React.useContext(VisibilityContext);

//     const [disabled, setDisabled] = React.useState(!initComplete || (initComplete && isFirstItemVisible));
//     React.useEffect(() => {
//         // NOTE: detect if whole component visible
//         if (visibleItemsWithoutSeparators.length) {
//             setDisabled(isFirstItemVisible);
//         }
//     }, [isFirstItemVisible, visibleItemsWithoutSeparators]);

//     return (
//         <Arrow disabled={disabled} onClick={() => scrollPrev()}>
//             Left
//         </Arrow>
//     );
// }

// export function RightArrow() {
//     const { isLastItemVisible, scrollNext, visibleItemsWithoutSeparators } = React.useContext(VisibilityContext);

//     // console.log({ isLastItemVisible });
//     const [disabled, setDisabled] = React.useState(!visibleItemsWithoutSeparators.length && isLastItemVisible);
//     React.useEffect(() => {
//         if (visibleItemsWithoutSeparators.length) {
//             setDisabled(isLastItemVisible);
//         }
//     }, [isLastItemVisible, visibleItemsWithoutSeparators]);

//     return (
//         <Arrow disabled={disabled} onClick={() => scrollNext()}>
//             Right
//         </Arrow>
//     );
// }
