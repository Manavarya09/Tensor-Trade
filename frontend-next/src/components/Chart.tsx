'use client';

import React, { useEffect, useRef } from 'react';
import { createChart, ColorType, CandlestickSeries } from 'lightweight-charts';

interface ChartProps {
  data?: any[]; // Allow flexibility for demo data
}

export const Chart: React.FC<ChartProps> = ({ data }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: '#ffffff' },
        textColor: '#000000',
      },
      grid: {
        vertLines: { color: '#e5e5e5' },
        horzLines: { color: '#e5e5e5' },
      },
      width: chartContainerRef.current.clientWidth,
      height: 300,
    });

    chartRef.current = chart;

    try {
      const candlestickSeries = chart.addSeries(CandlestickSeries, {
        upColor: '#ffffff',
        downColor: '#ff4500',
        borderVisible: true,
        wickUpColor: '#000000',
        wickDownColor: '#ff4500',
        borderUpColor: '#000000',
        borderDownColor: '#000000',
      });

      // Generate dummy data if none provided
      const initialData = data || generateData();
      candlestickSeries.setData(initialData);
    } catch (error) {
      console.error('Error initializing chart:', error);
    }

    const handleResize = () => {
        if (chartContainerRef.current && chartRef.current) {
            chartRef.current.applyOptions({ width: chartContainerRef.current.clientWidth });
        }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (chartRef.current) {
        chartRef.current.remove();
      }
    };
  }, [data]);

  return <div ref={chartContainerRef} className="w-full h-[300px] border-2 border-black" />;
};

function generateData() {
    const data = [];
    let time = new Date(Date.now() - 100 * 24 * 60 * 60 * 1000);
    let value = 100;
    for (let i = 0; i < 100; i++) {
        const open = value + (Math.random() - 0.5) * 5;
        const high = open + Math.random() * 2;
        const low = open - Math.random() * 2;
        const close = (open + high + low) / 3 + (Math.random() - 0.5) * 2;

        data.push({
            time: time.toISOString().split('T')[0],
            open,
            high,
            low,
            close,
        });

        value = close;
        time.setDate(time.getDate() + 1);
    }
    return data;
}
