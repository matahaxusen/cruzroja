import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface PalabraCount {
  palabra: string;
  count: number;
}

interface Props {
  palabras: PalabraCount[];
}


export const PalabrasChart: React.FC<Props> = ({ palabras }) => {

  const palabrasMostradas = palabras.slice(0, 7); // muestra las 5 primeras palabras o menos

  return (
    <BarChart
        width={500}
        height={300}
        data={palabrasMostradas}
        margin={{
            top: 5, right: 30, left: 20, bottom: 5,
        }}
        >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="palabra" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="count" fill="#8884d8" />
    </BarChart>
  );
};

export default PalabrasChart;