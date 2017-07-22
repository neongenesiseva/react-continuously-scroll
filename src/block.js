import React,{Component} from 'react';

export default class Block extends Component {

  constructor(props){
  	super(props);
  	this.state = {};
  }

    render() {
        return (
            <div className="block-item">
              <div className="col-lg-5">
                <img src={`https://image.tmdb.org/t/p/w500${this.props.value.backdrop_path}`} alt={this.props.value.title}/>
              </div>
              <div className="col-lg-7">
                <p>{this.props.value.original_title}</p>
                <p>{this.props.value.release_date}</p>
                <p>{this.props.value.vote_count}</p>
                <p>{this.props.value.vote_average}</p>
                <p>{this.props.value.overview}</p>
              </div>
            </div>
        );
    }
}
