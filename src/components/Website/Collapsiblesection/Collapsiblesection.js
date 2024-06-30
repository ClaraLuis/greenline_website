import React, { useState, useEffect, useContext } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { Accordion, AccordionItem, AccordionItemHeading, AccordionItemButton, AccordionItemPanel, AccordionItemState } from 'react-accessible-accordion';

import { AiOutlineUser } from 'react-icons/ai';
import { Link, useHistory } from 'react-router-dom';
import Dropdown from 'react-bootstrap/Dropdown';
import { LanguageContext } from '../../../LanguageContext';
import { Contexthandlerscontext } from '../../../Contexthandlerscontext.js';
import cardstyles from './card.module.css';
import '../Generalfiles/CSS_GENERAL/dropdown.css';
import { Loggedincontext } from '../../../Loggedincontext.js';

import { MdOutlineKeyboardArrowDown } from 'react-icons/md';

import { useMutation, useQuery, useQueryClient, useInfiniteQuery } from 'react-query';

const Collapsiblesection = (props) => {
    let history = useHistory();
    const { lang, setlang, langdetect } = useContext(LanguageContext);
    const { isloggedincontext, userloggedinfobjcontext } = useContext(Loggedincontext);
    const { pagesarray_context, setpagesarray_context, setpagetitle_context, pagetitle_context, pageactive_context } = useContext(Contexthandlerscontext);
    const [OpenCloseCartSlider, setOpenCloseCartSlider] = useState(false);
    const [links, setlinks] = useState(['Reviews', 'Salaries', 'Interviews']);
    const queryClient = useQueryClient();

    return (
        <div className={cardstyles.accordion}>
            <input type="checkbox" name="accordion" value="2" id={props.item.question} />
            <label for={props.item.question}>{props.item.question}</label>
            <MdOutlineKeyboardArrowDown class={cardstyles.icon} />

            <p class="m-0">{props.item.answer}</p>
        </div>
    );
};

export default Collapsiblesection;
