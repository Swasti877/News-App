import React, { useEffect, useState } from 'react';
import NewItems from './NewItems';
import Loading from './Loading';
import PropTypes from 'prop-types';
import InfiniteScroll from 'react-infinite-scroll-component';

export default function News(props) {

    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalResults, setTotalResults] = useState(0);
    

    const capitalizeFirstLetter = (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    useEffect(() => {
        document.title = `${capitalizeFirstLetter(props.category)} - News WebApp`
        handle();
    }, [])

    const handle = async () => {
        props.setProgress(0);
        let url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page}&pageSize=${props.pageSize}`;
        setLoading(true)
        props.setProgress(30);
        let data = await fetch(url);
        let parsedData = await data.json();
        setArticles(parsedData.articles);
        setLoading(false)
        setTotalResults(parsedData.totalResults)
        props.setProgress(100)
    }

    const fetchMoreData = async () => {
        let url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page+1}&pageSize=${props.pageSize}`;
        setPage(page+1);
        let data = await fetch(url);
        let parsedData = await data.json();
        setArticles(articles.concat(parsedData.articles));
        setLoading(false);
        setTotalResults(parsedData.totalResults)
    };

    return (
        <>
            <h1 className="text-center" style={{marginTop: '80px'}}>Top {capitalizeFirstLetter(props.category)} Headlines</h1>
            {loading && <Loading />}
            <InfiniteScroll
                dataLength={articles.length}
                next={fetchMoreData}
                hasMore={articles.length !== totalResults}
                loader={<Loading />}
            >
                <div className='container my-3'>
                    <div className='row'>
                        {articles.map((element) => {
                            return (
                                <div className='col-md-4 my-2' key={element.url}>
                                    <NewItems title={element.title} description
                                        ={element.description} imgURL={element.urlToImage} newsURL={element.url}
                                        author={element.author} date={element.publishedAt} source={element.source.name} />
                                </div>
                            )
                        })}
                    </div>
                </div>
            </InfiniteScroll>
        </>
    )
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