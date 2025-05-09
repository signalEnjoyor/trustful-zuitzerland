// components/MainPane.tsx
import { useContext, type FC } from "react";

import { Box, Button, Flex, Heading } from "@chakra-ui/react";
import { Space_Grotesk } from "next/font/google";
import { useRouter } from "next/navigation";
import { BeatLoader } from "react-spinners";
import { useAccount } from "wagmi";

import { CreatedByBlockful } from "@/components/01-atoms";
import { useWindowSize } from "@/hooks";
import { WalletContext } from "@/lib/context/WalletContext";
import styles from "@/styles/mainPane.module.css";

import { ConnectButton } from "../01-atoms/ConnectButton";

const grotesk = Space_Grotesk({ subsets: ["latin"] });

export const MainPane: FC = () => {
  const { address } = useAccount();
  const { isMobile } = useWindowSize();
  const { push } = useRouter();
  const { villagerAttestationCount } = useContext(WalletContext);

  const handleNavigate = () => {
    if (villagerAttestationCount !== null) {
      if (villagerAttestationCount === 0) push("/pre-checkin");
      else push("/my-badges");
    }
  };

  return (
    <Box className={styles.container}>
      <Flex>
        <Heading
          as="h2"
          className={`${grotesk.className} text-[53px] font-normal leading-[64px]`}
          color="#F5FFFF"
        >
          Online
          <br />
          reputation
          <br />
          made easy
        </Heading>
      </Flex>
      {address && (
        <>
          <Box
            display={"flex"}
            alignItems={"left"}
            justifyContent={"left"}
            flex={1}
          >
            <Button
              className="px-6 py-4 text-black rounded-lg"
              _loading={{
                opacity: 1,
                cursor: "not-allowed",
              }}
              backgroundColor={
                villagerAttestationCount === null ? "transparent" : "#B1EF42"
              }
              isLoading={villagerAttestationCount === null}
              spinner={<BeatLoader size={8} color="#B1EF42" />}
              _hover={{
                bg: "bg-[#B1EF42]",
              }}
              _active={{
                bg: "bg-[#B1EF42]",
              }}
              onClick={() => handleNavigate()}
            >
              Go to dApp
            </Button>
          </Box>
        </>
      )}
      {!address && isMobile && (
        <Flex className={styles.content}>
          <ConnectButton />
        </Flex>
      )}
      <Flex className="bottom-[5%] absolute mt-auto">
        <CreatedByBlockful />
      </Flex>
    </Box>
  );
};
