import { useState } from "react";

import TokenModal from "@/components/TokenModal";
import services from "@/data/services.json";

import ServiceCard from "./ServiceCard";

const ServicesPage = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenModal = () => {
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
  };

  return (
    <div className="grid gap-6 mg:gap-6 md:grid-cols-2 lg:grid-cols-3 rounded-xl">
      {services.map((item, index) => (
        <ServiceCard
          onOpenModal={handleOpenModal}
          key={item.name + index}
          assets={item.tokens}
          description={item.description}
          to={item.url}
          multiplier={`${item.apyRange}%`}
          name={item.name}
          apy={`${item.bestApy}%`}
          tvl={`${item.tvl}m`}
        />
      ))}

      <TokenModal onClose={handleCloseModal} isOpen={isOpen} />
    </div>
  );
};

export default ServicesPage;
