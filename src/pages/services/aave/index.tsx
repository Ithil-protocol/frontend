import { useRouter } from "next/router";

import TokenModal from "@/components/TokenModal";

const AavePage = () => {
  const router = useRouter();

  const handleSelectToken = (tokenName: string) => {
    router.push(`/services/aave/${tokenName}`);
  };
  return (
    <>
      <TokenModal isOpen onSelectToken={handleSelectToken} />
    </>
  );
};

export default AavePage;
