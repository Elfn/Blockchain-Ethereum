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
      return <Card key={index} className="text-center mt-3" style={{width: '15rem',marginLeft: 12,backgroundColor: '#FBFBFB'}}>
              <Card.Img variant="top" src={imgUrl} />
              <Card.Body>
                <Card.Title>{web3.utils.hexToUtf8(item.name)}</Card.Title>
                <Card.Text><div className=""><h5><Badge bg="success">{item.voteCount}</Badge></h5></div></Card.Text>
                <Stack direction="horizontal" gap={3}>
                  <div><Button disabled={isEnded == 'true'} variant="primary">Voter</Button></div>
                  <div><Button disabled={isEnded == 'true'} variant="secondary">Déléguer</Button></div>
                </Stack>
              </Card.Body>
            </Card>
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
        <Row className="mt-5">
          <Col> <h3>Espace électeurs</h3></Col>
          <Col />
        </Row>
        {(isEnded == 'true') && <Row className="mt-5 text-center">
          <Col/>
          <Col>
            <Alert className="border-warning border-5" variant="warning"><Alert.Heading >Session électorale terminée vous ne pouvez pas voter</Alert.Heading></Alert>
          </Col>
          <Col/>
        </Row>}
        {(isEnded == 'false') && <Row className="mt-5 text-center">
          <Col/>
          <Col><Alert variant="info" className="border-info border-5" ><Alert.Heading>Sélectionnez une adresse ensuite votez ou déléguez votre vote</Alert.Heading></Alert></Col>
          <Col/>
        </Row>}
        <Row className="mt-3">
          <Col className="float-start">
            <Form.Select  style={{width: '60%',marginLeft: 12}}  onChange={onSelection.bind(this)} >
              <option defaultValue>Selectionnez une adresse de vote</option>
              {renderVoters().map((item) => {
                // console.log(item);
                return <option key={item} value={item} >{item}</option>;
              })}
            </Form.Select>
          </Col>
          <Col />
        </Row>
        <Row className="mt-5">
          <Col>
            <Stack style={{marginLeft: 12}} direction="horizontal" gap={3}>
              {value && <div className=""><h5><Badge bg="success">Électeur</Badge></h5></div>}
              {value && <div><h5><Badge style={{fontWeight: '12px'}} className="text-dark" bg="light"><b>{value}</b></Badge></h5></div>}
              {/*<div>Third item</div>*/}
            </Stack>
          </Col>
          <Col />
        </Row>
        <Row className="mt-5">
          {renderCandidates()}
        </Row>
      </Container>
    );

}

export default Electeurs;
