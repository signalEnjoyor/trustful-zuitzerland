import { getWalletClient } from "@wagmi/core";
import { encodeFunctionData, type TransactionReceipt } from "viem";
import { waitForTransactionReceipt, sendCalls } from "viem/actions";

import { EAS_CONTRACT_BASE } from "@/lib/client/constants";
import { publicClient } from "@/lib/wallet/client";
import { wagmiConfig } from "@/wagmi";

export interface RevocationRequestData {
  uid: `0x${string}`;
  value: bigint;
}

export interface RevocationRequest {
  schema: `0x${string}`;
  data: RevocationRequestData;
}

export async function revoke(
  from: `0x${string}`,
  schemaUID: `0x${string}`,
  uid: `0x${string}`,
  value: bigint,
): Promise<TransactionReceipt | Error> {
  const walletClient = await getWalletClient(wagmiConfig);

  const revocationRequestData = {
    uid: uid,
    value: value,
  };

  const RevocationRequest: RevocationRequest = {
    schema: schemaUID,
    data: revocationRequestData,
  };

  const data = encodeFunctionData({
    abi: [
      {
        inputs: [
          {
            components: [
              {
                internalType: "bytes32",
                name: "schema",
                type: "bytes32",
              },
              {
                components: [
                  {
                    internalType: "bytes32",
                    name: "uid",
                    type: "bytes32",
                  },
                  {
                    internalType: "uint256",
                    name: "value",
                    type: "uint256",
                  },
                ],
                internalType: "struct RevocationRequestData",
                name: "data",
                type: "tuple",
              },
            ],
            internalType: "struct RevocationRequest",
            name: "request",
            type: "tuple",
          },
        ],
        name: "revoke",
        outputs: [],
        stateMutability: "payable",
        type: "function",
      },
    ],
    args: [RevocationRequest],
  });

  try {
    const { id } = await sendCalls(walletClient, {
      account: from as `0x${string}`,
      calls: [
        {
          to: EAS_CONTRACT_BASE as `0x${string}`,
          data: data,
          value: revocationRequestData.value,
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
    return Error("Error sending transaction");
  }
}
