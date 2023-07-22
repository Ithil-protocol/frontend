import services from "@/data/services.json";

import ServiceCard from "./ServiceCard";

const ServicesPage = () => {
  return (
    <div className="grid gap-6 mg:gap-6 md:grid-cols-2 lg:grid-cols-3 rounded-xl">
      {services.map((item, index) => (
        <ServiceCard
          key={item.name + index}
          assets={item.tokens}
          description={item.description}
          to={item.url}
          hasIndex={item.hasIndex}
          multiplier={`${item.apyRange}%`}
          name={item.name}
          apy={`${item.bestApy}%`}
          tvl={`${item.tvl}m`}
        />
      ))}
    </div>
  );
};

export default ServicesPage;
