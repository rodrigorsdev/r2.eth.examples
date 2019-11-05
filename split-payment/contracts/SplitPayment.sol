pragma solidity ^0.5.12;

contract SplitPayment {

    address public owner;

    modifier isOwner()
    {
        require(
            owner == msg.sender,
            'is not the owner'
        );
        _;
    }

    constructor (address _owner) public {
        owner = _owner;
    }

    function send(
        address payable[] memory to, 
        uint[] memory amount
    ) public
        isOwner()
      payable
    {
        require(to.length == amount.length, 'number of receivers must be equal number of amounts');

        uint totalAmount = 0;

        for(uint i = 0; i < amount.length; i++){
            totalAmount = totalAmount + amount[i];
        }

        require(msg.value >= totalAmount, 'contract value is not enough');

        for(uint i = 0; i < to.length; i++){
            to[i].transfer(amount[i]);
        }
    }

}