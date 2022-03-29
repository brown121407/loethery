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
        string name;
        uint256 startDate;
        uint256 pot;
        uint256 endDate;
    }

    bool hasActiveRound = false;
    Lottery activeRound;
    Lottery[] public history;
    
    address payable[] public players;
    uint256 price;
    uint[] payments = [70, 25];

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

    function buyEntry() public payable {
        require(hasActiveRound, "Lottery has ended.");
        require(!isParticipating(msg.sender), "User is already registered");
        require(msg.value >= price, "The amount sent is too low.");
        activeRound.pot += price;
        players.push(payable(msg.sender));
    }

    function getPrice() public view returns (uint256) {
        require(hasActiveRound, "No round currently active.");
        return price;
    }

    function getActiveRound() public view returns (Lottery memory) {
        require(hasActiveRound, "No round currently active.");
        return activeRound;
    }

    function getPlayers() public view returns (address payable[] memory) {
        return players;
    }

    function getBalance() public view onlyOwner returns (uint)  {
        return address(this).balance;
    }
    
    function isParticipating(address _user) public view returns (bool) {
        for (uint i = 0; i < players.length; i++) {
            if (players[i] == _user)
                return true;
        }

        return false;
    }

    // To avoid drawing the same address for both winning spots, any winning one is removed from the players array
    function remove(uint index) internal {
        require(index < players.length, "Index provided is out of bounds.");
        
        for (uint i = index; i < players.length - 1; i++) {
            players[i] = players[i + 1];
        }

        players.pop();
    }

    // The random words required for drawing a winner are determined when the lottery starts.
    function startLottery(uint _price, string memory _name, uint _startDate) public onlyOwner {
        require(!hasActiveRound, 'Another round is already running.');

        requestRandomWords();
        price = _price;
        activeRound = Lottery(new address[](0), _name, _startDate, 0, 0);
        hasActiveRound = true;
    }

    // Lottery history with all respective dates.
    function getHistory() public view returns (Lottery[] memory) {
        return history;
    }

    function finishLottery() public payable onlyOwner {
        require(players.length > 1, "There aren't enough players participating.");
        require(hasActiveRound, 'No round active.');

        hasActiveRound = false;
                    
        for (uint i = 0; i < 2; i++) {
            // Winner is selected
            uint index = s_randomWords[i] % players.length;
            activeRound.winners.push(players[index]);
            
            // Their respective payments are transfered to their addresses.
            (bool success, ) = players[index].call {value: activeRound.pot * payments[i] / 100}("");
            require(success);

            remove(index);
        }

        activeRound.endDate = block.timestamp;
        history.push(activeRound);

        lotteryId++;

        // Resetting the array for the incoming lotteries.
        players = new address payable[](0);
    }

    function withdraw() public payable onlyOwner {
        // The rest is ours to take :)
        require(!hasActiveRound, "You can't take money out of the pot. Wait for the round to finish.");
        payable(msg.sender).transfer(address(this).balance);
    }

    function isOwner() public view returns (bool) {
        if (msg.sender == s_owner)
            return true;
        return false;
    }

    modifier onlyOwner() {
        require(msg.sender == s_owner);
        _;
    }
}