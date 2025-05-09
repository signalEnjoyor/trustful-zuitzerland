import { getWalletClient } from "@wagmi/core";
import { encodeFunctionData, type TransactionReceipt } from "viem";
import { sendCalls, waitForTransactionReceipt } from "viem/actions";

import { wagmiConfig } from "@/wagmi";

import { RESOLVER_CONTRACT_BASE } from "../client/constants";
import { publicClient } from "../wallet/client";

export async function grantRole({
  from,
  role,
  account,
  msgValue,
}: {
  from: `0x${string}`;
  role: `0x${string}`;
  account: `0x${string}`;
  msgValue: bigint;
}): Promise<TransactionReceipt | Error> {
  const walletClient = await getWalletClient(wagmiConfig);

  const data = encodeFunctionData({
    abi: [
      {
        inputs: [
          { internalType: "bytes32", name: "role", type: "bytes32" },
          { internalType: "address", name: "account", type: "address" },
        ],
        name: "grantRole",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
    ],
    args: [role, account],
  });

  try {
    const { id } = await sendCalls(walletClient, {
      account: from,
      calls: [
        {
          to: RESOLVER_CONTRACT_BASE,
          value: msgValue,
          data: data,
        },
      ],
      capabilities: {
        paymasterService: {
          url: process.env.NEXT_PUBLIC_PAYMASTER_AND_BUNDLER_ENDPOINT,
        },
      },
    });

    const callStatus = await walletClient.waitForCallsStatus({
      id,
    });

    const transactionReceipt: TransactionReceipt =
      await waitForTransactionReceipt(publicClient, {
        hash: callStatus.receipts![0].transactionHash,
      });

    return transactionReceipt;
  } catch (error) {
    return Error("Error sending transaction.");
  }
}
