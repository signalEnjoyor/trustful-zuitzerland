import { getWalletClient } from "@wagmi/core";
import { encodeFunctionData, type TransactionReceipt } from "viem";
import {
  waitForTransactionReceipt,
  sendCalls,
} from "viem/actions";

import { RESOLVER_CONTRACT_BASE } from "@/lib/client/constants";
import { publicClient } from "@/lib/wallet/client";
import { wagmiConfig } from "@/wagmi";

export async function setAttestationTitle({
  from,
  title,
  isValid,
  value,
}: {
  from: `0x${string}`;
  title: string;
  isValid: boolean;
  value: bigint;
}): Promise<TransactionReceipt | Error> {
  const walletClient = await getWalletClient(wagmiConfig);

  const data = encodeFunctionData({
    abi: [
      {
        inputs: [
          { internalType: "string", name: "title", type: "string" },
          { internalType: "bool", name: "isValid", type: "bool" },
        ],
        name: "setAttestationTitle",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
    ],
    args: [title, isValid],
  });

  try {
    const { id } = await sendCalls(walletClient, {
      account: from as `0x${string}`,
      calls: [{
        to: RESOLVER_CONTRACT_BASE as `0x${string}`,
        data: data,
        value: value,
      }],
      capabilities:{
        paymasterService: { 
          url: process.env.NEXT_PUBLIC_PAYMASTER_AND_BUNDLER_ENDPOINT
        } 
      }
    });

    const callStatus = await walletClient.waitForCallsStatus({ id })

    const transactionReceipt: TransactionReceipt = await waitForTransactionReceipt(publicClient,
      {
        hash: callStatus.receipts![0].transactionHash,
      }
    );

    return transactionReceipt;
  } catch (error) {
    return Error("Error sending transaction.");
  }
}
