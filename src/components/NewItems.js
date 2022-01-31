import React, { Component } from 'react';

export default class NewItems extends Component {
    render() {
        let {title, description, imgURL, newsURL} = this.props;
        return (
            <>
                {/* <div>This is a News Item.</div> */}
                <div className="card" style={{width: "18rem"}}>
                    <img src={!imgURL?"https://techcrunch.com/wp-content/uploads/2022/01/dumb-car2.jpg?w=711":imgURL} className="card-img-top" alt="..."/>
                        <div className="card-body">
                            <h5 className="card-title">{title?title.slice(0, 88).concat("..."):""}</h5>
                            <p className="card-text">{description?description.slice(0, 88).concat("..."):""}</p>
                            <a href={newsURL} target="_blank" className="btn btn-secondary">Read More</a>
                        </div>
                </div>
            </>
        )
    }
}