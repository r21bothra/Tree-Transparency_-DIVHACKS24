pragma solidity ^0.8.0;

contract TreeVerification {
    struct Tree {
        uint id;
        string species;
        uint location;
        uint plantingDate;
        address verifier;
    }

    mapping (uint => Tree) public trees;
    mapping (address => uint) public verifierStake;
    uint public totalStake;
    uint public rewardPerTree;

    function depositStake(uint _value) public payable{
        require(msg.value == _value, "Incorrect deposit amount.");
        verifierStake[msg.sender] += _value;
        totalStake += _value;
    }

    function verifyTree(uint _id, string memory _species, uint _location, uint _plantingDate) public {
        address payable sender = payable(msg.sender);
        require(verifierStake[sender] > 0, "Verifier has no stake in the network.");
        trees[_id] = Tree(_id, _species, _location, _plantingDate, sender);
        rewardPerTree = totalStake * 5 / verifierStake[sender] * 100;
        sender.transfer(rewardPerTree);
    }

    function confiscateStake(address _verifier) public {
        require(verifierStake[_verifier] > 0, "Verifier has no stake to confiscate.");
        totalStake -= verifierStake[_verifier];
        verifierStake[_verifier] = 0;
    }
}
