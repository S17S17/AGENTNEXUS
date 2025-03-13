# Reputation and Reward System Specification

## Overview

The Reputation and Reward System is a core component of AGENTNEXUS, designed to incentivize quality contributions, foster community engagement, and establish trust within the ecosystem. This dual-incentive model combines non-transferable reputation tokens for governance with transferable reward tokens for economic incentives, creating a balanced system that promotes both quality and participation.

This specification details the architecture, mechanisms, token economics, and implementation strategies for the Reputation and Reward System.

## Design Goals

The Reputation and Reward System is designed with the following goals:

1. **Meritocracy**: Reward valuable contributions based on quality and impact rather than status
2. **Sybil Resistance**: Prevent manipulation through multiple fake identities
3. **Alignment**: Ensure incentives align with the long-term health of the ecosystem
4. **Inclusivity**: Enable participation regardless of economic resources
5. **Sustainability**: Create a self-sustaining economic model
6. **Transparency**: Make reputation and reward calculations transparent and auditable
7. **Flexibility**: Adapt to evolving community needs and priorities

## System Architecture

The Reputation and Reward System employs a dual-token architecture with distinct but complementary mechanisms:

```
┌─────────────────────────────────────────────────────────────┐
│               Reputation and Reward System                   │
├─────────────────────────────┬─────────────────────────────┤
│     Reputation System       │       Reward System         │
│  (Non-transferable Tokens)  │  (Transferable Tokens)      │
├─────────────────────────────┴─────────────────────────────┤
│                  Contribution Tracking                      │
├─────────────────────────────────────────────────────────────┤
│                  Governance Mechanism                        │
└─────────────────────────────────────────────────────────────┘
```

### Reputation System

The Reputation System uses non-transferable tokens (soulbound tokens) tied to a user's identity to represent their standing in the community. Reputation is multi-dimensional, capturing different aspects of contribution and behavior.

### Reward System

The Reward System uses transferable tokens on the Polygon blockchain (NEXUS tokens) to provide tangible economic incentives for valuable contributions. These tokens have utility within the platform and can be exchanged for other cryptocurrencies.

### Contribution Tracking

This component monitors and evaluates different types of contributions to the ecosystem, including agent submissions, improvements, reviews, and community support.

### Governance Mechanism

This component enables high-reputation members to influence platform decisions through proposal submission and quadratic voting.

## Reputation System

### Reputation Dimensions

Reputation in AGENTNEXUS is multi-dimensional, with separate scores for different aspects of contribution:

1. **Development Reputation**: Quality and impact of contributed agents and code
2. **Curation Reputation**: Accuracy and helpfulness of reviews and ratings
3. **Validation Reputation**: Effectiveness in identifying issues during validation
4. **Community Reputation**: Helpfulness in forums, documentation, and support
5. **Governance Reputation**: Quality of governance participation and proposals

### Reputation Calculation

Each reputation dimension is calculated using specific metrics:

#### Development Reputation

```
DevRep = Σ(AgentQuality × AgentUsage × AgentComplexity)
```

Where:
- **AgentQuality**: Average rating from users and validators (1-5 scale)
- **AgentUsage**: Normalized measure of agent adoption and usage
- **AgentComplexity**: Factor based on agent capabilities and sophistication

#### Curation Reputation

```
CurRep = Σ(ReviewAccuracy × ReviewHelpfulness × ReviewComplexity)
```

Where:
- **ReviewAccuracy**: Agreement with consensus ratings
- **ReviewHelpfulness**: Upvotes from other users
- **ReviewComplexity**: Factor based on depth and detail of review

#### Validation Reputation

```
ValRep = Σ(ValidationAccuracy × ValidationThoroughness × ValidationImpact)
```

Where:
- **ValidationAccuracy**: Percentage of validated issues confirmed by developers
- **ValidationThoroughness**: Comprehensiveness of validation
- **ValidationImpact**: Severity and importance of identified issues

#### Community Reputation

```
ComRep = Σ(ForumContributions × DocumentationQuality × SupportEffectiveness)
```

Where:
- **ForumContributions**: Helpful posts and responses
- **DocumentationQuality**: Quality of contributed documentation
- **SupportEffectiveness**: Successful resolution of support issues

#### Governance Reputation

```
GovRep = Σ(ProposalQuality × VotingConsistency × DeliberationValue)
```

Where:
- **ProposalQuality**: Community rating of submitted proposals
- **VotingConsistency**: Consistency in voting patterns
- **DeliberationValue**: Contribution to governance discussions

### Overall Reputation Score

The overall reputation score is a weighted combination of the dimension scores:

```
OverallRep = (w₁ × DevRep + w₂ × CurRep + w₃ × ValRep + w₄ × ComRep + w₅ × GovRep) / Σw
```

Where w₁ through w₅ are weights that can be adjusted through governance.

### Reputation Decay

To ensure reputation reflects recent contributions, a decay function is applied:

```
RepDecay(t) = Rep × e^(-λt)
```

Where:
- **t**: Time since last contribution (in days)
- **λ**: Decay rate parameter (governable)

### Reputation Levels

Reputation scores map to levels that unlock different privileges:

| Level | Name | Required Score | Privileges |
|-------|------|---------------|------------|
| 1 | Newcomer | 0-99 | Basic platform access |
| 2 | Contributor | 100-499 | Submit agents, write reviews |
| 3 | Established | 500-999 | Participate in validation |
| 4 | Expert | 1,000-2,499 | Early access to features |
| 5 | Steward | 2,500+ | Governance voting rights |

### Reputation Visualization

Reputation is visualized through:

1. **Badges**: Visual indicators of reputation level and specializations
2. **Reputation Graph**: Interactive visualization of reputation dimensions
3. **Activity Timeline**: History of reputation-earning activities
4. **Comparative Ranking**: Optional display of ranking within community

## Reward System

### NEXUS Token

The NEXUS token is the transferable reward token of AGENTNEXUS, implemented as an ERC-20 token on the Polygon blockchain.

#### Token Utility

NEXUS tokens have multiple utilities within the ecosystem:

1. **Agent Deployment**: Stake tokens to deploy agents to production
2. **Premium Features**: Access advanced platform features
3. **Validation Priority**: Expedite validation process
4. **Governance Weight**: Increase voting power in certain governance decisions
5. **Fee Discounts**: Reduce platform usage fees

#### Token Economics

The NEXUS token has the following economic parameters:

- **Initial Supply**: 100,000,000 NEXUS
- **Maximum Supply**: 1,000,000,000 NEXUS
- **Emission Schedule**: Decreasing emission rate over 10 years
- **Distribution**: 
  - 40% Community rewards
  - 20% Development fund
  - 15% Early contributors
  - 15% Ecosystem growth
  - 10% Foundation reserve

### Reward Mechanisms

The system distributes rewards for various valuable contributions:

#### Agent Development Rewards

```
AgentReward = BaseReward × QualityMultiplier × UsageMultiplier × NoveltyMultiplier
```

Where:
- **BaseReward**: Base token amount for agent submission
- **QualityMultiplier**: Factor based on agent ratings (0.5-3.0)
- **UsageMultiplier**: Factor based on adoption and usage (0.5-5.0)
- **NoveltyMultiplier**: Factor based on innovation (1.0-2.0)

#### Curation Rewards

```
CurationReward = BaseReward × AccuracyMultiplier × HelpfulnessMultiplier × TimelinessMultiplier
```

Where:
- **BaseReward**: Base token amount for reviews
- **AccuracyMultiplier**: Factor based on review accuracy (0.5-2.0)
- **HelpfulnessMultiplier**: Factor based on community ratings (0.5-2.0)
- **TimelinessMultiplier**: Factor based on review timing (0.8-1.5)

#### Validation Rewards

```
ValidationReward = BaseReward × IssuesIdentifiedMultiplier × SeverityMultiplier
```

Where:
- **BaseReward**: Base token amount for validation
- **IssuesIdentifiedMultiplier**: Factor based on valid issues found (0.5-3.0)
- **SeverityMultiplier**: Factor based on issue severity (1.0-5.0)

#### Community Support Rewards

```
SupportReward = BaseReward × HelpfulnessMultiplier × ComplexityMultiplier
```

Where:
- **BaseReward**: Base token amount for support activities
- **HelpfulnessMultiplier**: Factor based on user ratings (0.5-2.0)
- **ComplexityMultiplier**: Factor based on issue complexity (1.0-3.0)

### Staking Mechanism

Users can stake NEXUS tokens to:

1. **Earn Yield**: Generate passive returns from platform fees
2. **Boost Reputation**: Increase reputation earning rate (capped)
3. **Access Features**: Unlock premium platform capabilities
4. **Participate in Governance**: Weight in certain governance decisions

Staking parameters:
- **Minimum Stake**: 100 NEXUS
- **Staking Periods**: 30, 90, 180, 365 days
- **Yield Rate**: Base rate + bonus based on reputation level
- **Reputation Boost**: Up to 20% increase in reputation earning rate

### Reward Distribution

Rewards are distributed through:

1. **Periodic Distribution**: Weekly reward calculations and distributions
2. **Immediate Triggers**: Instant rewards for specific high-value actions
3. **Claim Mechanism**: User-initiated claims for accumulated rewards
4. **Compound Options**: Automatic reinvestment of rewards into staking

## Contribution Tracking

### Trackable Contributions

The system tracks various types of contributions:

1. **Agent Submissions**: New agents added to the registry
2. **Agent Improvements**: Updates and enhancements to existing agents
3. **Reviews and Ratings**: Evaluations of agents by users
4. **Validation Activities**: Security and performance validation
5. **Documentation**: Creation and improvement of documentation
6. **Community Support**: Helping other users in forums and support channels
7. **Governance Participation**: Proposals and voting in governance

### Tracking Mechanisms

Contributions are tracked through:

1. **On-chain Events**: Blockchain records of registry interactions
2. **Platform Analytics**: Usage and performance metrics
3. **User Interactions**: Ratings, upvotes, and other feedback
4. **Validation Results**: Outcomes from the validation pipeline

### Attribution System

The attribution system ensures proper credit for contributions:

1. **Contribution Signatures**: Cryptographic proof of authorship
2. **Collaborative Attribution**: Fair distribution of credit for team efforts
3. **Derivative Recognition**: Acknowledgment of building upon others' work

## Governance Mechanism

### Governance Powers

Reputation and tokens grant different governance powers:

1. **Proposal Submission**: Create governance proposals
2. **Voting Rights**: Vote on proposals
3. **Parameter Adjustment**: Influence system parameters
4. **Curation Decisions**: Participate in content curation

### Voting Mechanisms

The system employs several voting mechanisms:

1. **Reputation-Weighted Voting**: Vote weight based on relevant reputation dimension
2. **Quadratic Voting**: Square root of voting power to balance influence
3. **Conviction Voting**: Increasing vote weight over time to reward commitment
4. **Delegation**: Option to delegate voting power to trusted representatives

### Proposal Types

Various types of proposals can be submitted:

1. **Feature Proposals**: New platform features
2. **Parameter Adjustments**: Changes to system parameters
3. **Funding Allocations**: Distribution of community funds
4. **Policy Updates**: Changes to platform policies
5. **Emergency Actions**: Rapid response to critical issues

## Smart Contracts

The Reputation and Reward System is implemented through a set of smart contracts on the Polygon blockchain:

### ReputationToken Contract

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract ReputationToken is ERC721Enumerable, AccessControl {
    bytes32 public constant REPUTATION_MANAGER_ROLE = keccak256("REPUTATION_MANAGER_ROLE");
    
    // Reputation dimensions
    struct ReputationScore {
        uint256 development;
        uint256 curation;
        uint256 validation;
        uint256 community;
        uint256 governance;
        uint256 lastUpdateTimestamp;
    }
    
    // Mapping from token ID to reputation score
    mapping(uint256 => ReputationScore) private _reputationScores;
    
    // Mapping from address to token ID
    mapping(address => uint256) private _addressToTokenId;
    
    // Decay rate parameter (in basis points, 100 = 1%)
    uint256 public decayRateBasisPoints = 10;
    
    // Reputation level thresholds
    uint256[] public levelThresholds = [0, 100, 500, 1000, 2500];
    
    // Dimension weights (in basis points, 100 = 1%)
    uint256 public developmentWeight = 2500;
    uint256 public curationWeight = 2000;
    uint256 public validationWeight = 2000;
    uint256 public communityWeight = 1500;
    uint256 public governanceWeight = 2000;
    
    constructor() ERC721("AGENTNEXUS Reputation", "NEXUSREP") {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(REPUTATION_MANAGER_ROLE, msg.sender);
    }
    
    // Mint a new reputation token to an address
    function mintReputationToken(address to) external onlyRole(REPUTATION_MANAGER_ROLE) returns (uint256) {
        require(_addressToTokenId[to] == 0, "Address already has a reputation token");
        
        uint256 tokenId = totalSupply() + 1;
        _mint(to, tokenId);
        
        _addressToTokenId[to] = tokenId;
        _reputationScores[tokenId] = ReputationScore({
            development: 0,
            curation: 0,
            validation: 0,
            community: 0,
            governance: 0,
            lastUpdateTimestamp: block.timestamp
        });
        
        return tokenId;
    }
    
    // Update reputation score for a specific dimension
    function updateReputationDimension(
        address user,
        string calldata dimension,
        uint256 amount,
        bool isIncrease
    ) external onlyRole(REPUTATION_MANAGER_ROLE) returns (bool) {
        uint256 tokenId = _addressToTokenId[user];
        require(tokenId != 0, "User does not have a reputation token");
        
        ReputationScore storage score = _reputationScores[tokenId];
        
        // Apply decay to current scores
        applyDecay(tokenId);
        
        // Update the specified dimension
        if (keccak256(bytes(dimension)) == keccak256(bytes("development"))) {
            if (isIncrease) {
                score.development += amount;
            } else {
                score.development = score.development > amount ? score.development - amount : 0;
            }
        } else if (keccak256(bytes(dimension)) == keccak256(bytes("curation"))) {
            if (isIncrease) {
                score.curation += amount;
            } else {
                score.curation = score.curation > amount ? score.curation - amount : 0;
            }
        } else if (keccak256(bytes(dimension)) == keccak256(bytes("validation"))) {
            if (isIncrease) {
                score.validation += amount;
            } else {
                score.validation = score.validation > amount ? score.validation - amount : 0;
            }
        } else if (keccak256(bytes(dimension)) == keccak256(bytes("community"))) {
            if (isIncrease) {
                score.community += amount;
            } else {
                score.community = score.community > amount ? score.community - amount : 0;
            }
        } else if (keccak256(bytes(dimension)) == keccak256(bytes("governance"))) {
            if (isIncrease) {
                score.governance += amount;
            } else {
                score.governance = score.governance > amount ? score.governance - amount : 0;
            }
        } else {
            revert("Invalid dimension");
        }
        
        score.lastUpdateTimestamp = block.timestamp;
        
        return true;
    }
    
    // Apply decay to reputation scores based on time since last update
    function applyDecay(uint256 tokenId) internal {
        ReputationScore storage score = _reputationScores[tokenId];
        
        uint256 daysSinceUpdate = (block.timestamp - score.lastUpdateTimestamp) / 86400;
        if (daysSinceUpdate > 0) {
            // Calculate decay factor (simplified for on-chain calculation)
            // decay = original * (1 - rate)^days
            uint256 decayFactor = 10000;
            for (uint256 i = 0; i < daysSinceUpdate; i++) {
                decayFactor = decayFactor * (10000 - decayRateBasisPoints) / 10000;
            }
            
            // Apply decay to each dimension
            score.development = score.development * decayFactor / 10000;
            score.curation = score.curation * decayFactor / 10000;
            score.validation = score.validation * decayFactor / 10000;
            score.community = score.community * decayFactor / 10000;
            score.governance = score.governance * decayFactor / 10000;
        }
    }
    
    // Get reputation score for a user
    function getReputationScore(address user) external view returns (
        uint256 development,
        uint256 curation,
        uint256 validation,
        uint256 community,
        uint256 governance,
        uint256 overall,
        uint256 level
    ) {
        uint256 tokenId = _addressToTokenId[user];
        require(tokenId != 0, "User does not have a reputation token");
        
        ReputationScore memory score = _reputationScores[tokenId];
        
        // Calculate overall score (weighted average)
        overall = (
            score.development * developmentWeight +
            score.curation * curationWeight +
            score.validation * validationWeight +
            score.community * communityWeight +
            score.governance * governanceWeight
        ) / (developmentWeight + curationWeight + validationWeight + communityWeight + governanceWeight);
        
        // Determine level
        level = 0;
        for (uint256 i = 0; i < levelThresholds.length; i++) {
            if (overall >= levelThresholds[i]) {
                level = i + 1;
            } else {
                break;
            }
        }
        
        return (
            score.development,
            score.curation,
            score.validation,
            score.community,
            score.governance,
            overall,
            level
        );
    }
    
    // Override transfer functions to prevent transfers (soulbound)
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal override {
        require(from == address(0) || to == address(0), "Reputation tokens are non-transferable");
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }
    
    // Update system parameters (only through governance)
    function updateParameters(
        uint256 _decayRateBasisPoints,
        uint256 _developmentWeight,
        uint256 _curationWeight,
        uint256 _validationWeight,
        uint256 _communityWeight,
        uint256 _governanceWeight,
        uint256[] calldata _levelThresholds
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        decayRateBasisPoints = _decayRateBasisPoints;
        developmentWeight = _developmentWeight;
        curationWeight = _curationWeight;
        validationWeight = _validationWeight;
        communityWeight = _communityWeight;
        governanceWeight = _governanceWeight;
        levelThresholds = _levelThresholds;
    }
}
```

### NexusToken Contract

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract NexusToken is ERC20, ERC20Burnable, Pausable, AccessControl {
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant REWARD_MANAGER_ROLE = keccak256("REWARD_MANAGER_ROLE");
    
    uint256 public constant INITIAL_SUPPLY = 100_000_000 * 10**18;
    uint256 public constant MAX_SUPPLY = 1_000_000_000 * 10**18;
    
    // Emission schedule
    uint256 public emissionStartTimestamp;
    uint256 public emissionEndTimestamp;
    uint256 public lastEmissionTimestamp;
    uint256 public emissionRate; // tokens per day
    
    constructor() ERC20("AGENTNEXUS Token", "NEXUS") {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(PAUSER_ROLE, msg.sender);
        _setupRole(MINTER_ROLE, msg.sender);
        _setupRole(REWARD_MANAGER_ROLE, msg.sender);
        
        // Mint initial supply
        _mint(msg.sender, INITIAL_SUPPLY);
        
        // Set emission schedule (10 years)
        emissionStartTimestamp = block.timestamp;
        emissionEndTimestamp = block.timestamp + 3650 days;
        lastEmissionTimestamp = block.timestamp;
        emissionRate = (MAX_SUPPLY - INITIAL_SUPPLY) / 3650;
    }
    
    // Distribute rewards to a user
    function distributeReward(address to, uint256 amount) external onlyRole(REWARD_MANAGER_ROLE) returns (bool) {
        require(totalSupply() + amount <= MAX_SUPPLY, "Exceeds maximum supply");
        _mint(to, amount);
        return true;
    }
    
    // Batch distribute rewards
    function batchDistributeRewards(
        address[] calldata recipients,
        uint256[] calldata amounts
    ) external onlyRole(REWARD_MANAGER_ROLE) returns (bool) {
        require(recipients.length == amounts.length, "Arrays length mismatch");
        
        uint256 totalAmount = 0;
        for (uint256 i = 0; i < amounts.length; i++) {
            totalAmount += amounts[i];
        }
        
        require(totalSupply() + totalAmount <= MAX_SUPPLY, "Exceeds maximum supply");
        
        for (uint256 i = 0; i < recipients.length; i++) {
            _mint(recipients[i], amounts[i]);
        }
        
        return true;
    }
    
    // Release tokens according to emission schedule
    function releaseEmission() external onlyRole(MINTER_ROLE) returns (uint256) {
        require(block.timestamp > lastEmissionTimestamp, "Already released for current period");
        require(block.timestamp <= emissionEndTimestamp, "Emission period ended");
        
        uint256 daysSinceLastEmission = (block.timestamp - lastEmissionTimestamp) / 86400;
        uint256 amountToRelease = daysSinceLastEmission * emissionRate;
        
        if (totalSupply() + amountToRelease > MAX_SUPPLY) {
            amountToRelease = MAX_SUPPLY - totalSupply();
        }
        
        if (amountToRelease > 0) {
            _mint(msg.sender, amountToRelease);
            lastEmissionTimestamp = block.timestamp;
        }
        
        return amountToRelease;
    }
    
    function pause() external onlyRole(PAUSER_ROLE) {
        _pause();
    }
    
    function unpause() external onlyRole(PAUSER_ROLE) {
        _unpause();
    }
    
    function _beforeTokenTransfer(address from, address to, uint256 amount) internal override whenNotPaused {
        super._beforeTokenTransfer(from, to, amount);
    }
}
```

### StakingContract

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract NexusStaking is ReentrancyGuard, AccessControl {
    using SafeERC20 for IERC20;
    
    bytes32 public constant STAKING_MANAGER_ROLE = keccak256("STAKING_MANAGER_ROLE");
    
    // Staking token (NEXUS)
    IERC20 public stakingToken;
    
    // Staking periods in days
    uint256[] public stakingPeriods = [30, 90, 180, 365];
    
    // Base APY for each staking period (in basis points, 100 = 1%)
    mapping(uint256 => uint256) public baseAPY;
    
    // Reputation boost cap (in basis points, 100 = 1%)
    uint256 public reputationBoostCap = 2000; // 20%
    
    // Minimum stake amount
    uint256 public minStakeAmount = 100 * 10**18; // 100 NEXUS
    
    // Stake struct
    struct Stake {
        uint256 amount;
        uint256 startTime;
        uint256 endTime;
        uint256 lastClaimTime;
        uint256 periodDays;
        bool active;
    }
    
    // Mapping from user address to array of stakes
    mapping(address => Stake[]) public userStakes;
    
    // Total staked amount
    uint256 public totalStaked;
    
    // Events
    event Staked(address indexed user, uint256 amount, uint256 periodDays, uint256 stakeIndex);
    event Unstaked(address indexed user, uint256 amount, uint256 stakeIndex);
    event RewardClaimed(address indexed user, uint256 amount, uint256 stakeIndex);
    
    constructor(address _stakingToken) {
        stakingToken = IERC20(_stakingToken);
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(STAKING_MANAGER_ROLE, msg.sender);
        
        // Set initial base APY for each period
        baseAPY[30] = 500;    // 5% APY for 30 days
        baseAPY[90] = 800;    // 8% APY for 90 days
        baseAPY[180] = 1200;  // 12% APY for 180 days
        baseAPY[365] = 2000;  // 20% APY for 365 days
    }
    
    // Stake tokens for a specific period
    function stake(uint256 amount, uint256 periodDays) external nonReentrant returns (uint256) {
        require(amount >= minStakeAmount, "Amount below minimum stake");
        require(isValidStakingPeriod(periodDays), "Invalid staking period");
        
        stakingToken.safeTransferFrom(msg.sender, address(this), amount);
        
        Stake memory newStake = Stake({
            amount: amount,
            startTime: block.timestamp,
            endTime: block.timestamp + (periodDays * 1 days),
            lastClaimTime: block.timestamp,
            periodDays: periodDays,
            active: true
        });
        
        userStakes[msg.sender].push(newStake);
        totalStaked += amount;
        
        uint256 stakeIndex = userStakes[msg.sender].length - 1;
        emit Staked(msg.sender, amount, periodDays, stakeIndex);
        
        return stakeIndex;
    }
    
    // Unstake tokens after staking period ends
    function unstake(uint256 stakeIndex) external nonReentrant returns (uint256) {
        require(stakeIndex < userStakes[msg.sender].length, "Invalid stake index");
        
        Stake storage userStake = userStakes[msg.sender][stakeIndex];
        require(userStake.active, "Stake not active");
        require(block.timestamp >= userStake.endTime, "Staking period not ended");
        
        uint256 amount = userStake.amount;
        uint256 reward = calculateReward(msg.sender, stakeIndex);
        
        userStake.active = false;
        totalStaked -= amount;
        
        // Transfer principal and reward
        stakingToken.safeTransfer(msg.sender, amount + reward);
        
        emit Unstaked(msg.sender, amount, stakeIndex);
        emit RewardClaimed(msg.sender, reward, stakeIndex);
        
        return amount + reward;
    }
    
    // Claim rewards without unstaking
    function claimReward(uint256 stakeIndex) external nonReentrant returns (uint256) {
        require(stakeIndex < userStakes[msg.sender].length, "Invalid stake index");
        
        Stake storage userStake = userStakes[msg.sender][stakeIndex];
        require(userStake.active, "Stake not active");
        
        uint256 reward = calculateReward(msg.sender, stakeIndex);
        require(reward > 0, "No reward to claim");
        
        userStake.lastClaimTime = block.timestamp;
        
        // Transfer reward
        stakingToken.safeTransfer(msg.sender, reward);
        
        emit RewardClaimed(msg.sender, reward, stakeIndex);
        
        return reward;
    }
    
    // Calculate reward for a stake
    function calculateReward(address user, uint256 stakeIndex) public view returns (uint256) {
        require(stakeIndex < userStakes[user].length, "Invalid stake index");
        
        Stake memory userStake = userStakes[user][stakeIndex];
        if (!userStake.active) {
            return 0;
        }
        
        uint256 endTime = block.timestamp < userStake.endTime ? block.timestamp : userStake.endTime;
        uint256 stakingDuration = endTime - userStake.lastClaimTime;
        
        // Get base APY for this period
        uint256 apy = baseAPY[userStake.periodDays];
        
        // Calculate reward: principal * APY * (duration / 365 days)
        uint256 reward = userStake.amount * apy * stakingDuration / (365 days * 10000);
        
        return reward;
    }
    
    // Get all stakes for a user
    function getUserStakes(address user) external view returns (Stake[] memory) {
        return userStakes[user];
    }
    
    // Check if a staking period is valid
    function isValidStakingPeriod(uint256 periodDays) public view returns (bool) {
        for (uint256 i = 0; i < stakingPeriods.length; i++) {
            if (stakingPeriods[i] == periodDays) {
                return true;
            }
        }
        return false;
    }
    
    // Update staking parameters (only through governance)
    function updateStakingParameters(
        uint256[] calldata _stakingPeriods,
        uint256[] calldata _baseAPYs,
        uint256 _reputationBoostCap,
        uint256 _minStakeAmount
    ) external onlyRole(STAKING_MANAGER_ROLE) {
        require(_stakingPeriods.length == _baseAPYs.length, "Arrays length mismatch");
        
        // Update staking periods and APYs
        delete stakingPeriods;
        for (uint256 i = 0; i < _stakingPeriods.length; i++) {
            stakingPeriods.push(_stakingPeriods[i]);
            baseAPY[_stakingPeriods[i]] = _baseAPYs[i];
        }
        
        reputationBoostCap = _reputationBoostCap;
        minStakeAmount = _minStakeAmount;
    }
}
```

### RewardManager Contract

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "./NexusToken.sol";
import "./ReputationToken.sol";

contract RewardManager is AccessControl {
    bytes32 public constant REWARD_DISTRIBUTOR_ROLE = keccak256("REWARD_DISTRIBUTOR_ROLE");
    
    // Token contracts
    NexusToken public nexusToken;
    ReputationToken public reputationToken;
    
    // Base reward amounts (in tokens with 18 decimals)
    uint256 public baseAgentReward = 100 * 10**18;
    uint256 public baseCurationReward = 10 * 10**18;
    uint256 public baseValidationReward = 25 * 10**18;
    uint256 public baseSupportReward = 5 * 10**18;
    
    // Reputation points per contribution
    uint256 public agentReputationPoints = 100;
    uint256 public curationReputationPoints = 20;
    uint256 public validationReputationPoints = 50;
    uint256 public supportReputationPoints = 10;
    
    // Events
    event RewardDistributed(address indexed user, string contributionType, uint256 tokenAmount, uint256 reputationAmount);
    
    constructor(address _nexusToken, address _reputationToken) {
        nexusToken = NexusToken(_nexusToken);
        reputationToken = ReputationToken(_reputationToken);
        
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(REWARD_DISTRIBUTOR_ROLE, msg.sender);
    }
    
    // Distribute reward for agent development
    function rewardAgentDevelopment(
        address developer,
        uint256 qualityMultiplier,
        uint256 usageMultiplier,
        uint256 noveltyMultiplier
    ) external onlyRole(REWARD_DISTRIBUTOR_ROLE) returns (uint256, uint256) {
        // Calculate token reward
        uint256 tokenReward = calculateAgentReward(qualityMultiplier, usageMultiplier, noveltyMultiplier);
        
        // Calculate reputation reward
        uint256 reputationReward = agentReputationPoints * qualityMultiplier * usageMultiplier * noveltyMultiplier / 10**6;
        
        // Distribute rewards
        nexusToken.distributeReward(developer, tokenReward);
        reputationToken.updateReputationDimension(developer, "development", reputationReward, true);
        
        emit RewardDistributed(developer, "agent_development", tokenReward, reputationReward);
        
        return (tokenReward, reputationReward);
    }
    
    // Distribute reward for curation
    function rewardCuration(
        address curator,
        uint256 accuracyMultiplier,
        uint256 helpfulnessMultiplier,
        uint256 timelinessMultiplier
    ) external onlyRole(REWARD_DISTRIBUTOR_ROLE) returns (uint256, uint256) {
        // Calculate token reward
        uint256 tokenReward = calculateCurationReward(accuracyMultiplier, helpfulnessMultiplier, timelinessMultiplier);
        
        // Calculate reputation reward
        uint256 reputationReward = curationReputationPoints * accuracyMultiplier * helpfulnessMultiplier * timelinessMultiplier / 10**6;
        
        // Distribute rewards
        nexusToken.distributeReward(curator, tokenReward);
        reputationToken.updateReputationDimension(curator, "curation", reputationReward, true);
        
        emit RewardDistributed(curator, "curation", tokenReward, reputationReward);
        
        return (tokenReward, reputationReward);
    }
    
    // Distribute reward for validation
    function rewardValidation(
        address validator,
        uint256 issuesIdentifiedMultiplier,
        uint256 severityMultiplier
    ) external onlyRole(REWARD_DISTRIBUTOR_ROLE) returns (uint256, uint256) {
        // Calculate token reward
        uint256 tokenReward = calculateValidationReward(issuesIdentifiedMultiplier, severityMultiplier);
        
        // Calculate reputation reward
        uint256 reputationReward = validationReputationPoints * issuesIdentifiedMultiplier * severityMultiplier / 10**4;
        
        // Distribute rewards
        nexusToken.distributeReward(validator, tokenReward);
        reputationToken.updateReputationDimension(validator, "validation", reputationReward, true);
        
        emit RewardDistributed(validator, "validation", tokenReward, reputationReward);
        
        return (tokenReward, reputationReward);
    }
    
    // Distribute reward for community support
    function rewardCommunitySupport(
        address supporter,
        uint256 helpfulnessMultiplier,
        uint256 complexityMultiplier
    ) external onlyRole(REWARD_DISTRIBUTOR_ROLE) returns (uint256, uint256) {
        // Calculate token reward
        uint256 tokenReward = calculateSupportReward(helpfulnessMultiplier, complexityMultiplier);
        
        // Calculate reputation reward
        uint256 reputationReward = supportReputationPoints * helpfulnessMultiplier * complexityMultiplier / 10**4;
        
        // Distribute rewards
        nexusToken.distributeReward(supporter, tokenReward);
        reputationToken.updateReputationDimension(supporter, "community", reputationReward, true);
        
        emit RewardDistributed(supporter, "community_support", tokenReward, reputationReward);
        
        return (tokenReward, reputationReward);
    }
    
    // Calculate agent development reward
    function calculateAgentReward(
        uint256 qualityMultiplier,
        uint256 usageMultiplier,
        uint256 noveltyMultiplier
    ) public view returns (uint256) {
        return baseAgentReward * qualityMultiplier * usageMultiplier * noveltyMultiplier / 10**6;
    }
    
    // Calculate curation reward
    function calculateCurationReward(
        uint256 accuracyMultiplier,
        uint256 helpfulnessMultiplier,
        uint256 timelinessMultiplier
    ) public view returns (uint256) {
        return baseCurationReward * accuracyMultiplier * helpfulnessMultiplier * timelinessMultiplier / 10**6;
    }
    
    // Calculate validation reward
    function calculateValidationReward(
        uint256 issuesIdentifiedMultiplier,
        uint256 severityMultiplier
    ) public view returns (uint256) {
        return baseValidationReward * issuesIdentifiedMultiplier * severityMultiplier / 10**4;
    }
    
    // Calculate community support reward
    function calculateSupportReward(
        uint256 helpfulnessMultiplier,
        uint256 complexityMultiplier
    ) public view returns (uint256) {
        return baseSupportReward * helpfulnessMultiplier * complexityMultiplier / 10**4;
    }
    
    // Update reward parameters (only through governance)
    function updateRewardParameters(
        uint256 _baseAgentReward,
        uint256 _baseCurationReward,
        uint256 _baseValidationReward,
        uint256 _baseSupportReward,
        uint256 _agentReputationPoints,
        uint256 _curationReputationPoints,
        uint256 _validationReputationPoints,
        uint256 _supportReputationPoints
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        baseAgentReward = _baseAgentReward;
        baseCurationReward = _baseCurationReward;
        baseValidationReward = _baseValidationReward;
        baseSupportReward = _baseSupportReward;
        
        agentReputationPoints = _agentReputationPoints;
        curationReputationPoints = _curationReputationPoints;
        validationReputationPoints = _validationReputationPoints;
        supportReputationPoints = _supportReputationPoints;
    }
}
```

## API Specification

The Reputation and Reward System exposes the following APIs:

### RESTful API

#### Reputation Management

```
GET /users/{address}/reputation
```

Get reputation scores for a user.

Response:
```json
{
  "dimensions": {
    "development": 850,
    "curation": 420,
    "validation": 320,
    "community": 560,
    "governance": 180
  },
  "overall": 520,
  "level": 3,
  "levelName": "Established",
  "nextLevelThreshold": 1000,
  "progress": 52
}
```

```
GET /users/{address}/reputation/history
```

Get reputation history for a user.

Query parameters:
- `dimension`: Filter by dimension (optional)
- `from`: Start date (optional)
- `to`: End date (optional)
- `limit`: Maximum number of records (optional)

#### Reward Management

```
GET /users/{address}/rewards
```

Get reward history for a user.

Query parameters:
- `type`: Filter by reward type (optional)
- `from`: Start date (optional)
- `to`: End date (optional)
- `limit`: Maximum number of records (optional)

```
GET /rewards/leaderboard
```

Get reward leaderboard.

Query parameters:
- `period`: Time period (day, week, month, all)
- `type`: Filter by reward type (optional)
- `limit`: Maximum number of records (optional)

#### Staking Management

```
GET /users/{address}/stakes
```

Get staking information for a user.

```
POST /stakes
```

Create a new stake.

Request body:
```json
{
  "amount": "1000000000000000000000",
  "periodDays": 90
}
```

```
POST /stakes/{stakeId}/claim
```

Claim rewards for a stake.

```
POST /stakes/{stakeId}/unstake
```

Unstake tokens after staking period ends.

### GraphQL API

For more complex queries, a GraphQL API is provided:

```graphql
type ReputationScore {
  development: Int!
  curation: Int!
  validation: Int!
  community: Int!
  governance: Int!
  overall: Int!
  level: Int!
  levelName: String!
  nextLevelThreshold: Int
  progress: Int!
}

type ReputationHistory {
  timestamp: DateTime!
  dimension: String!
  amount: Int!
  action: String!
  source: String
}

type Reward {
  id: ID!
  timestamp: DateTime!
  type: String!
  amount: String!
  tokenAmount: String!
  reputationAmount: Int!
  transaction: String!
}

type Stake {
  id: ID!
  amount: String!
  startTime: DateTime!
  endTime: DateTime!
  periodDays: Int!
  active: Boolean!
  reward: String!
}

type Query {
  reputation(address: String!): ReputationScore!
  
  reputationHistory(
    address: String!,
    dimension: String,
    from: DateTime,
    to: DateTime,
    limit: Int
  ): [ReputationHistory!]!
  
  rewards(
    address: String!,
    type: String,
    from: DateTime,
    to: DateTime,
    limit: Int
  ): [Reward!]!
  
  rewardLeaderboard(
    period: String!,
    type: String,
    limit: Int
  ): [User!]!
  
  stakes(address: String!): [Stake!]!
}

type Mutation {
  createStake(amount: String!, periodDays: Int!): Stake!
  claimStakeReward(stakeId: ID!): String!
  unstake(stakeId: ID!): String!
}
```

## Implementation Guidelines

### Reputation System Implementation

1. **Identity Verification**: Implement optional identity verification to prevent Sybil attacks
2. **Reputation Bootstrapping**: Define initial reputation for new users
3. **Reputation Visualization**: Create intuitive visualizations of reputation dimensions
4. **Decay Calibration**: Fine-tune decay parameters to balance historical contributions with recent activity
5. **Abuse Prevention**: Implement mechanisms to detect and prevent reputation farming

### Reward System Implementation

1. **Token Distribution**: Implement fair initial token distribution
2. **Reward Calculation**: Create transparent reward calculation formulas
3. **Emission Schedule**: Design decreasing emission schedule to incentivize early participation
4. **Staking Mechanics**: Implement flexible staking options with varying lock periods
5. **Fee Structure**: Design sustainable fee structure for platform operations

### Integration with Other Components

1. **Registry Integration**: Connect with Decentralized Registry for agent contribution tracking
2. **Validation Pipeline Integration**: Link validation activities to reputation and rewards
3. **Governance Integration**: Use reputation and tokens for governance weight
4. **Search Engine Integration**: Incorporate reputation into search rankings
5. **Forum Integration**: Track and reward valuable forum contributions

## Security Considerations

### Sybil Resistance

To prevent manipulation through multiple fake identities:

1. **Identity Verification**: Optional verification for enhanced reputation earning
2. **Contribution Analysis**: Detection of suspicious patterns in contribution behavior
3. **Stake Requirements**: Minimum stake requirements for certain activities
4. **Reputation Caps**: Limits on reputation earning rates
5. **Social Graph Analysis**: Verification through social connections

### Economic Security

To ensure economic stability and prevent attacks:

1. **Token Supply Control**: Carefully managed token emission schedule
2. **Slashing Conditions**: Penalties for malicious behavior
3. **Governance Safeguards**: Protections against governance attacks
4. **Value Capture**: Mechanisms to ensure token value accrual
5. **Liquidity Management**: Strategies to maintain healthy token liquidity

### Privacy Considerations

To protect user privacy while maintaining system integrity:

1. **Selective Disclosure**: Control over what reputation information is public
2. **Zero-Knowledge Proofs**: Verification without revealing underlying data
3. **Pseudonymity**: Support for pseudonymous participation
4. **Data Minimization**: Collection of only necessary information
5. **Consent Management**: Clear user consent for data usage

## Governance Model

The Reputation and Reward System is governed through:

### Parameter Governance

Governable parameters include:
- Reputation weights and decay rates
- Reward base amounts and multipliers
- Staking periods and yields
- Token emission rates

### Upgrade Governance

The community can propose and vote on:
- Smart contract upgrades
- New reputation dimensions
- Additional reward mechanisms
- Integration with new components

### Dispute Resolution

For resolving disputes related to reputation and rewards:
- Flagging mechanism for suspicious activities
- Review process for contested reputation changes
- Appeal system for reward disputes
- Arbitration by high-reputation community members

## Future Enhancements

Potential future enhancements to the system include:

1. **Reputation Delegation**: Allow users to delegate reputation to trusted experts
2. **Specialized Reputation**: Domain-specific reputation for specialized expertise
3. **Reputation Insurance**: Mechanisms to protect against unfair reputation loss
4. **Cross-Platform Reputation**: Integration with external reputation systems
5. **Prediction Markets**: Markets for forecasting agent quality and performance
6. **Reputation-Based Lending**: Collateral-free loans based on reputation
7. **Reputation NFTs**: Non-fungible tokens representing significant achievements

## Conclusion

The Reputation and Reward System specification provides a comprehensive framework for incentivizing quality contributions to the AGENTNEXUS platform. By combining non-transferable reputation tokens for governance with transferable reward tokens for economic incentives, the system creates a balanced incentive structure that promotes both quality and participation.

The multi-dimensional reputation system captures different aspects of contribution, while the flexible reward mechanisms ensure fair compensation for valuable work. Together with the governance model, these components create a self-sustaining ecosystem that can evolve with the needs of the community.

Through careful design of security measures, privacy protections, and abuse prevention mechanisms, the system aims to create a trustworthy environment where contributors are recognized and rewarded based on merit rather than status or resources.
