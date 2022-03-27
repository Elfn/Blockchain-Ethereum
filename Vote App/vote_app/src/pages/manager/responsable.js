import React, {Component} from 'react';
import Election from '../../ethereum/election'
import web3 from '../../ethereum/web3';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import {Alert, Badge, Button, Card, CardGroup, Col, Container, Form, Modal, Row, Spinner, Stack} from "react-bootstrap";
import {BrowserRouter as Router, Routes, Route, BrowserRouter} from 'react-router-dom';
import {useState, useEffect, useReducer} from "react";

function Responsable(props) {

  const [accounts, setAccount] = useState('');
  const [responsibleAddr, setResponsibleAddr] = useState('');
  const [election, setElection] = useState(Election);
  const [candidateCount, setCandidateCount] = useState('');
  const [candidates, setCandidates] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isEnd, setIsEnd] = useState('');
  const [today, setToday] = useState('');
  const [value, setValue] = useState('');
  const [candidateName, setCandidateName] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [showListModal, setShowListModal] = useState(false);
  const [showDatePickerModal, setShowDatePickerModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [winnerName, setWinnerName] = useState('');
  const [winnerVoteCount, setWinnerVoteCount] = useState(0);
  const [winnerLoading, setWinnerLoading] = useState(false);
  const [winnerMessage, setWinnerMessage] = useState(false);

  //userReducer to immediatly refresh component after an update's value
  const [reducerValue, forceUpdate] = useReducer(x => x + 1, 0);


  useEffect(() => {

    web3.eth.getAccounts().then(res => {
      setAccount(res)
    });
    //this.setState({election: election});


    election.methods.candidateCount().call().then(count => setCandidateCount(count));
    //onCheckDate();

//We have to put "reducerValue" in dependencies
// array of useEffect to enable refresh when there
// is a change of value(More than one time)
  }, [reducerValue]);





  const getDateFormat = (date) => {
    return ((date.getDate() < 10) ?  '0'+date.getDate() : date.getDate())+'/'+((date.getMonth() + 1) < 10 ? '0'+(date.getMonth() + 1) : (date.getMonth() + 1))+'/'+date.getFullYear();
  }

  const onShowListModal = () => {
    setShowListModal(true);
    getCandidates().then(p => p);
  }

  const getCards = () => {
    const items = [
      [
        {
          title: accounts.length - 1,
          subtitle: 'Nombre de comptes',
          text: 'Nombre de comptes disponibles pour les votes',
          buttons: []
          // style: {overflowWrap: 'break-word', marginLeft: 12, width: 18}
        },
        {
          title: accounts[0],
          subtitle: 'Manager adresse',
          text: 'Adresse du manager de l\'election',
          buttons: []
          // style: {overflowWrap: 'break-word', marginLeft: 12, width: 18}
        }
      ],
      [
        {
          title: candidateCount,
          subtitle: 'Nombre de candidats',
          text: 'Nombre de candidats de la session électorale',
          buttons: [
            <Button onClick={onShowListModal} variant="outline-primary" type="submit">Lister</Button>,
            <Button style={{marginLeft: 12}} onClick={() => setShowAddModal(true)} type="submit" variant="outline-success">Ajouter</Button>
          ]
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
          buttons: [
            <Stack direction="horizontal" gap={3}><div className="bg-light border"><Button onClick={() => setShowDatePickerModal(true)} type="submit" variant="outline-primary">Plannifier</Button></div><div className="">{(localStorage.getItem('isEnd') === 'true') && <h5><Badge className="text-white" bg="secondary">Terminée</Badge></h5>}</div></Stack>,
            <h5>Date de fin: <span className="badge bg-secondary mt-3">{getDateFormat(new Date(localStorage.getItem('value')))}</span></h5>
          ]
          // style: {overflowWrap: 'break-word', marginLeft: 12, width: 18}
        }
      ]
    ];
    console.log(Array.from(items));
    return Array.from(items);
  }

  const getCandidates = async () => {
    console.log('AAAAAAAAA');
    const allCandidates = await Promise.all(
      Array(parseInt(candidateCount))
        .fill()
        .map((element, index) => {
          return election.methods.candidates(index).call();
        })
    );
    setCandidates(allCandidates);
    console.log("AALLLAALLLAAALLLAALL => ",candidates);
    //return allCandidates;
  }

  const renderCandidates = () => {
    return Array.from(candidates).map((item, index)=>{
      let imgUrl = `https://bootdey.com/img/Content/avatar/avatar${item.id}.png`;
      return <Card key={index} style={{ width: '40px'}}>
          <Card.Img variant="top" src={imgUrl} />
          <Card.Body className="text-center">
            <Card.Title>{web3.utils.hexToUtf8(item.name)}</Card.Title>
            <h5><Badge bg="warning">{item.voteCount}</Badge></h5>
          </Card.Body>
        </Card>
    });
  }

   const onSelectDate = (e) => {
     let endDate = new Date(e.target.value).toLocaleDateString("fr-FR");
     setValue(e.target.value);
     localStorage.setItem('value',e.target.value);
     setEndDate(endDate);
     const todayDate = new Date().toLocaleDateString("fr-FR");
     setToday(todayDate);
     const  isEndOfElection = (endDate === todayDate);
     // console.log(new Date(e.target.value).toLocaleDateString("fr-FR"));
     setIsEnd(isEndOfElection);
     localStorage.setItem('isEnd', isEndOfElection);
     console.log('IN RESPONSIBLE ',isEndOfElection);
     props.onGetElectionStatus(isEndOfElection);
     // if(localStorage.getItem('isEnd') == 'true'){
     //   election.methods.winner().call().then((name) => {
     //        setWinnerName(name);
     //        localStorage.setItem('winner',name);
     //     console.log(name);
     //   });
     // }
  }

  const onCheckDate = () => {
    const  isEndOfElection = (endDate === today);
    // console.log(new Date(e.target.value).toLocaleDateString("fr-FR"));
    setIsEnd(isEndOfElection);
    localStorage.setItem('isEnd', isEndOfElection);
    forceUpdate();
  }

  const onAddCandidate = async (event) => {
    //Prevent the "Submit" function to be executed unintentionally
    event.preventDefault();
      if(candidateName == ''){
        setErrorMessage('Saisissez une valeur');
        setLoading(false);
        return;
      }
      setLoading(true);
      setIsAdded(false);
      setErrorMessage('');
      console.log(candidateName);

    try {

        await election.methods.addCandidate(web3.utils.fromAscii(candidateName)).send({
          from: accounts[0]
        });

      console.log('OK',event.target.value);
      setIsAdded(true);
     // window.location.reload('/responsable');
      forceUpdate();

    }catch (err) {
      setErrorMessage(err.message);
    }

    setLoading(false);
    setCandidateName('');


  }

  const onShowResultModal = () => {
    setShowResultModal(true);
  };

  const onGetWinner = () => {
    //Prevent the "Submit" function to be executed unintentionally
    //event.preventDefault();
    setWinnerLoading(true);
    setWinnerMessage('');
    console.log('OKOKOK');
    try {
       election.methods.winner()
        .send({
          from: accounts[0]
        }).then((res) => {
         console.log(res);
       })
      setWinnerLoading(false);
       onShowResultModal();
      forceUpdate();
    }catch (err) {
      setWinnerMessage((err.message.toLowerCase().includes('Already voted'.toLowerCase())) ? 'L\'adresse de l\'électeur a été utilisée pour le vote': (err.message.toLowerCase().includes('Insufficiant funds'.toLowerCase())) ? 'Vous n\'avez pas assez de fonds' : '');
      // console.log(err.message);
      setWinnerLoading(false);
    }
    // forceUpdate();
  }


  const handleClose = () => {
    setShowAddModal(false);
    setShowListModal(false);
    setShowDatePickerModal(false);
    setIsAdded(false);
    setShowResultModal(false);

  };

    return (

      <Container>
        <Row>
          <Col className="mt-5"><h3>Espace responsable</h3></Col>
          <Col />
        </Row>
        <Row>
          <Col className="mt-4">
            <Stack direction="horizontal" gap={3}>
              <h5><Badge bg="warning">Responsable</Badge></h5>
              <h5><Badge className="text-black" style={{fontWeight: '12px'}} bg="light"><b>{accounts[0]}</b></Badge></h5>
            </Stack>
          </Col>
          <Col />
        </Row>
        {getCards().map((item,index) => {
          return <Row key={index} className="mt-4">
            {item.map((subitem,subindex) => {
              return <Col key={subindex} >
                <Card style={{overflowWrap: 'break-word', marginLeft: 12, width: '18rem', backgroundColor: '#FBFBFB'}}>
                  <Card.Body>
                    <Card.Title>{subitem.title}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">{subitem.subtitle}</Card.Subtitle>
                    <Card.Text>
                      {subitem.text}
                    </Card.Text>
                    {Array.from(subitem.buttons).map((btn)=> {
                      return btn;
                    })}
                  </Card.Body>
                </Card>
              </Col>;
            })}
            <Col></Col>
            <Col></Col>
          </Row>
        })}
        {/*Modal Lister*/}
        <Modal
          size="lg"
          show={showListModal}
          onHide={handleClose}
          aria-labelledby="example-modal-sizes-title-lg"
        >
          <Modal.Header closeButton>
            <Modal.Title id="example-modal-sizes-title-lg">
              Liste des candidats
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Container>
              <CardGroup>
                {renderCandidates()}
              </CardGroup>
            </Container>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Fermer
            </Button>
          </Modal.Footer>
        </Modal>
        {/*Modal Ajouter*/}
        <Modal
          size="md"
          show={showAddModal}
          onHide={handleClose}
          aria-labelledby="example-modal-sizes-title-lg"
        >
          <Modal.Header closeButton>
            <Modal.Title id="example-modal-sizes-title-lg">
              Ajout de candidat
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {/*FORMULAIRE D'AJOUT*/}
            <Form className="text-center">
              {(isAdded == true) && <Alert variant="success"><Alert.Heading>Candidate ajouté</Alert.Heading></Alert>}
              {(errorMessage) && <Alert variant="danger"><Alert.Heading>{errorMessage}</Alert.Heading></Alert>}
              <Form.Group className="mb-3" controlId="formBasicName">
                {/*<Form.Label>Email address</Form.Label>*/}
                <Form.Control disabled={loading == true} value={candidateName} onChange={event => setCandidateName(event.target.value)} className="text-center" type="text" placeholder="Entrez le nom du candidat" />
              </Form.Group>
              <Button
                disabled={loading == true}
                onClick={onAddCandidate}
                variant="primary"
                type="submit">
                {(loading == true) && <Spinner
                  as="span"
                  animation="grow"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />}
                Ajouter
              </Button>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Fermer
            </Button>
          </Modal.Footer>
        </Modal>
        {/*Modal Plannifer*/}
        <Modal
          size="md"
          show={showDatePickerModal}
          onHide={handleClose}
          aria-labelledby="example-modal-sizes-title-lg"
        >
          <Modal.Header closeButton>
            <Modal.Title id="example-modal-sizes-title-lg">
              Date de fin d'élection
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Container>
              <Row>
                <Col className="text-center">
                  <TextField
                    id="date"
                    label="Date"
                    type="date"
                    onChange={onSelectDate}
                    value={localStorage.getItem('value')}
                    defaultValue={value}
                    inputProps={{ min: new Date().toLocaleDateString('fr-CA') }}
                    InputLabelProps={{
                      shrink: true
                    }}
                  />
                </Col>
              </Row>
            </Container>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Fermer
            </Button>
          </Modal.Footer>
        </Modal>
        {/*Modal Resultat*/}
        <Modal
          size="md"
          show={showResultModal}
          onHide={handleClose}
          aria-labelledby="example-modal-sizes-title-lg"
        >
          <Modal.Header closeButton>
            <Modal.Title id="example-modal-sizes-title-lg">
              Resultat de l'élection
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Container>
              <Row>
                <Col className="text-center">
                  <Card className="text-center">
                    <Card.Header><b style={{fontSize: 'large',fontWeight: 'bold'}}>Vainqueur</b></Card.Header>
                    <Card.Img height={380}  variant="top" src="https://bootdey.com/img/Content/avatar/avatar1.png" />
                    <Card.Body>
                      <Card.Title>Nom</Card.Title>
                      <Card.Text>
                        Gagne avec un total de """" votes
                      </Card.Text>
                    </Card.Body>
                    {/*<Card.Footer className="text-muted">2 days ago</Card.Footer>*/}
                  </Card>
                </Col>
              </Row>
            </Container>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Fermer
            </Button>
          </Modal.Footer>
        </Modal>

      </Container>

    )

}

export default Responsable;
