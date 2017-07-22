import React,{Component} from 'react';
import Block from './block.js';
import $ from 'jquery';
import './index.css';



export default class Contain extends Component {

    constructor(props){
    	super(props);
    	this.state = {
        page:1,
        unChangeList:[],
      likeListKey:[],
      likeList:[],
      json:[],
      total:1,
      loadMore:false
      };
      this.setCookie = this.setCookie.bind(this);
      this.fetchMovieList = this.fetchMovieList.bind(this);
      this.getCookie = this.getCookie.bind(this);
      this.handleScroll = this.handleScroll.bind(this);
      this.mainScroll = this.mainScroll.bind(this);
      this.clearAll= this.clearAll.bind(this);
    }

    setCookie(name,value,seconds)//set cookie
      {
        let primary = `${name}=${value}`;
        let time = new Date();
        time.setSeconds(time.getMinutes()+seconds);
        let expiration = time.toUTCString();
        let cookieString = `${primary};path=/;expires=${expiration};`;
        document.cookie = cookieString;
      }

    getCookie(cookieName)//get cookies
        {
            var arr = document.cookie.match(new RegExp("(^| )"+cookieName+"=([^;]*)(;|$)"));
            if(arr != null) return unescape(arr[2]);
            return null;
        }

    fetchMovieList(){//fetch movie list
      let temp = this.getCookie("aa");
      if (temp != null){
        fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=4bef8838c2fd078bd13d7127d8dedcd4&language=en-US?&page=${temp}`)
        .then(res=>{res.json().then(jsonfile=>{
                                          let tempArr = jsonfile.results.slice(0);
                                          tempArr.forEach(function(cur){
                                            cur.like=false;
                                          });
                                          this.setState({unChangeList:this.state.unChangeList.concat(tempArr)});
                                          this.setState({json:this.state.json.concat(tempArr)});
                                          this.setState({page:jsonfile.page});
                                          this.setState({total:jsonfile.total_pages});
                                          console.log(this.state.json);
                                          this.setCookie("aa",this.state.page,300);
                                          })
      })
    } else {
      // document.getElementById('block-container').removeChild(document.getElementsByClassName('block-item'));
      fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=4bef8838c2fd078bd13d7127d8dedcd4&language=en-US?&page=${this.state.page}`)
      .then(res=>{res.json().then(jsonfile=>{
                                        let tempArr = jsonfile.results.slice(0);
                                        tempArr.forEach(function(cur){
                                          cur.like=false;
                                        });
                                        this.setState({unChangeList:this.state.unChangeList.concat(tempArr)});
                                        this.setState({json:this.state.json.concat(tempArr)});
                                        this.setState({page:jsonfile.page});
                                        this.setState({total:jsonfile.total_pages});
                                        console.log(this.state.json);
                                        this.setCookie("aa",this.state.page,300);
                                      })
    })
    }
  };

    mainScroll(){
      if ($(window).scrollTop()+$(window).height() > 0.98*$(document).height() && !this.getCookie('continuefetch')){
          let currentCookie = this.getCookie("aa");
          let newPage = parseInt(currentCookie,10) +1;
          console.log(newPage);
          this.setCookie("aa",newPage,300);
          this.fetchMovieList();
          this.setCookie('continuefetch',true,2);
          // && !this.getCookie('continueFetch') force the scroll to be trigged no sonner than 2 seconds interval;
      }
    }

    handleScroll(){

      this.mainScroll();
      //no setTimeout is also OK,

    }

    clearAll(){
      this.setCookie('aa','1',300);
      this.setState({json:[]});
      this.fetchMovieList();
    }

    componentDidMount() {

      this.fetchMovieList();
      window.addEventListener('scroll',this.handleScroll);

    }


    render() {
        return (
            <div id="block-container">
                <button id="fixed-position-button" onClick={this.clearAll}>Back to first one</button>
                {this.state.json.map((value,i)=>(<Block value={value} key={i} />))}
            </div>
        );
    }

    componentWillUnmount() {
      window.removeEventListener('scroll',this.handleScroll);
    }
}
