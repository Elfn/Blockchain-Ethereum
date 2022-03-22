import React, {Component} from 'react';
import Election from '../../ethereum/election'
import web3 from '../../ethereum/web3';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

class Responsable extends Component {

  constructor(props) {
    super(props);
    this.getCards = this.getCards.bind(this);
    this.getCandidates = this.getCandidates.bind(this);
    this.onSelectDate = this.onSelectDate.bind(this);
   // this.onSubmitEndDate = this.onSubmitEndDate.bind(this);


    this.state = {
      accounts: '',
      responsibleAddr: '',
      election: '',
      candidateCount: '',
      candidates: '',
      endDate: '',
      isEnd: '',
      today: '',
      value: ''
    };

    const election = Election;
    web3.eth.getAccounts().then(res => {
      this.setState({accounts: res})
    });
    //this.setState({election: election});


    election.methods.candidateCount().call().then(count => this.setState({
      candidateCount: count
    }));
    this.onCheckDate();
  }

  getDateFormat(date){
    return ((date.getDate() < 10) ?  '0'+date.getDate() : date.getDate())+'/'+((date.getMonth() + 1) < 10 ? '0'+(date.getMonth() + 1) : (date.getMonth() + 1))+'/'+date.getFullYear();
  }


  getCards() {
    const items = [
      [
        {
          title: this.state.accounts.length - 1,
          subtitle: 'Nombre de comptes',
          text: 'Nombre de comptes disponibles pour les votes',
          buttons: []
          // style: {overflowWrap: 'break-word', marginLeft: 12, width: 18}
        },
        {
          title: this.state.accounts[0],
          subtitle: 'Manager adresse',
          text: 'Adresse du manager de l\'election',
          buttons: []
          // style: {overflowWrap: 'break-word', marginLeft: 12, width: 18}
        }
      ],
      [
        {
          title: this.state.candidateCount,
          subtitle: 'Nombre de candidats',
          text: 'Nombre de candidats de la session électorale',
          buttons: [<button onClick={this.getCandidates}  className="btn btn-outline-primary" data-bs-toggle="modal" data-bs-target="#listModal">Lister</button>,<button style={{marginLeft: 12}}  className="btn btn-outline-success" data-bs-toggle="modal" data-bs-target="#addModal">Ajouter</button>]
          // style: {overflowWrap: 'break-word', marginLeft: 12, width: 18}
        }
        // ,
        // {
        //   title: 'Terminer l\'élection',
        //   subtitle: '',
        //   text: 'Mettre fin à la session électorale',
        //   buttons: [<button className="btn btn-outline-primary float-none">Activer</button>]
        //   // style: {overflowWrap: 'break-word', marginLeft: 12, width: 18}
        // }
        , {
          title: 'Plannifier',
          subtitle: '',
          text: 'Determiner la fin d l\'élection',
          buttons: [<button className="btn btn-outline-primary float-none" data-bs-toggle="modal" data-bs-target="#planModal">Plannifier</button>, <h5>Date de fin: <span className="badge bg-secondary mt-3">{this.getDateFormat(new Date(localStorage.getItem('value')))}</span></h5>]
          // style: {overflowWrap: 'break-word', marginLeft: 12, width: 18}
        }
      ]
    ];
    console.log(Array.from(items));
    return Array.from(items);
  }

  async getCandidates(){
    console.log('AAAAAAAAA');
    const election = Election;
    const allCandidates = await Promise.all(
      Array(parseInt(this.state.candidateCount))
        .fill()
        .map((element, index) => {
          return election.methods.candidates(index).call();
        })
    );
    this.setState({candidates: allCandidates});
    console.log("AALLLAALLLAAALLLAALL => ",this.state.candidates);
    //return allCandidates;
  }

  renderCandidates(){
    return Array.from(this.state.candidates).map((item, index)=>{
      let imgUrl = `https://bootdey.com/img/Content/avatar/avatar${item.id}.png`;
      return <div key={index} className=" col-md-2 card text-center" style={{width: '12rem',marginLeft: 12}}>
        <img src={imgUrl} className="img-thumbnail" alt="..." />
        <div className="card-body">
          <div className="d-flex flex-row bd-highlight mb-3">
            <div className="p-2 bd-highlight"><p className="card-text text-center"><h4>{item.name}</h4></p></div>
            <div className="p-2 bd-highlight"><h4><span className="badge bg-secondary">{item.voteCount}</span></h4></div>
          </div>
        </div>
      </div>
    });
  }

   onSelectDate(e) {
     let endDate = new Date(e.target.value).toLocaleDateString("fr-FR");
     this.setState({value: e.target.value});
     localStorage.setItem('value',e.target.value);
     this.setState({endDate: endDate});
     const todayDate = new Date().toLocaleDateString("fr-FR");
     this.setState({today: todayDate});
     const  isEndOfElection = (endDate === todayDate);
     // console.log(new Date(e.target.value).toLocaleDateString("fr-FR"));
     this.setState({isEnd: isEndOfElection});
     console.log('IN RESPONSIBLE ',isEndOfElection);
     this.props.onGetElectionStatus(isEndOfElection);
  }

  onCheckDate(){
    let endDate = new Date(localStorage.getItem('value')).toLocaleDateString("fr-FR");
    console.log(endDate);
    const todayDate = new Date().toLocaleDateString("fr-FR");
    if(todayDate === endDate){
      this.props.onGetElectionStatus(true);
    }else{
      this.props.onGetElectionStatus(false);
    }
  }



  render() {
    return (

      <div className="container">
        <div className="row mt-5">
          <div className="col float-start">
            <h3>Espace responsable</h3>
          </div>
          <div className="col">

          </div>
        </div>
        <div className="row mt-4">
          <div className="col">
            <div className="d-flex flex-row bd-highlight mb-3">
              <div className="p-2 bd-highlight"><h5 className="float-start"><span
                className="badge badge bg-warning">Responsable</span></h5></div>
              <div className="p-2 bd-highlight"><h5 className="float-start"><span
                className="badge badge bg-light text-dark">{this.state.accounts[0]}</span></h5></div>
              <div className="p-2 bd-highlight"></div>
            </div>
          </div>
        </div>

        {this.getCards().map((item,index) => {
          return <div key={index} className="row mt-4">
            {item.map((subitem) => {
              return <div key={subitem} className="col card" style={{overflowWrap: 'break-word', marginLeft: 12, width: 18, backgroundColor: '#FBFBFB'}}>
                <div className="card-body">
                  <h5 className="card-title fw-bold">{subitem.title}</h5>
                  <h6 className="card-subtitle mb-2 text-muted">{subitem.subtitle}</h6>
                  <p className="card-text">{subitem.text}</p>
                  {Array.from(subitem.buttons).map((btn)=> {
                    return btn;
                  })}
                </div>
              </div>;
            })}
            <div className="col"></div>
            <div className="col"></div>
          </div>
        })}
        {/*Modal Lister*/}
        <div className="modal fade"  id="listModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog modal-xl">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title text-center" id="exampleModalLabel">Liste des candidats</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <div className="container-fluid">
                  <div className="row">
                    {this.renderCandidates()}
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Fermer</button>
              </div>
            </div>
          </div>
        </div>
        {/*Modal Ajouter*/}
        <div className="modal fade"  id="addModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog modal-md">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title text-center" id="exampleModalLabel">Ajout de candidat</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <div className="container-fluid">
                  <div className="row">
                    <div className="col text-center">
                      <form className="text-center">
                        <div className="mb-3">
                          <input type="email" className="form-control text-center" id="exampleInputEmail1"
                                 aria-describedby="emailHelp" placeholder="Entrez un nom"/>
                        </div>
                        <button type="submit" className="btn btn-primary">Valider</button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Fermer</button>
              </div>
            </div>
          </div>
        </div>
        {/*Modal Plannifier*/}
        <div className="modal fade"  id="planModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog modal-md">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title text-center" id="exampleModalLabel">Fin d'élection</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <div className="container-fluid">
                  <div className="row">
                    <div className="col text-center">
                      <form className="text-center" style={{display: 'flex',flexWrap: 'wrap',marginLeft: '124px'}} >
                        <div className="d-flex flex-column bd-highlight mb-3">
                          <div className="p-2 bd-highlight">
                            <TextField
                              id="date"
                              label="Date"
                              type="date"
                              onChange={this.onSelectDate}
                              value={localStorage.getItem('value')}
                              defaultValue={this.state.value}
                              inputProps={{ min: new Date().toISOString().slice(0, 10) }}
                              InputLabelProps={{
                                shrink: true
                              }}
                            />
                          </div>
                          <div className="p-2 bd-highlight">
                            {/*<button onClick={this.onSubmitEndDate} type="button" className="btn btn-primary">Valider</button>*/}
                          </div>
                        </div>
                        <br/>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Fermer</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }


}

export default Responsable;
