import { useRouter } from "next/router";

import TokenModal from "@/components/TokenModal";

const ServiceAsset = () => {
  const router = useRouter();

  const handleSelectToken = (tokenName: string) => {
    router.push(`/services/${router.query.service}/${tokenName}`);
  };
  return (
    <>
      <TokenModal isOpen onSelectToken={handleSelectToken} />
    </>
  );
};

export default ServiceAsset;
