import React from 'react';
import './SearchResultsList.css';

export const SearchResultsList = ({results, valueName}) => {
    return (
        <div className='results-search'>
            {results.length > 0 ? (
                results.map((result, id) => {
                    return (<a href={`/movie/${result.id}`}>
                        <div key={id} className='result-item'>{result.title}</div>
                    </a>)
                })) : (valueName === '' ? (
                    <></>
                ) : (
                <text className="no-movie-found">Sorry! We can't find the movie.</text>)
                )
            }
        </div>
    )
}