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

    address[] winners;
    string lotteryName;
    uint256 lotteryDate;
    uint256 pot;

    struct Lottery {
        address[] winners;
        string lotteryName;
        uint256 lotteryDate;
        uint256 pot;
    }

    Lottery[] public lotteryHistory;
    
    address payable[] public players;
    uint256 cost;
    uint[] payments = [70, 25];

    bool paused = true;

    constructor(uint64 subscriptionId) VRFConsumerBaseV2(vrfCoordinator) {
        COORDINATOR = VRFCoordinatorV2Interface(vrfCoordinator);
        LINKTOKEN = LinkTokenInterface(link);
        s_owner = msg.sender;
        s_subscriptionId = subscriptionId;
        lotteryId = 0;
    }

    function requestRandomWords() internal onlyOwner {
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
        require(!isParticipating(msg.sender), "User is already registered");
        require(msg.value >= cost, "The amount sent is too low.");
        pot += cost;
        players.push(payable(msg.sender));
    }

    function dateSet(uint256 _lotteryDate) internal onlyOwner {
        lotteryDate = _lotteryDate;
    }

    function nameSet(string memory _name) internal onlyOwner {
        lotteryName = _name;
    }

    function priceSet(uint _cost) public onlyOwner {
        cost = _cost;
    }

    function getPlayers() public view returns (address payable[] memory){
        return players;
    }

    
    function isParticipating(address _user) public view returns (bool) {
        for(uint i = 0; i < players.length; i++){
            if(players[i] == _user)
                return true;
        }

        return false;
    }

    //To avoid drawing the same address for both winning spots, any winning one is removed from the players array
    function remove(uint index) internal{
        require(index < players.length, "Index provided is out of bounds.");
        
        for(uint i = index; i < players.length - 1; i++){
            players[i] = players[i + 1];
        }

        players.pop();
        
    }

    //The random words required for drawing a winner are determined when the lottery starts.
    function startLottery(uint _cost, string memory _lotteryName, uint _lotteryDate) public onlyOwner {
        requestRandomWords();
        dateSet(_lotteryDate);
        priceSet(_cost);
        nameSet(_lotteryName);
        pot = 0 ether;
        paused = false;
    }

    // Lottery history with all respective dates.
    function retrieveLotteryHistory() public view returns (Lottery[] memory) {
        return lotteryHistory;
    }

    function finishLottery() public payable onlyOwner{

        paused = true;
    
        for(uint i = 0; i < 2; i++){
            
            // Winner is selected
            uint index = s_randomWords[i] % players.length;
            winners.push(players[index]);
            
            // Their respective payments are transfered to their addresses.
            (bool success, ) = players[index].call {value: address(this).balance * payments[i] / 100}("");
            require(success);

            remove(index);
        }

        lotteryHistory.push(Lottery(winners, lotteryName, lotteryDate, pot));

        lotteryId++;

        // Resetting the array for the incoming lotteries.
        players = new address payable[](0);
        
    }

    function withdraw() public payable onlyOwner {

        // The rest is ours to take :)
        payable(msg.sender).transfer(address(this).balance);
    }

    function isOwner() public view returns (bool){
        if(msg.sender == s_owner)
            return true;
        return false;
    }

    modifier onlyOwner() {
        require(msg.sender == s_owner);
        _;
    }

}