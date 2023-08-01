import LineChart from "@/components/LineChart";

const PriceChart = ({ price }: { price: number }) => {
  return (
    <div className="p-5 rounded-xl bg-primary-100">
      <LineChart price={price} />
    </div>
  );
};

export default PriceChart;
