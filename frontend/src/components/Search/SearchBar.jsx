import React, { useState } from 'react';
import axios from 'axios';
import './SearchBar.css';

export const SearchBar = ({ setResults }) => {

    const [input, setInput] = useState("");

    const fetchData = (value) => {
        axios.get('http://localhost:8000/movie')
        .then(results => {
            const filteredData = results.data.filter(movie => 
                {return (movie.title.toLowerCase().includes(value.toLowerCase()) && value)}
            );

            const formattedData = filteredData.map(movie => ({
                id: movie._id,
                title: movie.title,
            }));
            setResults(formattedData);
        })
        .catch(error => console.log(error.message));
    }

    const handleChange = (value) => {
        setInput(value)
        fetchData(value)
    }

    return (<div className="search">
                <input 
                    type="text" 
                    placeholder="Search..." 
                    value={input} 
                    onChange={(e) => handleChange(e.target.value)}
                />
                <ion-icon name="search-outline"></ion-icon>
            </div>);
};