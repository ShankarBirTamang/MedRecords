// After deploying the contract (see /blockchain/README or root README),
// Contract address and ABI generated from the local Hardhat deployment.
// The ABI below matches the public functions/events of MedicalRecords.sol —
// if you change the contract, regenerate this from
// blockchain/deployed/MedicalRecords.json (the `abi` field).

export const CONTRACT_ADDRESS =
  process.env.REACT_APP_CONTRACT_ADDRESS ||
  "0x5FbDB2315678afecb367f032d93F642f64180aa3";
export const CONTRACT_ABI = [
  "function addRecord(bytes32 fileHash, string fileName) returns (uint256)",
  "function requestAccess(address patient) returns (uint256)",
  "function grantAccess(uint256 requestId)",
  "function rejectAccess(uint256 requestId)",
  "function revokeAccess(address doctor)",
  "function checkAccess(address patient, address doctor) view returns (bool)",
  "function getPatientRecords(address patient) view returns (uint256[])",
  "function getRecord(uint256 recordId) view returns (bytes32 fileHash, address owner, string fileName, uint256 timestamp)",
  "event RecordAdded(uint256 indexed recordId, address indexed owner, bytes32 fileHash, uint256 timestamp)",
  "event AccessRequested(uint256 indexed requestId, address indexed doctor, address indexed patient, uint256 timestamp)",
  "event AccessGranted(uint256 indexed requestId, address indexed doctor, address indexed patient, uint256 timestamp)",
  "event AccessRejected(uint256 indexed requestId, address indexed doctor, address indexed patient, uint256 timestamp)",
  "event AccessRevoked(address indexed doctor, address indexed patient, uint256 timestamp)",
];
