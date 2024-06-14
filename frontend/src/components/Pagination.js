// // Pagination.js
// import React from 'react';
// import { Link } from 'react-router-dom';
// import './Pagination.css';

// function Pagination({ currentPage, numofpage }) {
//     const pages = [];

//     for (let i = 1; i <= numofpage; i++) {
//         pages.push(i);
//     }

//     return (
//         <div className="pagination">
//             <Link to={`/page/1`} className="page-link">Home</Link>
//             {pages.map(page => (
//                 <Link 
//                     key={page} 
//                     to={`/page/${page}`} 
//                     className={`page-link ${page === parseInt(currentPage) ? 'active' : ''}`}
//                 >
//                     {page}
//                 </Link>
//             ))}
//             <Link to={`/page/${numofpage}`} className="page-link">End</Link>
//         </div>
//     );
// }

// export default Pagination;

// Pagination.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Pagination.css';

function Pagination({ currentPage, numofpage }) {
    const current = parseInt(currentPage);
    const pages = [];

    if (numofpage <= 3) {
        for (let i = 1; i <= numofpage; i++) {
            pages.push(i);
        }
    } else {
        if (current <= 2) {
            pages.push(1, 2, 3);
        } else if (current >= numofpage - 1) {
            pages.push(numofpage - 2, numofpage - 1, numofpage);
        } else {
            pages.push(current - 1, current, current + 1);
        }
    }

    return (
        <div className="pagination">
            <Link to={`/page/1`} className="page-link">Home</Link>
            {pages[0] > 1 && <span className="page-link">...</span>}
            {pages.map(page => (
                <Link 
                    key={page} 
                    to={`/page/${page}`} 
                    className={`page-link ${page === current ? 'active' : ''}`}
                >
                    {page}
                </Link>
            ))}
            {pages[pages.length - 1] < numofpage && <span className="page-link">...</span>}
            <Link to={`/page/${numofpage}`} className="page-link">End</Link>
        </div>
    );
}

export default Pagination;