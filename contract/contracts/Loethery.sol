// SPDX-License-Identifier: GPL-3.0-only

pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/interfaces/LinkTokenInterface.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";


contract Loethery is VRFConsumerBaseV2 {
    // VRFConsumer standard parameters

    VRFCoordinatorV2Interface COORDINATOR;
    LinkTokenInterface LINKTOKEN;

    uint64 s_subscriptionId;
    address vrfCoordinator = 0x6168499c0cFfCaCD319c818142124B7A15E857ab;
    address link = 0x01BE23585060835E02B77ef475b0Cc51aA1e0709;
    bytes32 keyHash = 0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc;

    uint32 callbackGasLimit = 100000;

    uint16 requestConfirmations = 3;
    uint32 numWords = 2;

    uint256[] public s_randomWords;
    uint256 public s_requestId;
    address s_owner;
       

    // Lottery details
    uint32 public lotteryId;
    struct Lottery {
        address[] winners;
        string lotteryName;
        uint256 lotteryDate;
    }

    mapping (uint => Lottery) public lotteryHistory;
    
    address payable[] public players;
    uint256 cost = 0.01 ether;
    uint[] payments = [70, 25];

    bool paused = true;

    constructor(uint64 subscriptionId) VRFConsumerBaseV2(vrfCoordinator) {
        COORDINATOR = VRFCoordinatorV2Interface(vrfCoordinator);
        LINKTOKEN = LinkTokenInterface(link);
        s_owner = msg.sender;
        s_subscriptionId = subscriptionId;
        lotteryId = 0;
    }

    function requestRandomWords() external onlyOwner {
        // Will revert if subscription is not set and funded.
        s_requestId = COORDINATOR.requestRandomWords(
        keyHash,
        s_subscriptionId,
        requestConfirmations,
        callbackGasLimit,
        numWords
        );
    }
    
    function fulfillRandomWords(
        uint256, /* requestId */
        uint256[] memory randomWords
    ) internal override {
        s_randomWords = randomWords;
    }

    //Players buy their entry
    function buyEntry() public payable{
        require(!paused, "Lottery has ended.");
        require(msg.value >= cost, "The amount sent is too low.");
        players.push(payable(msg.sender));
    }

    // The admin sets the date
    function dateSet(uint256 _lotteryDate) public onlyOwner {
        lotteryHistory[lotteryId].lotteryDate = _lotteryDate;
        
    }

    function nameSet(string memory _name) public onlyOwner {
        lotteryHistory[lotteryId].lotteryName = _name;
    }

    function priceSet(uint _cost) public onlyOwner {
        cost = _cost * 0.01 ether;
    }

    function getPlayers() public view returns (address payable[] memory){
        return players;
    }

    function getPotTotal() public view returns (uint256){
        return address(this).balance;
    }

    // The admin starts the lottery
    function startLottery(uint _cost, string memory _lotteryName, uint _lotteryDate) public onlyOwner {
        dateSet(_lotteryDate);
        priceSet(_cost);
        nameSet(_lotteryName);
        paused = false;
    }

    // Lottery history with all respective dates.
    function retrieveLotteryHistory(uint id) public view returns (Lottery memory) {
        return lotteryHistory[id];
    }

    // Execution reverts, if I delete everything in the for loop it works, commenting any line gives an error when calling the function
    function finishLottery() public payable onlyOwner{

        // requestRandomWords(); --> For the sake of retrieving the random values array with Remix I won't call the function here, as it would require it to be internal
        paused = true;
    
        for(uint i = 0; i < 2; i++){
            
            uint index = s_randomWords[i] % players.length;
            lotteryHistory[lotteryId].winners.push(players[index]);
            (bool success, ) = players[index].call {value: address(this).balance * payments[i] / 100}("");
            require(success);
        }

        lotteryId++;
        players = new address payable[](0); // resetting the array of players
        
    }

    function withdraw() public payable onlyOwner {
        payable(msg.sender).transfer(address(this).balance); // the rest is ours to take
    }

    modifier onlyOwner() {
        require(msg.sender == s_owner);
        _;
    }

}