// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Marketplace {
    struct User {
        uint points;
    }

    mapping(address => User) public users;

    event PointsAdded(address user, uint points);
    event ProductPurchased(address buyer, uint productId);

    // Function to add points to a user
    function addPoints(address user, uint points) public {
        users[user].points += points;
        emit PointsAdded(user, points);
    }

    // Function to purchase a product
    function purchaseProduct(uint productId) public {
        // require(users[msg.sender].points >= priceInPoints, "Not enough points");

        // Deduct the points
        // users[msg.sender].points -= priceInPoints;
        emit ProductPurchased(msg.sender, productId);
    }
}
