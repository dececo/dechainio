# OpenTask Interface

## Publish 发布任务

`publish(string missionId, uint rewardInWei) public`

甲方发布任务。
发布任务会将任务发布到区块链，同时，会抵押指定数量的`DET`币到合约。
DET代币是ERC20代币，调用该函数前，需要提前授权（`Approve`）给合约等量代币。
- missionId: 任务ID，用户标示任务
- rewardInWei: 任务价格，币种是DET，单位是Wei（DET含18位小数，与Ether相同）。

## Solve 解决任务

`solve(string solutionId, string missionId, string data) public`

解决任务，即乙方提交解决方案。
- `solutionId`: 解决方案ID
- `missionId`: 对应的任务ID
- `data`: 附加信息

## Accept 接受解决方案

`accept(string solutionId) public`

甲方接受解决方案。
接受任务时，会同时将相应的DET发送给乙方。
- `solutionId`: 解决方案ID

## Reject 拒绝解决方案

`reject(string solutionId) public`

甲方拒绝解决方案。
因故，甲方拒绝了该解决方案，此时不会有代币发送。

- `solutionId`: 解决方案ID

## Confirm 确认仲裁

`confirm(string solutionId, string arbitrationId) public`

甲方确认仲裁结果。
由于乙方对拒绝不满意，因此提请仲裁，仲裁结果有外部服务提供，甲方可以确认，如不确认，到期自动执行。

- `solutionId`: 解决方案ID