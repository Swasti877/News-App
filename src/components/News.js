import React, { Component } from 'react';
import NewItems from './NewItems';

export default class News extends Component {

    constructor() {
        super();
        this.state = {
            articles: [],
            loading: false,
            page: 1
        }
    }

    async componentDidMount() {
        let url = "https://newsapi.org/v2/top-headlines?country=in&apiKey=42fbafa4c2884279a2f9ae8fa79fbdae&page=1&pageSize=20";
        let data = await fetch(url);
        let parsedData = await data.json();
        console.log(parsedData);
        this.setState({
            articles: parsedData.articles,
            totalResults: parsedData.totalResults
        })
    }

    handleNextClick = async () => {
        if (Math.ceil(this.state.totalResults / 20) < this.state.page + 1) {

        } else {
            console.log("Next")
            let url = `https://newsapi.org/v2/top-headlines?country=in&apiKey=42fbafa4c2884279a2f9ae8fa79fbdae&page=${this.state.page + 1}&pageSize=20`;
            let data = await fetch(url);
            let parsedData = await data.json();
            this.setState({
                page: this.state.page + 1,
                articles: parsedData.articles
            })
        }
    }

    handlePrevClick = async () => {
        console.log("Prev")
        let url = `https://newsapi.org/v2/top-headlines?country=in&apiKey=42fbafa4c2884279a2f9ae8fa79fbdae&page=${this.state.page - 1}&pageSize=20`;
        let data = await fetch(url);
        let parsedData = await data.json();
        this.setState({
            page: this.state.page - 1,
            articles: parsedData.articles
        })
    }

    render() {
        return (
            <>
                <div className='container my-3'>
                    <h1>Top-Headlines:</h1>
                    <div className='row'>
                        {this.state.articles.map((element) => {
                            return (
                                <div className='col-md-4 my-2' key={element.url}>
                                    <NewItems title={element.title} description
                                        ={element.description} imgURL={element.urlToImage} newsURL={element.url} />
                                </div>
                            )
                        })}
                    </div>
                </div>
                <div className='container d-flex justify-content-between my-3'>
                    <button type="button" disabled={this.state.page <= 1} className="btn btn-outline-secondary" onClick={this.handlePrevClick}>&larr; Previous</button>
                    <button type="button" className="btn btn-outline-secondary" onClick={this.handleNextClick}>Next &rarr;</button>
                </div>
            </>
        )
    }
}