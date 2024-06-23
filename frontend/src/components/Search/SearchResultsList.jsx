import React from 'react';
import './SearchResultsList.css';

export const SearchResultsList = ({results}) => {
    return (
        <div className='results-search'>
            {
                results.map((result, id) => {
                    return (<a href={`/movie/${result.id}`}>
                        <div key={id} className='result-item'>{result.title}</div>
                    </a>)
                })
            }
        </div>
    )
}