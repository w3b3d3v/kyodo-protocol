const { ethers, deployments, getNamedAccounts } = require("hardhat");
const { expect } = require("chai");

const setup = deployments.createFixture(async () => {
    await deployments.fixture(['AgreementContract']);
    const { deployer, user1, user2, user3, user4 } = await getNamedAccounts();
    const skills = [
        { name: "Programming", level: 50 },
        { name: "Design", level: 50 }
    ];

    return {
        DeployerUser: {
            address: deployer,
            AgreementContract: await ethers.getContract('AgreementContract', deployer),
        },
        Company1: {
            address: user1,
            AgreementContract: await ethers.getContract('AgreementContract', user1),
        },
        Company2: {
            address: user2,
            AgreementContract: await ethers.getContract('AgreementContract', user2),
        },
        Employee1: {
            address: user3,
            AgreementContract: await ethers.getContract('AgreementContract', user3),
        },
        Employee2: {
            address: user4,
            AgreementContract: await ethers.getContract('AgreementContract', user3),
        },
        skills,
    }
});

describe("AgreementsByUser", function () {
    it("Should create agreements and retrieve user-specific agreements", async function () {
        const { Company1, Company2, Employee1, Employee2, skills } = await setup();
        await Company1.AgreementContract.createAgreement(
            "Agreement 1",
            "Description 1",
            Employee1.address,
            skills,
            ethers.parseEther("5")
        );

        await Company2.AgreementContract.createAgreement(
            "Agreement 2",
            "Description 2",
            Employee2.address,
            skills,
            ethers.parseEther("4")
        );

        const company1Agreements = await Company1.AgreementContract.getContractorAgreementIds(Company1.address);
        expect(company1Agreements.length).to.equal(1);
        const company2Agreements = await Company2.AgreementContract.getContractorAgreementIds(Company2.address);
        expect(company2Agreements.length).to.equal(1);
        
        const company1Agreement = await Company1.AgreementContract.getAgreementById(company1Agreements[0]);
        const company2Agreement = await Company2.AgreementContract.getAgreementById(company2Agreements[0]);
    
        expect(company1Agreement.professional).to.equal(Employee1.address);
        expect(company2Agreement.professional).to.equal(Employee2.address);
    });

    it("Should verify skills associated with user1's agreements", async function () {
        const { Company1, Employee1, skills } = await setup();
        await Company1.AgreementContract.createAgreement(
            "Agreement 1",
            "Description 1",
            Employee1.address,
            skills,
            ethers.parseEther("5")
        );
        const company1Agreements = await Company1.AgreementContract.getContractorAgreementIds(Company1.address);
        
        for (let agreementId of company1Agreements) {
            const agreementSkills = await Company1.AgreementContract.getSkillsByAgreementId(agreementId);
            
            expect(agreementSkills.length).to.equal(skills.length);
            agreementSkills.forEach((skill, index) => {
              expect(skill.name).to.equal(skills[index].name);
              expect(skill.level).to.equal(skills[index].level);
            });
          }    
    });

    it("Should verify skills associated with user1's agreements", async function () {
        const { Company1, Employee1 } = await setup();
        const invalidSkills = [
            { name: "Skill A", level: 60 },
            { name: "Skill B", level: 50 }
        ];

        await expect(Company1.AgreementContract.createAgreement(
            "Invalid Agreement",
            "Description Invalid",
            Employee1.address,
            invalidSkills,
            ethers.parseEther("5")
        )).to.be.revertedWith("Total skill level cannot exceed 100");
    });
});