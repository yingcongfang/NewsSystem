import "./NewsPanel.css";
import React from 'react';
import NewsCard from '../NewsCard/NewsCard';
import Auth from '../Auth/Auth';
import _ from 'lodash';

class NewsPanel extends React.Component {
    constructor() {
        super();
        this.state = {
            news: null,
            pageNum: 1,
            totalPages: 1,
            loadedAll: false
        };
        this.handleScroll = this.handleScroll.bind(this);
    }

    componentDidMount() {
        this.loadMoreNews();
        this.loadMoreNews = _.debounce(this.loadMoreNews, 1000);
        window.addEventListener('scroll', this.handleScroll);
    }

    handleScroll() {
        let scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
        if ((window.innerHeight + scrollY) >= (document.body.offsetHeight - 50)) {
            console.log('Loading more news');
            this.loadMoreNews();
        }
    }

    loadMoreNews(e) {
        if (this.state.loadedAll === true) {
            return;
        }
        let url = 'http://localhost:3000/news/userId/' + Auth.getEmail() + '/pageNum/' + this.state.pageNum
        let request = new Request(encodeURI(url), {
            method: 'GET',
            headers: {
                'Authorization': 'bearer ' + Auth.getToken(),
            },
            cache: 'no-cache',
        });
        console.log(request);

        fetch(request)
            .then((res) => res.json())
            .then((news) => {
                if (!news || news.length === 0) {
                    console.log("No news");
                    this.setState({ loadedAll: true });
                }
                this.setState({
                    news: this.state.news ? this.state.news.concat(news) : news,
                    pageNum: this.state.pageNum + 1
                });
            });
    }

    renderNews() {
        let news_list = this.state.news.map(news => {
            return (
                <a className='list-group-item' key={news.digest} href='#'>
                    <NewsCard news={news} />
                </a>
            );
        });

        return (
            <div className='container'>
                <div className='list-group'>
                    {news_list}
                </div>
            </div>
        )
    }

    render() {
        if (Auth.isUserAuthenticated()) {
            if (this.state.news) {
                return (
                    <div>
                        {this.renderNews()}
                        {/* <div class="progress container">
                            <div class="indeterminate"></div>
                        </div> */}
                    </div>
                );
            } else {
                return (
                    <div>
                        <div className="progress">
                            <div className="indeterminate"></div>
                        </div>
                    </div>
                );
            }
        } else {
            return (
                <div className='container'>
                    please login first
                </div>
            )
        }
    }
}

export default NewsPanel;