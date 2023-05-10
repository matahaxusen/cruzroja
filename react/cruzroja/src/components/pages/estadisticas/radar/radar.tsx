import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';

interface DataPoint {
  subject: string;
  value: number;
}

interface Props {
  data: DataPoint[];
}

const HeptagonalChart = ({ data }: Props) => {
  return (
    <RadarChart
      cx={300}
      cy={250}
      outerRadius={150}
      width={600}
      height={500}
      data={data}
    >
      <PolarGrid />
      <PolarAngleAxis dataKey="subject" />
      <Radar
        name="Puntuación"
        dataKey="value"
        stroke="#b32821"
        fill="#b32821"
        fillOpacity={0.6}
      />
    </RadarChart>
  );
};

export default HeptagonalChart;
