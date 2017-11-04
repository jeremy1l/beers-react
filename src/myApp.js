import React, {Component} from 'react';
import './App.css';

import Beers from './components/Beers'
import Ingredient from './components/Ingredient'
import Helper from './components/Helper'
const urls=Helper.getUrls();

const hopsUrl = urls.hopsUrl;
const maltsUrl = urls.maltsUrl;
const yeastsUrl = urls.yeastsUrl;
const searchUrl = urls.searchUrl;

class myApp extends Component {
    constructor(props) {
        super(props)
        this.state = {
            requestFailed: false,
            hops: null,
            malts: null,
            yeasts: null,
            beers: null,
            selectedIngredients: {
                hops: [],
                malts: [],
                yeasts: []
            }
        }
        this.handleCheckbox = this.handleCheckbox.bind(this);
        this.Search = this.Search.bind(this);
        this.addSelected = this.addSelected.bind(this);
        this.removeSelected = this.removeSelected.bind(this);
    }
     getJSON(url,type){
        console.log(url);
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw Error("Network request failed")
                }
                return response
            })
            .then(d => d.json())
            .then(d => {
                this.setState({
                    [type]: d,
                    [type+"Loading"]:false
                })
            }, () => {
                this.setState({
                    requestFailed: true
                })
            })
    }
    componentDidMount() {
        this.getJSON(hopsUrl,"hops");
        this.getJSON(maltsUrl,"malts");
        this.getJSON(yeastsUrl,"yeasts");
    }
    handleCheckbox(type,value,isChecked){
        if(isChecked)
            this.addSelected(type,value)
        else
            this.removeSelected(type,value)
    }
    removeSelected(type,value){
        let selectedIngredients = Object.assign({}, this.state.selectedIngredients);    //creating copy of object
        let selectedIngredient=selectedIngredients[type];
        console.log(value)
        console.log(selectedIngredient.indexOf(+value))
        selectedIngredient.splice(selectedIngredient.indexOf(+value), 1);
        this.setState({selectedIngredients});
    }
    addSelected(type,value){
        if(!this.state[type].find(function (item) { return item.id == value; })) return false;
        let selectedIngredients = Object.assign({}, this.state.selectedIngredients);    //creating copy of object
        let selectedIngredient=selectedIngredients[type];
        if(selectedIngredient.indexOf(+value)==-1)
        selectedIngredient.push(+value);
        this.setState({selectedIngredients});
    }
    Search(){
        this.setState({beersLoading:true});

        let selectedIngredients = Object.assign({}, this.state.selectedIngredients);
        let beersUrl = searchUrl+'?'+Object.keys(selectedIngredients)
            .map(type => type + '=' + selectedIngredients[type].join(','))
            .join('&');
        if(this.state.term) beersUrl+='&search='+this.state.term;
        this.getJSON(beersUrl,"beers");
    }
    render() {
        //console.log(Helper.urls);
        if (this.state.requestFailed) return <p>Request Failed!</p>
        const {hops,malts,yeasts,beers} = this.state;
        return (
            <div className="App">
                <div className="container">
                    <Ingredient
                        selected={this.state.selectedIngredients.hops.concat([])}
                        items={hops}
                        title="Hops"
                        type="hops"
                        handleCheckbox={this.handleCheckbox}
                        addSelected={this.addSelected}
                        removeSelected={this.removeSelected}
                    />
                    <Ingredient selected={this.state.selectedIngredients.malts.concat([])}
                                items={malts} title="Malt" type="malts"
                                handleCheckbox={this.handleCheckbox} addSelected={this.addSelected}  removeSelected={this.removeSelected}/>
                    <Ingredient selected={this.state.selectedIngredients.yeasts.concat([])} items={yeasts} title="Yeasts" type="yeasts"
                                handleCheckbox={this.handleCheckbox} addSelected={this.addSelected}  removeSelected={this.removeSelected}/>
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-1"><h3>Search</h3>
                            </div>
                            <div className="col-lg-11">
                                <input className="form-control" type="text" value={this.state.term} onChange={(ev) => this.setState({term: ev.target.value})} />
                            </div>
                        </div>
                    </div>
                    <button onClick={this.Search} className="btn-lg btn-primary">Keyword</button>
                    <Beers beers={beers} loading={this.state.beersLoading}/>
                </div>
            </div>
        );
    }
}


export default myApp;
