pragma solidity ^0.5.12;

contract Wallet {
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

    function deposit() public payable{
    }

    function send(
        address payable to,
        uint amount
    ) public
        isOwner()
    {
        to.transfer(amount);
        return;
    }

    function balanceOf()
        public
        view
        returns(uint)
    {
        return address(this).balance;
    }
}