pragma solidity ^0.5.12;

contract Deed{
    address public lawyer;
    address payable public beneficiary;
    uint public earliest;

    constructor (
        address _lawyer,
        address payable _beneficiary,
        uint fromNow
    ) public payable {
        require(msg.value > 0, 'amount is invalid');
        lawyer = _lawyer;
        beneficiary = _beneficiary;
        earliest = now + fromNow;
    }

    function withdrawal() public{
        require(msg.sender == lawyer, 'lawyer only');
        require(now >= earliest, 'too early');
        beneficiary.transfer(address(this).balance);
    }
}