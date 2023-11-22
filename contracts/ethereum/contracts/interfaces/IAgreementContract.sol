// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;

interface IAgreementContract {

    // Structs
    struct Token {
        uint256 amount;
        address tokenAddress;
    }

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

    // Enums
    enum AgreementStatus { Active, Completed }

    // Events
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
     * @notice Makes a payment for a specific agreement.
     * @param _agreementId The ID of the agreement for which the payment is being made.
     * @param _amountToPay The amount of the payment.
     * @param _paymentAddress The address of the token in which payment is made.
     */
    function makePayment(uint256 _agreementId, uint256 _amountToPay, address _paymentAddress) external;

    /**
     * @notice Sets the fee structure for the agreement transactions.
     * @param _kyodoTreasuryFee The portion of the fee allocated to the Kyodo Treasury.
     */
    function updateFee(uint256 _kyodoTreasuryFee) external;
}