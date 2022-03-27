// SPDX-License-Identifier: MIT
pragma solidity ^0.4.26;
pragma experimental ABIEncoderV2;


contract ElectionFactory{

  address[] public deployedElections;

  //endDate is the election's deadline
  function createElection() private {

    //Here msg.sender is the address of the campaign factory
    address newElection = address(new Election());
    deployedElections.push(newElection);

  }

  function getDeployedElections() public view returns (address[] memory){
    createElection();
    return deployedElections;

  }


}

contract Election{



  struct Candidate {
    uint id;
    string name;
    string imageUrl;
    uint voteCount;
  }

  struct Voter {
    uint weight; // weight is accumulated by delegation
    bool voted;  // if true, that person already voted
    address delegate; // person delegated to
    uint vote;   // index of the voted proposal
  }


  address public electionManager;
  Candidate[] public candidates;
  //  uint256 public electionDeadline;
  bool isEnded = false;
  //mapping(uint => Candidate) public candidates;
  uint public candidateCount = 0;
  uint private imageId = 4;
  mapping(address => Voter) public voters;
  string  url = string(abi.encodePacked("https://bootdey.com/img/Content/avatar/avatar",imageId,".png"));
  Candidate private _winner;


  event voteEvent(uint _candidateId);

  constructor() public {
    electionManager = msg.sender;

    //    addCandidate("A");
    //    addCandidate("B");
    //    addCandidate("C");
    //    addCandidate("D");
    //    addCandidate("E");
    //    addCandidate("F");
    // candidates[0].voteCount=1;

  }

  function addCandidate(string  _name) public  restricted {
    candidateCount++;
    imageId++;
    //candidates[candidateCount] = Candidate(candidateCount, _name, 0);
    candidates.push(Candidate( candidateCount, string(_name), url,0));
  }

  //Election manager has to grant vote's right to voter before he can vote
  // function giveRightToVote(address voter) public {

  //   require(
  //     msg.sender == electionManager,
  //     "Only manager can give right to vote."
  //   );
  //   require(
  //     !voters[voter].voted,
  //     "The voter already voted."
  //   );
  //   require(voters[voter].weight == 0, "The voter already have enought weight to vote");
  //   voters[voter].weight = 1;
  // }

  //Before voting voter must have been granted by election manager
  function vote(uint _candidateId) public  {
    _candidateId -=1;
    Voter storage sender = voters[msg.sender];
    // require(sender.weight != 0, "Has no right to vote");
    require(!sender.voted, "Already voted.");
    require(_candidateId >= 0 && _candidateId <= candidateCount, "Wrong ID for candidate");

    sender.voted = true;
    sender.weight += 1;
    candidates[_candidateId].voteCount += sender.weight;
    sender.vote = _candidateId;

    emit voteEvent(_candidateId);

  }


  //Voter can delegate his vote to another voter and that will
  //increase his vote's(the delegate) weight by 1
  function delegate(address delegateTo, uint _candidateId) public {

    sender.weight += 1;

    // assigns reference
    Voter storage sender = voters[msg.sender];
    require(!sender.voted,"Already voted so can't delegate");

    // Avoid self-delegation
    require(delegateTo != msg.sender);


    while (voters[delegateTo].delegate != address(0)) {
      delegateTo = voters[delegateTo].delegate;
      //Sender cannot delegate to himself
      // We found a loop in the delegation, not allowed.
      require(delegateTo != msg.sender, "Found loop in delegation.");
    }

    // Since `sender` is a reference, this
    // modifies `voters[msg.sender].voted`
    sender.voted = true;
    sender.delegate = delegateTo;
    Voter storage delegate_ = voters[delegateTo];
    delegate_.vote = _candidateId-1;
    if (delegate_.voted) {
      // If the delegate already voted,
      // directly add to the number of votes
      candidates[delegate_.vote].voteCount += sender.weight;
      sender.vote = _candidateId;
    } else {
      // If the delegate did not vote yet,
      // add to her weight.
      delegate_.weight += sender.weight;
      candidates[_candidateId-1].voteCount += 1;
      //      delegate_.voted = true;

    }
  }


  // //A winner must be defined
  // function winningCandidate() public restricted view returns () {

  //   return _winner;
  // }
  function copyBytes(bytes memory _bytes) private pure returns (bytes memory)
  {
    bytes memory copy = new bytes(_bytes.length);
    uint256 max = _bytes.length + 31;
    for (uint256 i=32; i<=max; i+=32)
    {
      assembly { mstore(add(copy, i), mload(add(_bytes, i))) }
    }
    return copy;
  }

  //Give winner name
  function winner()  public view returns (uint,string)
  {

    // //Check if today date is equal to the deadline date
    // require( (isEnded == false), "The election is not ended");
    uint bestScrore = candidates[0].voteCount;
    string memory message;

    for (uint p = 0; p < candidates.length; p++) {
      if(candidates[p].voteCount > bestScrore) {
        bestScrore = candidates[p].voteCount;
        _winner = getOneCandidate(p+1);
        message = "There is a winner";
      }
      else if(candidates[p].voteCount == bestScrore){
        _winner = getOneCandidate(p+1);
        message = "Equality";
      }
    }
    //require(bytes(winningCandidate().name).length > 0 , "The election is not ended");
    return (_winner.id,message);
  }




  function getCandidates() public restricted  view returns  (Candidate[] memory){
    return candidates;
  }

  function getElectionEnded() public restricted view returns (bool){
    isEnded = true;
    return isEnded;
  }

  function getOneCandidate(uint _candidateId) public  restricted view returns  (Candidate memory){
    _candidateId -= 1;
    return candidates[_candidateId];
  }

  function getSummary() public view returns (uint, Candidate[], address){
    return (candidateCount,candidates,electionManager);

  }

  modifier restricted(){
    require(msg.sender == electionManager);
    _;
  }

}
