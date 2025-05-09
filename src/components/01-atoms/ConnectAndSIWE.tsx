import { useConnect } from "wagmi";
// import { cbWalletConnector } from "@/wagmi";
// import { logConnect, logSomethingElse } from "@/to-remove";

export function ConnectAndSIWE() {
  const { connectors, connect } = useConnect();

  return (
    <div>
      {connectors.map((connector) => (
        <button
          onClick={() => connect({ connector })}
          className="bg-white p-2 rounded-full "
        >
          Connect
        </button>
      ))}
    </div>
  );
}
