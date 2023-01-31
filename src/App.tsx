import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

interface Csavar{
  id: number;
  tipus: string;
  hossz: number;
  keszlet: number;
  ar: number;
}

interface CsavarListResponse{
  csavarok: Csavar[];
}

interface State{
  csavarok: Csavar[] 
  tipusInput: string;
  hosszInput: number;
  arInput: number;
  keszletInput: number;
}

class App extends Component<{}, State>{

  constructor(props: {}){
    super(props);

    this.state = {
      tipusInput: '',
      hosszInput: 0,
      arInput: 0,
      csavarok: [],
      keszletInput: 0,
    }
  }

  async loadCsavarok() {
    let response = await fetch('http://localhost:3001/csavar');
    let data = await response.json() as Csavar[];
    console.log(data);
    this.setState({
      csavarok: data, 
    })
  }

  componentDidMount() {
    this.loadCsavarok();
  }

  handleUpload = async () => {
    const { tipusInput, hosszInput, arInput, keszletInput } = this.state;
    if(tipusInput.trim() === '' || hosszInput<1 || arInput <1 || keszletInput<1){
      return;
    }

    const dbData = {
      tipus: tipusInput,
      hossz: hosszInput,
      ar: arInput,
      keszlet: keszletInput,
    }

    let response = await fetch('http://localhost:3001/csavar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dbData),
    });

    this.setState({ 
      tipusInput: '',
      hosszInput: 0,
      arInput: 0,
      keszletInput: 0,
    })

    await this.loadCsavarok();
  };

  render() {
    console.log(this.state)
    const { tipusInput, hosszInput, arInput, keszletInput } = this.state;
    return <div>
    <h2>Új Csavar létrehozása</h2>
    Tipus: <input type="text" value={tipusInput} onChange={e => this.setState({ tipusInput: e.currentTarget.value})} /> <br />
    Hossz: <input type="number" value={hosszInput} onChange={e => this.setState({ hosszInput: parseInt(e.currentTarget.value) })}/> <br />
    Keszlet: <input type="number" value={keszletInput} onChange={e => this.setState({ keszletInput: parseInt(e.currentTarget.value) })}/> <br />
    Ár: <input type="number" value={arInput} onChange={e => this.setState({ arInput: parseInt(e.currentTarget.value) })} /> <br />
    <button onClick={this.handleUpload}>Hozzáaddás</button> <br />

    <h2>Meglévő csavarok:</h2>
    <ul>{
          this.state.csavarok.map(csavar => 
            <li>{csavar.tipus}, {csavar.hossz}cm, {csavar.ar}Ft, {csavar.keszlet}db,</li>
          )
        }</ul>        
    </div>
  }
}

export default App;
