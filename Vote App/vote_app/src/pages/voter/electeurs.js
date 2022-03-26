import React from 'react';
import Election from '../../ethereum/election'
import web3 from '../../ethereum/web3';
import {useState, useEffect} from "react";
import {useParams} from 'react-router-dom';
import {Alert, Badge, Button, Card, CardGroup, Col, Container, Form, Modal, Row, Spinner, Stack} from "react-bootstrap";



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
      <Container>

      </Container>
    );

}

export default Electeurs;
