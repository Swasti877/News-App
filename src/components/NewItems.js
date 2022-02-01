import React, { Component } from 'react';

export default class NewItems extends Component {
    render() {
        let { title, description, imgURL, newsURL, author, date, source} = this.props;
        return (
            <>
                {/* <div>This is a News Item.</div> */}
                <div className="card">
                    <img src={!imgURL ? "https://techcrunch.com/wp-content/uploads/2022/01/dumb-car2.jpg?w=711" : imgURL} className="card-img-top" alt="..." />
                    <div className="card-body">
                        <span className="badge rounded-pill bg-info text-dark">{source}</span>
                        <h5 className="card-title">{title ? title.slice(0, 88).concat("...") : ""}</h5>
                        <p className="card-text">{description ? description.slice(0, 88).concat("...") : ""}</p>
                        <p className="card-text"><small className="text-muted">By {!author ? "Unknown" : author} on {new Date(date).toGMTString()}</small></p>
                        <a href={newsURL} target="_blank" className="btn btn-secondary">Read More</a>
                    </div>
                </div>
            </>
        )
    }
}