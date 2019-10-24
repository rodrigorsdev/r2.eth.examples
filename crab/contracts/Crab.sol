pragma solidity ^0.5.12;

contract Crab {

    address payable public contractOwner;

    uint constant USER_NAME_MIN_LENGTH = 2;

    struct User {
        string name;
        string email;
    }

    User[] users;
    mapping(address => uint) private userAddressMap;
    mapping(string => uint) private userEmailMap;

    constructor () public{
        contractOwner = msg.sender;
        users.push(User("", ""));
    }

    function kill() external {
        require(msg.sender == contractOwner, "only the contract owner can kill this contract");
        selfdestruct(contractOwner);
    }

    modifier isUserNameMinLengthValid(
        string memory _name
    )
    {
        require(
            bytes(_name).length >= USER_NAME_MIN_LENGTH,
            'user name min length invalid'
        );
        _;
    }

    modifier userNotExists()
    {
        require(
            userAddressMap[msg.sender] == 0,
            'user exists'
        );
        _;
    }

    modifier userExists(
        string memory _email
    )
    {
        require(
            userEmailMap[_email] != 0,
            'user not exists'
        );
        _;
    }

     modifier emailNotExists(
        string memory _email
    )
    {
        require(
            userEmailMap[_email] == 0,
            'email exists'
        );
        _;
    }

    modifier isHimself(string memory _email)
    {
        uint indexEmail = userEmailMap[_email];
        uint indexOwner = userAddressMap[msg.sender];
        require(
            indexEmail == indexOwner,
            'is not the owner'
        );
        _;
    }

   event createdUser(
       uint _index,
       string _name, 
       string _email
    );

    event appendedUser(
        string _name,
        string _email
    );

    event burnedUser(
        string _email
    );

    function create(
        string memory _name,
        string memory _email
    ) public
        isUserNameMinLengthValid(_name)
        userNotExists()
        emailNotExists(_email)
      payable
    {
        users.push(User(_name, _email));
        uint index = users.length - 1;
        userAddressMap[msg.sender] = index;
        userEmailMap[_email] = index;

        emit createdUser(index, _name, _email);
    }

    function readByEmail(
        string memory _email
    ) public view
        userExists(_email)
        returns (string memory)
    {
        return users[userEmailMap[_email]].name;
    }

    function append(
        string memory _name,
        string memory _email 
    ) public
        isUserNameMinLengthValid(_name)
        userExists(_email)
        isHimself(_email)
      payable
    {
        users[userEmailMap[_email]].name = _name;
        emit appendedUser(_name, _email);
    }

    function burn(
        string memory _email
    ) public
        userExists(_email)
        isHimself(_email)
      payable
    {
        uint indexToRemove = userEmailMap[_email];
        User memory user = users[users.length - 1];
        users[indexToRemove] = user;
        userEmailMap[user.email] = indexToRemove;
        users.length--;
        userAddressMap[msg.sender] = 0;
        userEmailMap[_email] = 0;
        emit burnedUser(_email);
    }
}