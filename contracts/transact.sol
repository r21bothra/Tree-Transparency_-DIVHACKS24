// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

contract TransactionData {
    // Structure to store transaction information
    struct Transaction {
        uint256 id;
        address sender;
        uint256 value;
        uint256 timestamp;
    }

    // Mapping to store transactions
    mapping(uint256 => Transaction) public transactions;

    // Counter to generate unique transaction IDs
    uint256 public transactionCount = 0;

    // Function to add transaction
    function addTransaction(address sender, uint256 value) public {
        // Generate transaction ID
        transactionCount++;
        uint256 id = transactionCount;

        // Store transaction information
        transactions[id] = Transaction({
            id: id,
            sender: sender,
            value: value,
            timestamp: block.timestamp
        });
    }
}