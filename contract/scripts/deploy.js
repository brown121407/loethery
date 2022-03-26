const main = async () => {
    const ContractFactory = await hre.ethers.getContractFactory('Loethery');
    const Contract = await ContractFactory.deploy(1758);
    await Contract.deployed();
    console.log("Contract deployed to:", Contract.address);
  };
  
  const runMain = async () => {
    try {
      await main();
      process.exit(0);
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  };
  
  runMain();