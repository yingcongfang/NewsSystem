import './NewsCard.css';
import React from 'react';
import Auth from '../Auth/Auth';

class NewsCard extends React.Component {
    redirectToUrl(url) {
        this.sendClickLog();
        window.open(url, '_blank');
    }

    sendClickLog() {
        let url = 'http://localhost:3000/news/userId/' + Auth.getEmail()
                    + '/newsId/' + this.props.news.digest;

        let request = new Request(encodeURI(url), {
            method: 'POST',
            headers: {
                'Authorization': 'bearer ' + Auth.getToken(),
            }, 
            cache: "no-cache"
        });

        fetch(request);
    }
    
    render() {
        return (
            <div className='news-container' onClick={() => this.redirectToUrl(this.props.news.url)}>
                <div className='card horizontal'>
                    <div className='card-image'>
                        <img src={this.props.news.urlToImage} alt='news' />
                    </div>
                    <div className='card-stacked'>
                        <div className="card-content">
                            <span className='card-title'>{this.props.news.title}</span>
                            <p>{this.props.news.description}</p>
                        </div>
                        <div className="card-action">
                            <div>
                                {this.props.news.source.id != null && <div className='chip light-blue news-chip'>{this.props.news.source.id}</div>}
                                {this.props.news.reason != null && <div className='chip light-green news-chip'>{this.props.news.reason}</div>}
                                {this.props.news.time != null && <div className='chip amber news-chip'>{this.props.news.time}</div>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default NewsCard;