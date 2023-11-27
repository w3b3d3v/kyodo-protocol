// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;

interface IAgreementContract {
    struct Skill {
        string name;
        uint256 level;
    }

    struct Agreement {
        uint256 id;
        string title;
        string description;
        AgreementStatus status;
        address company;
        address professional;
        uint256 paymentAmount;
        uint256 totalPaid;
        uint256 fee;
    }

    struct UserInfo {
        string name;
        string taxDocument; // Assuming this is a string like a tax ID
    }

    // Enums
    enum AgreementStatus { Active, Completed }

    // Events
    event UserInfoStored(address indexed user, string name, string taxDocument);
    event AgreementCreated(address indexed company, address indexed professional, uint256 agreementId, uint256 amount);
    event PaymentMade(address indexed company, address indexed professional, uint256 agreementId, uint256 amount);

    // Functions
    /**
     * @notice Adds an ERC20 token to the list of accepted payment tokens.
     * @param _tokenAddress The address of the ERC20 token to be added.
     */
    function addAcceptedPaymentToken(address _tokenAddress) external;

    /**
     * @notice Creates a new agreement between a company and a professional.
     * @param _title The title of the agreement.
     * @param _description A brief description of the agreement.
     * @param _professional The address of the professional involved in the agreement.
     * @param _skills An array of skills required for the agreement.
     * @param _paymentAmount The payment amount for the agreement.
     */
    function createAgreement(string memory _title, string memory _description, address _professional, Skill[] memory _skills, uint256 _paymentAmount) external;

    /**
     * @notice Returns the total number of agreements created.
     * @return uint256 The total number of agreements.
     */
    function getAgreementCount() external view returns (uint256);

    /**
     * @notice Returns all agreements.
     * @return Agreement[] An array of all agreements.
     */
    function getAllAgreements() external view returns (Agreement[] memory);

    /**
     * @notice Returns a list of agreement IDs associated with a contractor.
     * @param _contractor The address of the contractor.
     * @return uint256[] An array of agreement IDs.
     */
    function getContractorAgreementIds(address _contractor) external view returns (uint256[] memory);

    /**
     * @notice Returns a list of agreement IDs associated with a professional.
     * @param _professional The address of the professional.
     * @return uint256[] An array of agreement IDs.
     */
    function getProfessionalAgreementIds(address _professional) external view returns (uint256[] memory);

    /**
     * @notice Retrieves an agreement by its ID.
     * @param _id The ID of the agreement.
     * @return Agreement The agreement associated with the given ID.
     */
    function getAgreementById(uint256 _id) external view returns (Agreement memory);

    /**
     * @notice Retrieves the skills associated with a specific agreement ID.
     * @param _agreementId The ID of the agreement.
     * @return Skill[] An array of skills associated with the agreement.
     */
    function getSkillsByAgreementId(uint256 _agreementId) external view returns (Skill[] memory);

    /**
    * @notice Makes payments for one or more agreements.
    * @dev This function allows for multiple agreements to be paid in one transaction.
    *      It requires that the length of _agreementIds and _amountsToPay arrays be equal.
    *      Each index in the arrays corresponds to a specific agreement and its respective payment amount.
    * @param _agreementIds An array of IDs of the agreements for which the payments are being made.
    * @param _amountsToPay An array of payment amounts, each corresponding to the agreement ID at the same index.
    * @param _paymentAddress The address of the token in which payments are made.
    */
    function makePayment(uint256[] memory _agreementIds, uint256[] memory _amountsToPay, address _paymentAddress) external;

    /**
     * @notice Sets the fee structure for the agreement transactions.
     * @param _kyodoTreasuryFee The portion of the fee allocated to the Kyodo Treasury.
     */
    function updateFee(uint256 _kyodoTreasuryFee) external;
}