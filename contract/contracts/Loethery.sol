// SPDX-License-Identifier: GPL-3.0-only

pragma solidity ^0.8.7;

contract Loethery {
    address owner;

    uint32 public lotteryId;

    struct Lottery {
        address[] winners;
        string name;
        uint256 startDate;
        uint256 endDate;
        uint256 pot;
    }

    bool hasActiveRound = false;
    Lottery activeRound;
    Lottery[] public history;
    
    address payable[] public players;
    uint256 price;
    uint[] payments = [70, 25];

    constructor() {
        owner = msg.sender;
        lotteryId = 0;
    }

    function getRandomNumbers() internal view returns (uint[] memory numbers) {
        uint base = uint(blockhash(block.number - 1));
        numbers = new uint256[](2);
        for (uint256 i = 0; i < 2; i++) {
            numbers[i] = uint256(keccak256(abi.encode(base, i)));
        }
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

        price = _price;
        activeRound = Lottery(new address[](0), _name, _startDate, 0, 0);
        hasActiveRound = true;
    }

    // Lottery history with all respective dates.
    function getHistory() public view returns (Lottery[] memory) {
        return history;
    }

    function finishLottery() public payable onlyOwner {
        require(hasActiveRound, 'No round active.');

        hasActiveRound = false;

        uint[] memory randomNumbers = getRandomNumbers();
    
        for (uint i = 0; i < 2; i++) {
            // Winner is selected
            uint index = randomNumbers[i] % players.length;
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
        if (msg.sender == owner)
            return true;
        return false;
    }

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }
}