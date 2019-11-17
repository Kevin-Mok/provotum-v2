pragma solidity ^0.5.0;

import './VoteProofVerifier.sol';
import './SumProofVerifier.sol';

// TODO: remove id from call signatures, try to use msg.sender

contract Ballot {

	event VoteStatusEvent(address indexed from, bool success, string reason);

	struct SystemParameters {
    uint p; // prime
    uint q; // prime factor: p = 2*q+1
    uint g; // generator
  }

	struct PublicKey {
		uint h;
	}

	struct Election {
		uint nrOfVoters;
		Voter[] voters;
		mapping(address => bool) hasVoted;
		string votingQuestion;
		SumProof sumProof;
	}

	struct Voter {
		address voterAddress;
		Cipher cipher;
		VoteProof voteProof;
	}

	struct Cipher {
		uint a;
		uint b;
	}

	struct VoteProof {
    uint[2] a;
    uint[2] b;
    uint[2] c;
    uint[2] f;
  }

	struct SumProof {
    uint a1;
    uint b1;
    uint d;
    uint f;
  }

	VoteProofVerifier voteVerifier;
	SumProofVerifier sumVerifier;

	SystemParameters private systemParameters;
	PublicKey private publicKey;
	Election private election;
	bool private IS_VOTING_OPEN;
	address private _owner;

	constructor() public{
		voteVerifier = new VoteProofVerifier();
		sumVerifier = new SumProofVerifier();

		IS_VOTING_OPEN = false;
		_owner = msg.sender;

		// initialize empty Election struct
		election.nrOfVoters = 0;
		election.voters.length = 0;
		election.votingQuestion = "REPLACEME";
		election.sumProof = SumProof(0,0,0,0);
	}

  function setParameters(uint[3] memory params) public {
      systemParameters = SystemParameters(params[0], params[1], params[2]);
  }

  function getParameters() public view returns (uint[3] memory) {
      return [systemParameters.p, systemParameters.q, systemParameters.g];
  }

	function setPublicKey(uint key) public {
			publicKey = PublicKey(key);
	}

	function getPublicKey() public view returns (uint) {
		return publicKey.h;
	}

	function createVerifiers() public {
		voteVerifier.initialize(systemParameters.p, systemParameters.q, systemParameters.g, publicKey.h);
		sumVerifier.initialize(systemParameters.p, systemParameters.q, systemParameters.g, publicKey.h);
	}

	function getVote(uint256 idx) public view returns(uint256, uint256) {
		return (election.voters[idx].cipher.a, election.voters[idx].cipher.b);
	}

	function getNumberOfVotes() public view returns(uint256) {
		return election.voters.length;
	}

	function openBallot() public {
		require(msg.sender == _owner);

		IS_VOTING_OPEN = true;
	}

	function closeBallot() public {
		require(msg.sender == _owner);

		IS_VOTING_OPEN = false;
	}

	function vote(
		uint[2] calldata cipher, // a, b
    uint[2] calldata a,
    uint[2] calldata b,
    uint[2] calldata c,
    uint[2] calldata f,
		address id) external returns(bool, string memory) {

		if(!IS_VOTING_OPEN) {
			emit VoteStatusEvent(msg.sender, false, "Vote not open");
			return (false, "Vote not open");
		}

		// TODO: Enable once system is ready
		// if(election.hasVoted[msg.sender]) {
		// 	emit VoteStatusEvent(msg.sender, false, "Voter already voted");
		// 	return (false, "Voter already voted");
		// }

		if(!verifyVote(cipher, a, b, c, f, msg.sender)) {
			emit VoteStatusEvent(msg.sender, false, "Proof not correct");
			return (false, "Proof not correct");
		}

		VoteProof memory voteProof = VoteProof(a,b,c,f);
		Cipher memory _cipher = Cipher(cipher[0], cipher[1]);
		Voter memory voter = Voter(msg.sender, _cipher, voteProof);

		election.voters.push(voter);
		election.nrOfVoters += 1;
		election.hasVoted[msg.sender] = true;

		emit VoteStatusEvent(msg.sender, true, "Vote was accepted");
		return (true, "Vote was accepted");
	}

	function submitSumProof(
		uint a,
		uint b,
		uint a1,
		uint b1,
		uint d,
		uint f,
		address id) external returns(bool, string memory) {
		
		if(IS_VOTING_OPEN) {
			emit VoteStatusEvent(msg.sender, false, "Vote is still ongoing");
			return (false, "Vote is still ongoing");
		}

		if(!verifySum(a, b, a1, b1, d, f, msg.sender)) {
			emit VoteStatusEvent(msg.sender, false, "Proof not correct");
			return (false, "Proof not correct");
		}

		SumProof memory sumProof = SumProof(a1, b1, d, f);
		election.sumProof = sumProof;

		emit VoteStatusEvent(msg.sender, true, "Sumproof accepted");
		return (true, "Sumproof accepted");

	}

	function verifyVote(
		uint[2] memory cipher, // a, b
    uint[2] memory a,
    uint[2] memory b,
    uint[2] memory c,
    uint[2] memory f,
		address id
	) public view returns(bool) {
		return voteVerifier.verifyProof(cipher, a, b, c, f, id);
	}

	function verifySum(
		uint a, // cipher
		uint b, // cipher
		uint a1,
		uint b1,
		uint d,
		uint f,
		address id
	) public view returns(bool) {
		return sumVerifier.verifyProof(a, b, a1, b1, d, f, id);
	}
}
