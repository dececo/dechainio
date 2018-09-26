pragma solidity ^0.4.25;
import "github.com/dececo/dechainio/contracts/DET.sol";

contract OpenTask  {
    
    DET det;
    address owner;
    
    constructor(address initialDETAddress, address initialOwner) public {
        det = DET(initialDETAddress);
        owner = initialOwner;
    }
    
    function updateOwner(address newOwner) public onlyOwner {
    }
 
    function publish(string missionID, uint amountInWei) public {
    }
    
    function solve(string solutionID) public {
    }
    
    function confirmSolution(string solutionID) public {
    }
    
    function confirmArbitration(string solutionID, string arbitration) public {
    }
    
}
