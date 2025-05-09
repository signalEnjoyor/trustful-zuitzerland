import { getWalletClient } from "@wagmi/core";
import { encodeFunctionData, type TransactionReceipt } from "viem";
import { waitForTransactionReceipt, sendCalls } from "viem/actions";

import { RESOLVER_CONTRACT_BASE } from "@/lib/client/constants";
import { publicClient } from "@/lib/wallet/client";
import { wagmiConfig } from "@/wagmi";

export async function setSchema({
  from,
  uid,
  action,
  msgValue,
}: {
  from: `0x${string}`;
  uid: `0x${string}`;
  action: number;
  msgValue: bigint;
}): Promise<TransactionReceipt | Error> {
  const actionAsBigInt = BigInt(action);
  const walletClient = await getWalletClient(wagmiConfig);

  const data = encodeFunctionData({
    abi: [
      {
        inputs: [
          { internalType: "bytes32", name: "uid", type: "bytes32" },
          { internalType: "uint256", name: "action", type: "uint256" },
        ],
        name: "setSchema",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
    ],
    args: [uid, actionAsBigInt],
  });

  try {
    const { id } = await sendCalls(walletClient, {
      account: from as `0x${string}`,
      calls: [
        {
          to: RESOLVER_CONTRACT_BASE as `0x${string}`,
          data: data,
          value: msgValue,
        },
      ],
      capabilities: {
        paymasterService: {
          url: process.env.NEXT_PUBLIC_PAYMASTER_AND_BUNDLER_ENDPOINT,
        },
      },
    });

    const callStatus = await walletClient.waitForCallsStatus({ id });

    const transactionReceipt: TransactionReceipt =
      await waitForTransactionReceipt(publicClient, {
        hash: callStatus.receipts![0].transactionHash,
      });

    return transactionReceipt;
  } catch (error) {
    return Error("Error sending transaction.");
  }
}
