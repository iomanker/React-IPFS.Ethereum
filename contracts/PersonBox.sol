pragma solidity >=0.4.21 <0.7.0;

contract PersonBox{
    address payable owner;
    address[] keyList;
    event evt_getRecords(address[] list);

    constructor() public{
        owner = msg.sender;
    }

    function append(address _address) public{
        keyList.push(_address);
    }

    function getRecords() public{
        emit evt_getRecords(keyList);
    }
}