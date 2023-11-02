// SPDX-License-Identifier: MIT
pragma solidity 0.8.1;

contract UserDataRegistry {
    struct Community {
        string name;
        string logo;
        string description;
    }

    struct Contractor {
        string name;
        string document;
        string logo;
        string website;
        string about;
    }

    struct Professional {
        string name;
        string bio;
        string avatar;
        string website;
        string communityName;
        address communityAddress;
    }

    mapping(address => Community) private communities;
    mapping(address => Contractor) private contractors;
    mapping(address => Professional) private professionals;

    function setCommunity(string memory name, string memory logo, string memory description) external {
        require(bytes(name).length > 0, "Name cannot be empty");
        require(bytes(logo).length > 0, "Logo URL cannot be empty");
        require(bytes(description).length > 0, "Description cannot be empty");
        communities[msg.sender] = Community(name, logo, description);
    }

    function setContractor(string memory name, string memory document, string memory logo, string memory website, string memory about) external {
        require(bytes(name).length > 0, "Name cannot be empty");
        require(bytes(document).length > 0, "Document cannot be empty");
        require(bytes(logo).length > 0, "Logo URL cannot be empty");
        require(bytes(website).length > 0, "Website cannot be empty");
        require(bytes(about).length > 0, "About cannot be empty");
        contractors[msg.sender] = Contractor(name, document, logo, website, about);
    }

    function setProfessional(string memory name, string memory bio, string memory avatar, string memory website, string memory communityName, address communityAddress) external {
        require(bytes(name).length > 0, "Name cannot be empty");
        require(bytes(bio).length > 0, "Bio cannot be empty");
        require(bytes(avatar).length > 0, "Avatar URL cannot be empty");
        require(bytes(website).length > 0, "Website cannot be empty");
        require(bytes(communityName).length > 0, "Community name cannot be empty");
        require(communityAddress != address(0), "Invalid community address");
        professionals[msg.sender] = Professional(name, bio, avatar, website, communityName, communityAddress);
    }

    function getCommunity(address communityAddress) external view returns (Community memory) {
        require(bytes(communities[communityAddress].name).length > 0, 'Community is not registered in our database');
        return communities[communityAddress];
    }

    function getContractor(address contractorAddress) external view returns (Contractor memory) {
        require(bytes(contractors[contractorAddress].name).length > 0, 'Contractor is not registered in our database');
        return contractors[contractorAddress];
    }

    function getProfessional(address professionalAddress) external view returns (Professional memory) {
        require(bytes(professionals[professionalAddress].name).length > 0, 'Professional is not registered in our database');
        return professionals[professionalAddress];
    }
}
