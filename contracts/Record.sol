pragma solidity >=0.4.21 <0.7.0;

contract Record {
    address payable owner;
    string ipfsAddress;
    uint32 dateTime;
    string gpsLocation;

    event evt_get(address payable OWNER, string IPFSADDRESS, uint32 DATETIME, string GPSLOCATION);

    function set(string memory _ipfsAdd,
                 uint32 _dateTime, string memory _gpsLoc) public{
        owner = msg.sender;
        ipfsAddress = _ipfsAdd;
        dateTime = _dateTime;
        gpsLocation = _gpsLoc;
    }

    function get() public{
        emit evt_get(owner,ipfsAddress,dateTime,gpsLocation);
    }
}