import React, {useReducer} from 'react';
import Election from '../../ethereum/election'
import web3 from '../../ethereum/web3';
import {useState, useEffect} from "react";
import {useParams} from 'react-router-dom';
import {
  Alert,
  Badge,
  Button,
  Card,
  CardGroup,
  Col,
  Container,
  Form,
  Modal,
  Row,
  Spinner,
  Stack, Toast,
  ToastContainer
} from "react-bootstrap";
import TextField from "@material-ui/core/TextField";



const Electeurs = (props) => {

  const [accounts, setAccount] = useState('');
  const [delegateAddress, setdelegateAddress] = useState('');
  const [value, setValue] = useState('');
  const [election, setElection] = useState(Election);
  // const [candidateCount, setCandidateCount] = useState('');
  const [allCandidates, setAllCandidates] = useState('');
  const [isEnded, setIsEnded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [delegateLoading, setDelegateLoading] = useState(false);
  const [isVoted, setIsVoted] = useState(false);
  const [isDeleguated, setIsDeleguated] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [errorMessageDeleguation, setErrorMessageDeleguation] = useState('');
  const [isSelected, setIsSelected] = useState(false);
  const [showVoteModal, setShowVoteModal] = useState(false);
  const [candidateName, setCandidateName] = useState('');
  const [candidateId, setCandidateId] = useState(0);
  const [voter, setVoter] = useState('');
  const [delegate, setDelegate] = useState(true);
  const [alertShow, setAlertShow] = useState(false);

  //userReducer to immediatly refresh component after an update's value
  const [reducerValue, forceUpdate] = useReducer(x => x + 1, 0);


  let { isEnd } = useParams();
  let accountsDeleguates = [];

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
    setAlertShow(true);

  }, [reducerValue,isEnd]);





  const onElectionEnded = () => {
    setIsEnded(localStorage.getItem('isEnd'));
    console.log('COUCOU => ', isEnd);
    //forceUpdate();
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

  const onSubmitVote = async (id) => {
    //Prevent the "Submit" function to be executed unintentionally
    //event.preventDefault();
    setLoading(true);
    setIsVoted(false);
    setErrorMessage('');
    console.log('OKOKOK');
    try {
      await election.methods.vote(id)
        .send({
          from: value
        })
      setIsVoted(true);
      setLoading(false);
      forceUpdate();
    }catch (err) {
      setErrorMessage((err.message.toLowerCase().includes('Already voted'.toLowerCase()) || 'Transaction has been reverted by the EVM'.toLowerCase()) ? 'L\'adresse de l\'électeur a été utilisée pour le vote': (err.message.toLowerCase().includes('Insufficiant funds'.toLowerCase())) ? 'Vous n\'avez pas assez de fonds' : '');
      console.log(err.message);
      setIsVoted(false);
      setLoading(false);
    }
   // forceUpdate();
  }
  const onDelegateVote = async (delegateTo,candidateID) => {

    //Prevent the "Submit" function to be executed unintentionally
    //event.preventDefault();
    setDelegateLoading(true);
    setErrorMessageDeleguation('')
    try {
      await election.methods.delegate(delegateTo,candidateID)
        .send({
          from: value
        })
      setIsDeleguated(true)
      forceUpdate();
    }catch (err) {
      setErrorMessageDeleguation((err.message.toLowerCase().includes('Already voted'.toLowerCase())) ? 'L\'adresse de l\'électeur ou du délégué a été utilisée pour le vote': (err.message.toLowerCase().includes('Insufficient funds'.toLowerCase())) ? 'Vous n\'avez pas assez de fonds' : '');
      //this.setState({errorDelegationMessage: err.message});
      console.log(err.message);
      setIsDeleguated(false)
     // console.log(this.state.voterAccount);
    }

    setDelegateLoading(false)
    // window.location.reload(false);
    // setTimeout(this.onClose(),2000);

  }
  const handleClose = () => {
    setShowVoteModal(false);
    setIsVoted(false);
    setIsDeleguated(false);
    setDelegate(false)
  };


  const onShowVoteModal = (name,id) => {
    console.log(web3.utils.hexToUtf8(name))
    console.log(id)
    setCandidateName(web3.utils.hexToUtf8(name))
    setCandidateId(id);
    setShowVoteModal(true);
    setIsVoted(false);
    setErrorMessage('');
    setErrorMessageDeleguation('');
    setLoading(false)
    setDelegateLoading(false)
    setDelegate(false);
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
                  <div>
                    <Button disabled={isEnded == 'true' || isSelected == false || value == 'Selectionnez une adresse de vote'} onClick={() => {onShowVoteModal(item.name,item.id)}} variant="primary">Vote</Button>

                  </div>
                {/*Modal Plannifer*/}
                <Modal
                  size="lg"
                  show={showVoteModal}
                  onHide={handleClose}
                  aria-labelledby="example-modal-sizes-title-lg"
                >
                  <Modal.Header closeButton>
                    <Modal.Title id="example-modal-sizes-title-lg text-center">
                      Candidat: {candidateName}
                    </Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <Container>
                      <Row>
                        <Col className="text-center">

                            {errorMessage && <Alert variant="danger"><Alert.Heading>Oops!</Alert.Heading><p>{errorMessage}</p></Alert>}
                            {(isVoted === true) && <Alert variant="success"><Alert.Heading>Vous venez de voter {candidateName}</Alert.Heading><p></p></Alert>}
                          <Button className="mt-4" disabled={isEnded == 'true' || loading == true || isSelected == false || value == 'Selectionnez une adresse de vote'} onClick={() => onSubmitVote(candidateId)} variant="primary">
                            {(loading == true) && <Spinner
                              as="span"
                              animation="grow"
                              size="sm"
                              role="status"
                              aria-hidden="true"
                            />}
                            Voter
                          </Button>
                        </Col>
                        <Col className="border-start border-3">
                          {errorMessageDeleguation && <Alert variant="danger"><Alert.Heading>Oops!</Alert.Heading><p>{errorMessageDeleguation}</p></Alert>}
                          {(isDeleguated === true) && <Alert variant="success"><Alert.Heading><p style={{overflowWrap: 'break-word'}}>Vous venez de déleguer votre vote à l'adresse {delegateAddress}</p></Alert.Heading><p></p></Alert>}
                          <Form className="text-center">
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                              <Form.Select  style={{width: '90%',marginLeft: 16}}  onChange={onSelectionDeleguate.bind(this)} >
                                <option defaultValue>Selectionnez une adresse</option>
                                {renderDeleguates().map((item) => {
                                  // console.log(item);
                                  return <option key={item} value={item} >{item}</option>;
                                })}
                              </Form.Select>
                            </Form.Group>
                            {(delegate === true) && <Alert variant="warning"><Alert.Heading>oops!</Alert.Heading><p>{delegateAddress} a été utilisée</p></Alert>}
                            {(delegate === false && delegateAddress) && <Button onClick={() => onDelegateVote(delegateAddress, candidateId)} variant="primary">
                              {(delegateLoading == true) && <Spinner
                                as="span"
                                animation="grow"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                              />}
                              Déléguer
                            </Button>}
                          </Form>
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
    console.log(voterOptions);
    return voterOptions;
  }

  const renderDeleguates = () => {
    const deleguateOptions = [];
    for (let i = 0; i < accounts.length; i++) {
      if(accounts[i] === accounts[0] || accounts[i] === value){continue;}
      deleguateOptions[i] = accounts[i];
    }
    console.log(deleguateOptions);
    return deleguateOptions;
  }

  const onSelection = (event) =>  {
     setValue(event.target.value);
     setIsSelected(true);
     console.log(event.target.value);
    election.methods.voters(event.target.value).call().then((result)=>{
      setVoter(result)
      //console.log(result.voted);
    });
   // console.log(voter);
  };


  const onSelectionDeleguate = (event) =>  {
    // setValue(event.target.value);
    // setIsSelected(true);
    setdelegateAddress(event.target.value);
    console.log('DELEGUATE => ',event.target.value);
    election.methods.voters(event.target.value).call().then((result)=>{
      setDelegate(result.voted)
      //console.log(result.voted);
    });
  };


    return (
      <Container>
        <Row className="mt-5">
          <Col> <h3>Espace électeurs</h3></Col>
          <Col />
        </Row>
        {(isEnded == 'true') && <Row className="mt-3 text-center">
          <Col/>
          <Col>
            <Alert className="border-warning border-5" show={alertShow} variant="warning">
              <Alert.Heading>Bienvenue</Alert.Heading>
              <p style={{fontWeight: 'bold'}}>
                Session électorale terminée vous ne pouvez pas voter
              </p>
              <hr />
              <div className="d-flex justify-content-end">
                <Button onClick={() => setAlertShow(false)} variant="outline-warning">
                  Fermer
                </Button>
              </div>
            </Alert>
          </Col>
          <Col/>
        </Row>}
        {(isEnded == 'false') && <Row className="mt-3 text-center">
          <Col/>
          <Col>
            <Alert className="border-info border-5" show={alertShow} variant="info">
              <Alert.Heading>Bienvenue</Alert.Heading>
              <p style={{fontWeight: 'bold'}}>
                Sélectionnez une adresse et votez
              </p>
              <hr />
              <div className="d-flex justify-content-end">
                <Button onClick={() => setAlertShow(false)} variant="outline-info">
                  Fermer
                </Button>
              </div>
            </Alert>
          </Col>
          <Col/>
        </Row>}
        <Row className="mt-3">
          <Col className="float-start">
            <Form.Select  disabled={isEnded == 'true'} style={{width: '60%',marginLeft: 12}}  onChange={onSelection.bind(this)} >
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
          {(voter.voted === true) && <Alert className="text-center border-warning border-5"  variant="warning"><Alert.Heading style={{fontSize: '45px'}}>Oops!</Alert.Heading><p style={{fontSize: '20px'}}>L'adresse <span style={{fontWeight: 'bold'}} >"{value}"</span> n'est plus utilisable pour voter</p></Alert>}
          {(Array.from(allCandidates).length == 0) && <Alert className="text-center border-secondary border-5"  variant="secondary"><Alert.Heading style={{fontSize: '45px'}}></Alert.Heading><p style={{fontSize: '20px'}}>Aucun candidat</p></Alert>}
          {(voter.voted === false) && renderCandidates()}
        </Row>
      </Container>
    );

}

export default Electeurs;
