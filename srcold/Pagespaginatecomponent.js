import React, { useEffect, useState, useContext } from 'react';
import { useHistory, Link, useParams } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import './components/Website/Generalfiles/CSS_GENERAL/pagination.css';

const Pagespaginatecomponent = (props) => {
    const history = useHistory();

    if (props.totaldatacount != undefined && props.pagenumbparams != undefined) {
        var numofitemsperpage = 12;
        if (props.numofitemsperpage != undefined) {
            numofitemsperpage = props.numofitemsperpage;
        }
        var numofpages = Math.ceil(props.totaldatacount / numofitemsperpage);
        return (
            <div style={{ marginBottom: 10, width: '100%' }}>
                {props.totaldatacount != undefined && numofpages != undefined && (
                    <ReactPaginate
                        nextLabel="next >"
                        onPageChange={(page) => {
                            // var customerfilterobjtemp = { ...customerfilterobj };
                            // customerfilterobjtemp.page = page.selected;
                            // setcustomerfilterobj({ ...customerfilterobjtemp });
                            var nextpage = page.selected + 1;
                            // history.push(props.nextpagelink + '/' + nextpage);
                            props.nextpagefunction(nextpage);
                            // page.selected
                        }}
                        forcePage={parseInt(props.pagenumbparams) - 1}
                        // forcePage={parseInt(props.pagenumbparams)}
                        pageRangeDisplayed={17}
                        marginPagesDisplayed={5}
                        pageCount={numofpages}
                        previousLabel="< previous"
                        pageClassName="page-item"
                        pageLinkClassName="page-link"
                        previousClassName="page-item"
                        previousLinkClassName="page-link"
                        nextClassName="page-item"
                        nextLinkClassName="page-link"
                        breakLabel="..."
                        breakClassName="page-item"
                        breakLinkClassName="page-link"
                        containerClassName="pagination"
                        activeClassName="active"
                        renderOnZeroPageCount={null}
                    />
                )}
            </div>
        );
    } else {
        return <div></div>;
    }
};
export default Pagespaginatecomponent;
