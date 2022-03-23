import React, {Component} from 'react';
import Election from '../../ethereum/election'
import web3 from '../../ethereum/web3';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import {Badge, Button, Card, CardGroup, Col, Container, Form, Modal, Row, Stack} from "react-bootstrap";

class Responsable extends Component {

  constructor(props) {
    super(props);
    this.getCards = this.getCards.bind(this);
    this.getCandidates = this.getCandidates.bind(this);
    this.onSelectDate = this.onSelectDate.bind(this);
    this.onAddCandidate = this.onAddCandidate.bind(this);
    this.onShowListModal = this.onShowListModal.bind(this);


    this.state = {
      accounts: '',
      responsibleAddr: '',
      election: '',
      candidateCount: '',
      candidates: '',
      endDate: '',
      isEnd: '',
      today: '',
      value: '',
      candidateName: '',
      showAddModal: false,
      showListModal: false,
      showDatePickerModal: false,
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

   onShowListModal(){
    this.setState({showListModal: true});
    this.getCandidates().then(p => p);
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
          buttons: [
            <Button onClick={this.onShowListModal} variant="outline-primary" type="submit">Lister</Button>,
            <Button style={{marginLeft: 12}} onClick={() => this.setState({showAddModal: true})} type="submit" variant="outline-success">Ajouter</Button>
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
            <Button onClick={() => this.setState({showDatePickerModal: true})} type="submit" variant="outline-primary">Plannifier</Button>,
            <h5>Date de fin: <span className="badge bg-secondary mt-3">{this.getDateFormat(new Date(localStorage.getItem('value')))}</span></h5>
          ]
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
      return <Card key={index} style={{ width: '40px'}}>
          <Card.Img variant="top" src={imgUrl} />
          <Card.Body className="text-center">
            <Card.Title>{item.name}</Card.Title>
            <h5><Badge bg="warning">{item.voteCount}</Badge></h5>
          </Card.Body>
        </Card>
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
     localStorage.setItem('isEnd', isEndOfElection);
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
      this.props.onGetElectionStatus(true);
    }
  }

   onAddCandidate = async (event) => {
    //Prevent the "Submit" function to be executed unintentionally
    event.preventDefault();
    //this.setState({loading: true, errorMessage: ''});
    const election = Election;
    console.log(event);
    // try {
    //   await election.methods.addCandidate(web3.utils.fromAscii(event.target.value)).send({
    //     from: this.state.accounts[0]
    //   });
    //
    //   console.log('OK',event.target.value);
    //
    // }catch (err) {
    //   this.setState({errorMessage: err.message});
    // }

    // this.setState({loading: false});
    // this.setState({isAdded: true});
     this.setState({candidateName: ''});
  }

   handleClose = () => {
    this.setState({showAddModal: false});
    this.setState({showListModal: false});
    this.setState({showDatePickerModal: false});
  };

  render() {
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
              <h5><Badge className="text-black" style={{fontWeight: '12px'}} bg="light"><b>{this.state.accounts[0]}</b></Badge></h5>
            </Stack>
          </Col>
          <Col />
        </Row>
        {this.getCards().map((item,index) => {
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
          show={this.state.showListModal}
          onHide={this.handleClose}
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
                {this.renderCandidates()}
              </CardGroup>
            </Container>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleClose}>
              Fermer
            </Button>
          </Modal.Footer>
        </Modal>
        {/*Modal Ajouter*/}
        <Modal
          size="md"
          show={this.state.showAddModal}
          onHide={this.handleClose}
          aria-labelledby="example-modal-sizes-title-lg"
        >
          <Modal.Header closeButton>
            <Modal.Title id="example-modal-sizes-title-lg">
              Ajout de candidat
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>...</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleClose}>
              Fermer
            </Button>
          </Modal.Footer>
        </Modal>
        {/*Modal Plannifer*/}
        <Modal
          size="md"
          show={this.state.showDatePickerModal}
          onHide={this.handleClose}
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
                    onChange={this.onSelectDate}
                    value={localStorage.getItem('value')}
                    defaultValue={this.state.value}
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
            <Button variant="secondary" onClick={this.handleClose}>
              Fermer
            </Button>
          </Modal.Footer>
        </Modal>

      </Container>

    )
  }


}

export default Responsable;
