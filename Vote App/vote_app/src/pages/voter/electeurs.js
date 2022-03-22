import React from 'react';
import Election from '../../ethereum/election'
import web3 from '../../ethereum/web3';
import {useState, useEffect} from "react";
import {useParams} from 'react-router-dom';


const Electeurs = (props) => {



  let { isEnd } = useParams();

  useEffect(() => {
    console.log(
      "Occurs ONCE, AFTER the initial render."
    );
    console.log(
      "URL PARAM => ", isEnd
    );
    web3.eth.getAccounts().then( res => {setAccount(res)});
    getCandidates().then(r => r);
    renderVoters();
    onElectionEnded();
  }, []);


  const [accounts, setAccount] = useState('');
  const [value, setValue] = useState('');
  // const [election, setElection] = useState('');
  // const [candidateCount, setCandidateCount] = useState('');
  const [allCandidates, setAllCandidates] = useState('');
  const [isEnded, setIsEnded] = useState(false);


  const onElectionEnded = () => {
    setIsEnded(isEnd);
    console.log('COUCOU => ', isEnd);
  };


    //const election = Election;




  const getCandidates = async () => {
    const election = Election;
    const count = await election.methods.candidateCount().call();
    const candidates = await Promise.all(
      Array(parseInt(count))
        .fill()
        .map((element, index) => {
          return election.methods.candidates(index).call();
        }));
      setAllCandidates(candidates);
    console.log(candidates);

  }

  const renderCandidates = () => {

    console.log(allCandidates);
    return Array.from(allCandidates).map((item, index)=>{
      let imgUrl = `https://bootdey.com/img/Content/avatar/avatar${item.id}.png`;
      return <div key={index} className="card text-center mt-3" style={{width: '15rem',marginLeft: 12,backgroundColor: '#FBFBFB'}}>
        <img src={imgUrl} className="card-img-top" alt="..." />
          <div className="card-body">
            <h5 className="card-title">{item.name}</h5>
            <p className="card-text">Candidat à l'élection</p>
          </div>
          <h5><span className="badge badge bg-success">{item.voteCount}</span></h5>
          <div className="card-body">
            <div className="d-flex flex-row bd-highlight mb-1">
              <div className="p-2 bd-highlight">
                <button disabled={isEnded == 'true'} href="#" className="btn btn-outline-primary">Voter</button>
              </div>
              <div className="p-2 bd-highlight">
                <button disabled={isEnded == 'true'} href="#" className="btn btn-outline-secondary">Déléguer</button>
              </div>
            </div>
          </div>
      </div>
    });
  }

  const renderVoters = () => {
    const voterOptions = [];
    for (let i = 0; i < accounts.length; i++) {
      if(accounts[i] === accounts[0]){continue;}
      voterOptions[i] = accounts[i];
    }
    // // console.log(this.props.election);
    // this.props.accounts.forEach(item => {
    //   // if (item == this.props.accounts[0]) {
    //   //   return;
    //   // }
    //
    //   voterOptions.push( {  value: item, text:item })
    // })
    console.log(voterOptions);
    return voterOptions;
  }

  const onSelection = (event) =>  {
     setValue(event.target.value);
     console.log(event.target.value);
   };


    return (
      <div>
        <div className="container">
          <div className="row mt-5">
            <div className="col float-start">
              <h3>Espace électeurs</h3>
            </div>
            <div className="col">

            </div>
          </div>
          {isEnded == 'true' && <div className="row text-center"> <div className="col"></div><div className="alert alert-warning border-warning border-5 col" role="alert">Session électorale terminée vous ne pouvez pas voter</div><div className="col"></div></div>}
          {isEnded == 'false' && <div className="row text-center"> <div className="col"></div><div className="alert alert-info border-info border-5 col" role="alert">Sélectionnez une adresse ensuite votez ou déléguez votre vote</div><div className="col"></div></div>}
          <div className="row mt-3">
            <div className="col float-start">
              <select  disabled={isEnded == 'true'} style={{width: '60%',marginLeft: 12}} className="form-select form-select-md mb-1" aria-label=".form-select-lg example" onChange={onSelection.bind(this)} >
                <option defaultValue>Selectionnez une adresse de vote</option>
                {renderVoters().map((item) => {
                  // console.log(item);
                 return <option key={item} value={item} >{item}</option>;
                })}
              </select>
            </div>
            <div className="col">
            </div>
          </div>
          <div className="row mt-5">
            <div className="col">
              <div className="d-flex flex-row bd-highlight mb-2">
                {value && <div className="p-2 bd-highlight"><h5 className="float-start"><span className="badge badge bg-success">Électeur</span></h5></div>}
                <div className="p-2 bd-highlight"><h5 className="float-start"><span className="badge badge bg-light text-dark">{value}</span></h5></div>
                <div className="p-2 bd-highlight"></div>
              </div>
            </div>
          </div>
          <div className="row">
            {renderCandidates()}
          </div>
        </div>
      </div>
    );

}

export default Electeurs;
