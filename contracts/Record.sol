pragma solidity >=0.4.21 <0.7.0;

contract Record {
    address payable owner;
    string ipfsAddress;
    string dateTime;
    string gpsLocation;

    event evt_get(address payable OWNER, string IPFSADDRESS, string DATETIME, string GPSLOCATION);

    function set(string memory _ipfsAdd,
                 string memory _dateTime, string memory _gpsLoc) public{
        owner = msg.sender;
        ipfsAddress = _ipfsAdd;
        dateTime = _dateTime;
        gpsLocation = _gpsLoc;
    }

    function get() public{
        emit evt_get(owner,ipfsAddress,dateTime,gpsLocation);
    }
}