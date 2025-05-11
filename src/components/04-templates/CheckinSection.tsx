/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useState, useEffect } from "react";

import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Text,
  Flex,
  Divider,
  Collapse,
  ListItem,
  UnorderedList,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { BeatLoader } from "react-spinners";
import { useAccount } from "wagmi";

import {
  CopyToClipboardButton,
  CircleQuestion,
  QRCodeGiveBadge,
  TheFooterNavbar,
  TheHeader,
  TicketIcon,
} from "@/components/01-atoms";
import { useNotify } from "@/hooks/useNotify";
import { WalletContext } from "@/lib/context/WalletContext";
import { getEllipsedAddress } from "@/utils/formatters";

export const CheckinSection = () => {
  const { address, chain } = useAccount();

  const [isTrustfulVisible, setIsTrustfulVisible] = useState(false);
  const [isZuVillageVisible, setIsZuVillageVisible] = useState(false);
  const [isToDoNowVisible, setToDoNowVisible] = useState(false);
  const [isCheckoutForVisible, setIsCheckoutForVisible] = useState(false);
  const [isAboutPrivacyVisible, setIsAboutPrivacyVisible] = useState(false);
  const [isBadgeVisible, setIsBadgeVisible] = useState(false);
  const { notifyError } = useNotify();
  const { push } = useRouter();

  const { villagerAttestationCount } = useContext(WalletContext);

  useEffect(() => {
    if (villagerAttestationCount) {
      notifyError({
        title: "You have already checked in",
        message: "Redirecting to your badges.",
      });
      push("/my-badges");
    }
  }, [villagerAttestationCount]);

  return (
    <Flex flexDirection="column" minHeight="100vh" marginBottom="60px">
      {villagerAttestationCount !== null ? (
        <>
          <TheHeader />
          <Box
            flex={1}
            as="main"
            className="p-6 sm:px-[60px] sm:py-[80px] flex flex-col items-center"
            gap={6}
          >
            <Card
              className="px-8 py-6 mt-6 relative"
              background={"#212223"}
              border={2}
              borderRadius={16}
            >
              <Flex className="absolute left-1/2 top-1 -translate-x-1/2 -translate-y-1/2 border dark:border-[#161617] border-[#707572] bg-[#F6F6F6] dark:bg-[#212322] rounded-full w-[72px] h-[72px] flex items-center justify-center">
                <TicketIcon />
              </Flex>
              <CardHeader
                gap={2}
                display={"flex"}
                alignItems={"center"}
                justifyContent={"space-between"}
                flexDirection={"column"}
                p={0}
                pt={6}
              >
                <Flex className={"items-center"}>
                  <Text className="text-center text-lime-400 text-2xl font-normal font-['Space Grotesk'] leading-loose">
                    Check in Zuitzerland
                  </Text>
                </Flex>
                <Flex className={"items-center"} gap={2}>
                  <Text className="text-center text-slate-50 text-base font-normal leading-snug">
                    To start, please find a Manager to check you in.
                  </Text>
                </Flex>
              </CardHeader>
              <CardBody display={"flex"} flexDirection={"column"} p={0}>
                <Flex
                  alignItems={"center"}
                  justifyContent={"center"}
                  flexDirection={"column"}
                >
                  {address && chain ? (
                    <>
                      <QRCodeGiveBadge />
                      <Flex
                        color="white"
                        className="justify-center items-center gap-2"
                      >
                        <CopyToClipboardButton
                          isUserAddress={true}
                          showSvg={true}
                          svgClassName="ml-1"
                        >
                          {getEllipsedAddress(address)}
                        </CopyToClipboardButton>
                      </Flex>
                    </>
                  ) : (
                    "NO WALLET CONNECTED"
                  )}
                </Flex>
              </CardBody>
            </Card>

            <Flex
              flexDirection={"column"}
              className="w-full h-full items-center"
            >
              <Divider className="border-slate-50 opacity-10 w-full" />
              <Flex
                className="w-full flex-row py-3 cursor-pointer"
                gap={4}
                onClick={() => setIsTrustfulVisible(!isTrustfulVisible)}
              >
                <CircleQuestion />
                <Flex flexDirection={"column"} justifyContent={"center"}>
                  <Text className="text-slate-50 text-sm font-normal leading-tight">
                    What is Trustul?
                  </Text>
                </Flex>
              </Flex>
              <Collapse in={isTrustfulVisible} animateOpacity>
                <Box p="40px" color="white" pt="20px" pb="20px">
                  Trustful is a reputation aggregator system designed to match
                  governance, participation, and efforts. Using the Ethereum
                  Attestation Service (EAS) and a badge system. We can attest to
                  specific participations and ensure that this information
                  on-chain results in a scoring system. This system can be used
                  for resource allocation, governance etc.
                </Box>
              </Collapse>
              <Divider className="border-slate-50 opacity-10 w-full" />
              <Flex
                className="w-full flex-row py-3 cursor-pointer"
                gap={4}
                onClick={() => setIsZuVillageVisible(!isZuVillageVisible)}
              >
                <CircleQuestion />
                <Flex flexDirection={"column"} justifyContent={"center"}>
                  <Text className="text-slate-50 text-sm font-normal leading-tight">
                    How does it work in Zuitzerland?
                  </Text>
                </Flex>
              </Flex>
              <Collapse in={isZuVillageVisible} animateOpacity>
                <Box p="40px" color="white" pt="20px" pb="20px">
                  In Zuitzerland, your interactions and contributions will be
                  attested and stored on-chain. This promotes dialogue, avoids
                  echo chambers, and encourages participation. In the future,
                  this aggregated reputation can be used to benefit
                  participants, providing them with recognition.
                </Box>
              </Collapse>
              <Divider className="border-slate-50 opacity-10 w-full" />

              <Flex
                className="w-full flex-row py-3 cursor-pointer"
                gap={4}
                onClick={() => setIsBadgeVisible(!isBadgeVisible)}
              >
                <CircleQuestion />
                <Flex flexDirection={"column"} justifyContent={"center"}>
                  <Text className="text-slate-50 text-sm font-normal leading-tight">
                    What is a badge?
                  </Text>
                </Flex>
              </Flex>
              <Collapse in={isBadgeVisible} animateOpacity>
                <Box p="40px" color="white" pt="20px" pb="20px">
                  The badges are created with EAS and managed by Trustful, it
                  aggregates reputation based on interactions and contributions
                  during Zuitzerland. It allows members to give and
                  receive badges recognizing their contributions and knowledge,
                  fostering real connections and deep dialogues, therefore
                  helping to build reputation scores.
                </Box>
              </Collapse>
              <Divider className="border-slate-50 opacity-10 w-full" />
              <Flex
                className="w-full flex-row py-3 cursor-pointer"
                gap={4}
                onClick={() => setIsCheckoutForVisible(!isCheckoutForVisible)}
              >
                <CircleQuestion />
                <Flex flexDirection={"column"} justifyContent={"center"}>
                  <Text className="text-slate-50 text-sm font-normal leading-tight">
                    What is the check-out for?
                  </Text>
                </Flex>
              </Flex>
              <Collapse in={isCheckoutForVisible} animateOpacity>
                <Box p="40px" color="white" pt="20px" pb="20px">
                  The check-out badge confirms that you are ending your stay at
                  Zuitzerland. It will be used to calculate how long you
                  lived in our ZuVillage, which will aggregate to your
                  ZuVillager reputation score. It will also help us keep track
                  of how many people are currently present.
                </Box>
              </Collapse>
              <Divider className="border-slate-50 opacity-10 w-full" />

              <Flex
                className="w-full flex-row py-3 cursor-pointer"
                gap={4}
                onClick={() => setToDoNowVisible(!isToDoNowVisible)}
              >
                <CircleQuestion />
                <Flex flexDirection={"column"} justifyContent={"center"}>
                  <Text className="text-slate-50 text-sm font-normal leading-tight">
                    What to do now?
                  </Text>
                </Flex>
              </Flex>
              <Collapse in={isToDoNowVisible} animateOpacity>
                <Box p="40px" color="white" pt="20px" pb="20px">
                  Now that you have connected your wallet, you need to do the
                  check-in.
                  <UnorderedList styleType="disc" pl={4}>
                    {" "}
                    <ListItem>
                      {" "}
                      Your check-in badge will be your first badge, unlocking
                      the creation of other badges.
                    </ListItem>
                    <ListItem>
                      {" "}
                      By engaging with the event—whether you agree or disagree
                      with someone, participate in talks, or create sessions—you
                      can earn badges or respond to them.
                    </ListItem>
                    <ListItem>
                      {" "}
                      This process builds your reputation, ties to your address
                      and based on your interactions shapes your reputation
                      score.
                    </ListItem>
                  </UnorderedList>
                </Box>
              </Collapse>

              <Divider className="border-slate-50 opacity-10 w-full" />
              <Flex
                className="w-full flex-row py-3 cursor-pointer"
                gap={4}
                onClick={() => setIsAboutPrivacyVisible(!isAboutPrivacyVisible)}
              >
                <CircleQuestion />
                <Flex flexDirection={"column"} justifyContent={"center"}>
                  <Text className="text-slate-50 text-sm font-normal leading-tight">
                    About privacy
                  </Text>
                </Flex>
              </Flex>
              <Collapse in={isAboutPrivacyVisible} animateOpacity>
                <Box p="40px" color="white" pt="20px" pb="20px">
                  Trustful uses EAS to issue on-chain badges. Choose your wallet
                  carefully and issue badges and comments, keeping blockchain
                  permanence in mind. We are working to enhance it soon and keep
                  the privacy-first core in our roadmap.
                </Box>
              </Collapse>
            </Flex>
          </Box>
          <TheFooterNavbar />
        </>
      ) : (
        <Box flex={1} className="flex justify-center items-center">
          <BeatLoader size={8} color="#B1EF42" />
        </Box>
      )}
    </Flex>
  );
};
