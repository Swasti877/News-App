import React, { Component } from 'react';
import NewItems from './NewItems';
import Loading from './Loading'
import PropTypes from 'prop-types'

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
        let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=42fbafa4c2884279a2f9ae8fa79fbdae&page=1&pageSize=${this.props.pageSize}`;
        this.setState({
            loading: true
        })
        let data = await fetch(url);
        let parsedData = await data.json();
        console.log(parsedData);
        this.setState({
            articles: parsedData.articles,
            totalResults: parsedData.totalResults,
            loading: false
        })
    }

    handleNextClick = async () => {
        if (Math.ceil(this.state.totalResults / this.props.pageSize) < this.state.page + 1) {

        } else {
            console.log("Next")
            let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=42fbafa4c2884279a2f9ae8fa79fbdae&page=${this.state.page + 1}&pageSize=${this.props.pageSize}`;
            this.setState({
                loading: true
            })
            let data = await fetch(url);
            let parsedData = await data.json();
            this.setState({
                page: this.state.page + 1,
                articles: parsedData.articles,
                loading: false
            })
        }
    }

    handlePrevClick = async () => {
        console.log("Prev")
        let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=42fbafa4c2884279a2f9ae8fa79fbdae&page=${this.state.page - 1}&pageSize=${this.props.pageSize}`;
        this.setState({
            loading: true
        })
        let data = await fetch(url);
        let parsedData = await data.json();
        this.setState({
            page: this.state.page - 1,
            articles: parsedData.articles,
            loading: false
        })
    }

    render() {
        return (
            <>
                <div className='container my-3'>
                    <h1 className="text-center">Top-Headlines</h1>
                    {this.state.loading && <Loading />}
                    <div className='row'>
                        {!this.state.loading && this.state.articles.map((element) => {
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
                    <button type="button" disabled={Math.ceil(this.state.totalResults / this.props.pageSize) < this.state.page + 1} className="btn btn-outline-secondary" onClick={this.handleNextClick}>Next &rarr;</button>
                </div>
            </>
        )
    }
}

News.defaultProps = {
    country: "in",
    pageSize: 6,
    category: "general"
}

News.propTypes = {
    country: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired
}