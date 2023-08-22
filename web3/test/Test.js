// @this test was for a previous version of contract, I made changes to it and tested on remix so this is not applicable

const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("PolyCloud", function () {
  let polycloud;
  let owner, user1, user2;
  beforeEach(async function () {
    const PolyCloud = await ethers.getContractFactory("PolyCloud");
    polycloud = await PolyCloud.deploy();
    await polycloud.deployed();
    polycloudAddress = polycloud.address;

    [owner, user1, user2] = await ethers.getSigners();
    await network.provider.send("evm_setAutomine", [true]);
  });

  describe("User Functions", function () {
    it("Should create a new user", async function () {
      await polycloud.createUser("user1", "user1CID");
      const user = await polycloud.getUser();

      expect(user.userName).to.equal("user1");
      expect(user.userImage).to.equal("user1CID");
      expect(user.totalFiles).to.equal(0);
      expect(user.totalStorage).to.equal(524288000);
      expect(user.usedStorage).to.equal(0);
      expect(user.userAddress).to.equal((await ethers.getSigners())[0].address);
    });
    it("Should edit user details", async function () {
      await polycloud.createUser("user1", "user1CID");
      await polycloud.editUser("user1-updated", "user1CID-updated");
      const user = await polycloud.getUser();

      expect(user.userName).to.equal("user1-updated");
      expect(user.userImage).to.equal("user1CID-updated");
    });
    it("Should return default values for non-existing user", async function () {
      const nonExistingAddress = "0x1234567890123456789012345678901234567890";
      const user = await polycloud
        .connect(ethers.provider.getSigner(nonExistingAddress))
        .getUser();

      expect(user.userName).to.equal("");
      expect(user.userImage).to.equal("");
      expect(user.totalFiles).to.equal(0);
      expect(user.totalStorage).to.equal(0);
      expect(user.usedStorage).to.equal(0);
      // You can add more checks for other properties if applicable
    });

    it("Should not allow duplicate accounts with the same wallet address", async function () {
      await polycloud.createUser("user1", "user1CID");

      // Attempting to create a duplicate account with the same wallet address
      await expect(
        polycloud.createUser("user2", "user2CID")
      ).to.be.revertedWith("Account already exists");
    });

    it("Should not allow non-owner to edit user details", async function () {
      await polycloud.createUser("user2", "user2CID");
      await expect(
        polycloud.connect(user2).editUser("newName", "newImage")
      ).to.be.revertedWith("Not authorized to edit");
    });
  });
  describe("File Functions", function () {
    it("Should upload file", async function () {
      await polycloud.connect(owner).createUser("user1", "user1CID");
      const fileName = "example.txt";
      const fileCID = "Qm123456789";
      const fileSize = 100;
      await polycloud.connect(owner).uploadFile(fileName, fileCID, fileSize);
      const userFiles = await polycloud.getFilesForUser();
      expect(userFiles.length).to.equal(1);
      expect(userFiles[0].fileName).to.equal(fileName);
      expect(userFiles[0].fileCID).to.equal(fileCID);
      expect(userFiles[0].fileSize).to.equal(fileSize);
    });

    it("Should revert when storage limit is exceeded", async function () {
      await polycloud.connect(owner).createUser("user1", "user1CID");
      const fileName = "example.txt";
      const fileCID = "Qm123456789";
      const fileSize = 624288000; // Exceeds user's total storage

      await expect(
        polycloud.connect(owner).uploadFile(fileName, fileCID, fileSize)
      ).to.be.revertedWith("Storage limit exceeded");

      const userFiles = await polycloud.getFilesForUser();
      expect(userFiles.length).to.equal(0);

      const user = await polycloud.getUser();
      expect(user.totalFiles).to.equal(0);
      expect(user.totalStorage).to.equal(524288000);
      expect(user.usedStorage).to.equal(0);
    });

    it("should upgrade storage", async () => {
      await polycloud.createUser("user1", "user1CID");
      const ethSent = ethers.utils.parseEther("2");

      const initialBalance = await ethers.provider.getBalance(
        polycloud.address
      );
      await polycloud.upgradeStorage(200, { value: ethSent });
      const newBalance = await ethers.provider.getBalance(polycloud.address);

      const expectedNewBalance = initialBalance.add(ethSent);
      expect(newBalance).to.equal(expectedNewBalance);
    });

    it("Should get user's uploaded files", async function () {
      await polycloud.connect(user1).createUser("user1", "user1CID");
      const fileName1 = "file1.txt";
      const fileCID1 = "QmFile1CID";
      const fileSize1 = 200;

      const fileName2 = "file2.txt";
      const fileCID2 = "QmFile2CID";
      const fileSize2 = 300;

      await polycloud.connect(user1).uploadFile(fileName1, fileCID1, fileSize1);
      await polycloud.connect(user1).uploadFile(fileName2, fileCID2, fileSize2);

      const userFiles = await polycloud.connect(user1).getFilesForUser();
      expect(userFiles.length).to.equal(2);

      expect(userFiles[0].fileName).to.equal(fileName1);
      expect(userFiles[0].fileCID).to.equal(fileCID1);
      expect(userFiles[0].fileSize).to.equal(fileSize1);

      expect(userFiles[1].fileName).to.equal(fileName2);
      expect(userFiles[1].fileCID).to.equal(fileCID2);
      expect(userFiles[1].fileSize).to.equal(fileSize2);
    });

    it("Should return an empty array for user with no uploaded files", async function () {
      await polycloud.connect(user1).createUser("user1", "user1CID");
      const userFiles = await polycloud.connect(user1).getFilesForUser();
      expect(userFiles.length).to.equal(0);
    });
  });
  describe("Storage Functions", async function () {
    it("Should get the current total storage of the user (normal storage)", async function () {
      await polycloud.connect(user1).createUser("user1", "user1CID");
      const totalStorage = await polycloud
        .connect(user1)
        .getCurrentTotalStorage();
      expect(totalStorage).to.equal(524288000);
    });

    it("Should get the current total storage of the user (upgraded storage)", async function () {
      await polycloud.connect(user1).createUser("user1", "user1CID");
      const ethSent = ethers.utils.parseEther("3");
      await polycloud.connect(user1).upgradeStorage(300, { value: ethSent });
      const totalStorage = await polycloud
        .connect(user1)
        .getCurrentTotalStorage();
      expect(totalStorage).to.equal(524288300);
    });
    it("Should get the current used storage of the user (no uploaded files)", async function () {
      await polycloud.connect(user1).createUser("user1", "user1CID");
      const usedStorage = await polycloud
        .connect(user1)
        .getCurrentUsedStorage();
      expect(usedStorage).to.equal(0);
    });

    it("Should get the current used storage of the user (uploaded files)", async function () {
      await polycloud.connect(user1).createUser("user1", "user1CID");
      const fileName1 = "file1.txt";
      const fileCID1 = "QmFile1CID";
      const fileSize1 = 200;

      const fileName2 = "file2.txt";
      const fileCID2 = "QmFile2CID";
      const fileSize2 = 300;

      await polycloud.connect(user1).uploadFile(fileName1, fileCID1, fileSize1);
      await polycloud.connect(user1).uploadFile(fileName2, fileCID2, fileSize2);

      const usedStorage = await polycloud
        .connect(user1)
        .getCurrentUsedStorage();
      expect(usedStorage).to.equal(fileSize1 + fileSize2);
    });
  });
  describe("Counting Functions", function () {
    it("Should get the count of all users", async function () {
      await polycloud.connect(user1).createUser("user1", "user1CID");
      await polycloud.connect(user2).createUser("user2", "user2CID");
      const userCount = await polycloud.getAllUsersCount();
      expect(userCount).to.equal(2);
    });

    it("Should get the details of all users", async function () {
      await polycloud.connect(user1).createUser("user1", "user1CID");
      await polycloud.connect(user2).createUser("user2", "user2CID");
      const allUsers = await polycloud.getAllUsers();
      expect(allUsers.length).to.equal(2);

      expect(allUsers[0].userName).to.equal("user1");
      expect(allUsers[0].totalFiles).to.equal(0);

      expect(allUsers[1].userName).to.equal("user2");
      expect(allUsers[1].totalFiles).to.equal(0);
    });

    it("Should get all uploaded files", async function () {
      await polycloud.connect(user1).createUser("user1", "user1CID");
      const fileName1 = "file1.txt";
      const fileCID1 = "QmFile1CID";
      const fileSize1 = 200;

      const fileName2 = "file2.txt";
      const fileCID2 = "QmFile2CID";
      const fileSize2 = 300;

      await polycloud.connect(user1).uploadFile(fileName1, fileCID1, fileSize1);
      await polycloud.connect(user1).uploadFile(fileName2, fileCID2, fileSize2);

      const allFiles = await polycloud.getAllFiles();
      expect(allFiles.length).to.equal(2);

      expect(allFiles[0].fileName).to.equal(fileName1);
      expect(allFiles[0].fileCID).to.equal(fileCID1);
      expect(allFiles[0].fileSize).to.equal(fileSize1);

      expect(allFiles[1].fileName).to.equal(fileName2);
      expect(allFiles[1].fileCID).to.equal(fileCID2);
      expect(allFiles[1].fileSize).to.equal(fileSize2);
    });

    it("Should get the count of all uploaded files", async function () {
      await polycloud.connect(user1).createUser("user1", "user1CID");
      const fileName1 = "file1.txt";
      const fileCID1 = "QmFile1CID";
      const fileSize1 = 200;

      const fileName2 = "file2.txt";
      const fileCID2 = "QmFile2CID";
      const fileSize2 = 300;

      await polycloud.connect(user1).uploadFile(fileName1, fileCID1, fileSize1);
      await polycloud.connect(user1).uploadFile(fileName2, fileCID2, fileSize2);

      const filesCount = await polycloud.getAllFilesCount();
      expect(filesCount).to.equal(2);
    });
  });
  describe("Contract Functions", function () {
    it("Should withdraw funds and update owner balance correctly", async function () {
      // Get owner's initial balance

      // Create a new user and buy storage
      await polycloud.connect(user1).createUser("user1", "user1CID");
      await polycloud
        .connect(user1)
        .upgradeStorage(200, { value: ethers.utils.parseEther("2") });

      // Contract's balance before withdrawing
      const contractBalanceBefore = await ethers.provider.getBalance(
        polycloud.address
      );
      const initialOwnerBalance = await owner.getBalance();
      // Withdraw funds
      const tx = await polycloud.connect(owner).withdrawAllFunds();
      await tx.wait();

      // Contract's balance after withdrawing
      const contractBalanceAfter = await ethers.provider.getBalance(
        polycloud.address
      );
      // Check if the owner's balance matches the expected balance
      expect(contractBalanceAfter).to.equal(ethers.constants.Zero);
      const ethSent = ethers.utils.parseEther("2");
      // Check if the owner's balance is updated correctly
      const ownerBalanceAfter = await owner.getBalance();
      const ownerBalanceBeforeEth = Math.ceil(
        ethers.utils.formatEther(initialOwnerBalance)
      );
      const ownerBalanceAfterEth = Math.ceil(
        ethers.utils.formatEther(ownerBalanceAfter)
      );
      expect(ownerBalanceAfterEth - ownerBalanceBeforeEth).to.equal(2);
    });

    it("Should not be callable by non-owner", async function () {
      await expect(
        polycloud.connect(user1).withdrawAllFunds()
      ).to.be.revertedWith("Only the owner can call this function");
    });

    it("Should not withdraw funds if contract balance is zero", async function () {
      const contractBalanceBefore = await ethers.provider.getBalance(
        polycloud.address
      );
      expect(contractBalanceBefore).to.equal(ethers.constants.Zero);

      await expect(
        polycloud.connect(owner).withdrawAllFunds()
      ).to.be.revertedWith("No funds to withdraw");
    });
    it("Should return the contract balance when called by the owner", async function () {
      const contractBalance = await polycloud.getContractBalance();
      const expectedContractBalance = await ethers.provider.getBalance(
        polycloud.address
      );
      expect(contractBalance).to.equal(expectedContractBalance);
    });

    it("Should revert if not called by the owner", async function () {
      await expect(
        polycloud.connect(user1).getContractBalance()
      ).to.be.revertedWith("Only the owner can call this function");
    });
  });
});
