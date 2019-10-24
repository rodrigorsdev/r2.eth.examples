pragma solidity ^0.5.12;

contract SimpleStorage {
    
    string private data;

    function set(string memory _data) public{
        data = _data;
    }

    function get() public view returns (string memory){
        return data;
    }
}